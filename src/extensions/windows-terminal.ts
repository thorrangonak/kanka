/**
 * Windows Terminal Entegrasyonu
 *
 * - Tab title'ı dinamik olarak günceller: "kanka · düşünüyor", "kanka · komut: bash"...
 * - Uzun süren tool çağrıları bitince OSC 9 ile masaüstü bildirimi gönderir.
 * - Agent bitince tab title'ı "kanka · hazır" olarak resetler.
 *
 * Desteklenen terminaller:
 *   - Windows Terminal (OSC 0 + OSC 9 destekler)
 *   - WezTerm (OSC 0 + OSC 9 destekler)
 *   - iTerm2 (OSC 0 destekler; OSC 9 bildirim)
 *   - ConEmu / cmd.exe — kısmen
 *
 * OSC kaçış kodları:
 *   ESC ]0;<text>BEL    — Tab/window title set
 *   ESC ]9;<text>BEL    — Desktop notification (Windows Terminal & iTerm2)
 *
 * Devre dışı bırakma:
 *   KANKA_NO_TERMINAL_INTEGRATION=1
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const ESC = "\x1b";
const BEL = "\x07";
const ENABLE_ENV = "KANKA_NO_TERMINAL_INTEGRATION";

/**
 * Tool çağrıları bu süreden uzun sürerse bildirim göster (ms).
 * 30s default — agent'ın kullanıcıya geri dönmesini bekleyenler için.
 */
const UZUN_TOOL_ESIK_MS = 30_000;

/**
 * Tool isimlerinden Türkçe etiket üret (status için).
 */
const TOOL_ETIKET: Record<string, string> = {
	bash: "komut çalıştırıyor",
	read: "dosya okuyor",
	write: "dosya yazıyor",
	edit: "düzenliyor",
	web_fetch: "web'den çekiyor",
	delegate: "subagent çağırıyor",
};

function entegrasyonAcikMi(): boolean {
	if (process.env[ENABLE_ENV]) return false;
	// TTY değilse anlamsız (pipe veya CI)
	if (!process.stdout.isTTY) return false;
	return true;
}

function titleYaz(metin: string): void {
	if (!entegrasyonAcikMi()) return;
	try {
		// OSC 0 hem icon hem window title — Windows Terminal'da tab title olarak görünür
		process.stdout.write(`${ESC}]0;${metin}${BEL}`);
	} catch {
		// Sessiz başarısız
	}
}

function bildirimGonder(baslik: string, mesaj?: string): void {
	if (!entegrasyonAcikMi()) return;
	try {
		// OSC 9 — Windows Terminal toast notification
		// Format: ESC ]9; <text> BEL
		// Windows Terminal sadece tek text alanı destekler; başlık ve mesajı birleştirelim
		const tam = mesaj ? `${baslik}: ${mesaj}` : baslik;
		process.stdout.write(`${ESC}]9;${tam}${BEL}`);
	} catch {
		// Sessiz başarısız
	}
}

function toolEtiketi(toolName: string): string {
	return TOOL_ETIKET[toolName] ?? `${toolName} çalıştırıyor`;
}

export default function windowsTerminalExtension(pi: ExtensionAPI) {
	if (!entegrasyonAcikMi()) {
		// TTY yok veya devre dışı — extension yüklensin ama hiçbir şey yapmasın
		return;
	}

	// Tool başlangıç zamanlarını izle (uzun çalışan tool bildirimi için)
	const toolBaslangic = new Map<string, { name: string; ts: number }>();

	// Session başlayınca "hazır" yaz
	pi.on("session_start", () => {
		titleYaz("kanka · hazır");
	});

	// Agent çalışmaya başladı
	pi.on("agent_start", () => {
		titleYaz("kanka · düşünüyor…");
	});

	// Tool çalıştırılırken durum göster
	pi.on("tool_execution_start", (event) => {
		const etiket = toolEtiketi(event.toolName);
		titleYaz(`kanka · ${etiket}`);
		toolBaslangic.set(event.toolCallId, {
			name: event.toolName,
			ts: Date.now(),
		});
	});

	pi.on("tool_execution_end", (event) => {
		const baslangic = toolBaslangic.get(event.toolCallId);
		toolBaslangic.delete(event.toolCallId);

		if (!baslangic) return;
		const sure = Date.now() - baslangic.ts;
		if (sure >= UZUN_TOOL_ESIK_MS) {
			// Uzun süren tool bittiğinde bildirim
			const saniye = Math.round(sure / 1000);
			const durum = event.isError ? "hata ile bitti" : "tamamlandı";
			bildirimGonder(
				"kanka",
				`${baslangic.name} ${durum} (${saniye}s)`,
			);
		}
	});

	// Agent bitince hazır state'ine dön + bildirim
	pi.on("agent_end", () => {
		titleYaz("kanka · hazır");
		// Sadece terminal odaklı değilse anlamlı — basitçe her zaman gönder,
		// kullanıcı terminal'e bakıyorsa zaten görmez (Windows Terminal arka plan'da toast)
		bildirimGonder("kanka", "cevabım hazır");
	});

	// Hata durumları için ekstra hook
	pi.on("session_shutdown", () => {
		// Terminal title'ı temizle ki kullanıcı şaşırmasın
		titleYaz("");
	});

	// /tab-title komutu — manuel test/override için
	pi.registerCommand("tab-title", {
		description: "Terminal tab title'ını manuel ayarla (test/debug)",
		handler: async (args, ctx) => {
			const metin = args?.trim() ?? "kanka";
			titleYaz(metin);
			ctx.ui.notify(`Tab title: "${metin}" olarak ayarlandı.`, "info");
		},
	});

	// /bildir komutu — manuel test
	pi.registerCommand("bildir", {
		description: "Test bildirimi gönder (OSC 9)",
		handler: async (args, ctx) => {
			const mesaj = args?.trim() ?? "test bildirimi";
			bildirimGonder("kanka", mesaj);
			ctx.ui.notify(
				`Bildirim gönderildi: "${mesaj}"\n` +
					`(Windows Terminal/WezTerm'de toast olarak görünür)`,
				"info",
			);
		},
	});
}
