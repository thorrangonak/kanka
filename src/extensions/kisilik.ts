/**
 * Kişilik (Persona) Extension
 *
 * Kullanıcının seçebileceği farklı agent kişilikleri:
 *   - kanka  (varsayılan, samimi/profesyonel)
 *   - hoca   (öğretici, "neden" açıklayan)
 *   - abi    (senior dev, direkt)
 *   - patron (pragmatik, MVP odaklı)
 *
 * Komutlar:
 *   /kisilik              — Mevcut kişiliği ve listeyi göster
 *   /kisilik <isim>       — Kişilik değiştir
 *   /kisilikler           — Detaylı kişilik listesi
 *
 * Çalışma şekli:
 *   - Seçilen persona ~/.kanka/aktif-kisilik dosyasında saklanır.
 *   - Her turn başında before_agent_start ile sistem prompt'a eklenir.
 *   - kanka.md varsayılan zaten temel KANKA_SYSTEM_PROMPT'a yakın olduğu için
 *     onun seçilmesi davranışı değiştirmez (idempotent).
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { parseFrontmatter } from "@earendil-works/pi-coding-agent";

const KANKA_DIR = path.join(os.homedir(), ".kanka");
const AKTIF_DOSYA = path.join(KANKA_DIR, "aktif-kisilik");
const VARSAYILAN_KISILIK = "kanka";

interface Persona {
	name: string;
	description: string;
	emoji: string;
	icerik: string; // Frontmatter'dan sonraki Markdown gövde
	yol: string;
}

/**
 * Bundled personalar dizini (dist/bundled-personas/).
 * Build sırasında bundled-personas/*.md dist'e kopyalanır.
 */
function bundledPersonaDizini(): string {
	const here = path.dirname(fileURLToPath(import.meta.url));
	// dist/extensions/kisilik.js → dist/bundled-personas/
	return path.resolve(here, "..", "bundled-personas");
}

/**
 * Kullanıcı özel personaları (~/.kanka/personas/*.md).
 * Burada bundled olanları override edebilir veya yeni eklenebilir.
 */
function kullaniciPersonaDizini(): string {
	return path.join(KANKA_DIR, "personas");
}

function tumPersonalariYukle(): Persona[] {
	const personalar = new Map<string, Persona>();

	// Önce bundled
	for (const dizin of [bundledPersonaDizini(), kullaniciPersonaDizini()]) {
		if (!fs.existsSync(dizin)) continue;
		try {
			const dosyalar = fs.readdirSync(dizin).filter((f) => f.endsWith(".md"));
			for (const dosya of dosyalar) {
				const yol = path.join(dizin, dosya);
				try {
					const ham = fs.readFileSync(yol, "utf-8");
					const { frontmatter, body } = parseFrontmatter<Record<string, string>>(ham);
					const ad = frontmatter.name ?? path.basename(dosya, ".md");
					personalar.set(ad, {
						name: ad,
						description: frontmatter.description ?? "",
						emoji: frontmatter.emoji ?? "🎭",
						icerik: body,
						yol,
					});
				} catch {
					// Bozuk dosya — atla
				}
			}
		} catch {
			// Dizin okunamadı — atla
		}
	}

	return Array.from(personalar.values()).sort((a, b) =>
		a.name.localeCompare(b.name, "tr"),
	);
}

function aktifKisilikOku(): string {
	try {
		if (fs.existsSync(AKTIF_DOSYA)) {
			const icerik = fs.readFileSync(AKTIF_DOSYA, "utf-8").trim();
			if (icerik) return icerik;
		}
	} catch {
		// Yok say
	}
	return VARSAYILAN_KISILIK;
}

function aktifKisilikYaz(ad: string): void {
	try {
		fs.mkdirSync(KANKA_DIR, { recursive: true });
		fs.writeFileSync(AKTIF_DOSYA, ad, "utf-8");
	} catch (e: unknown) {
		const mesaj = e instanceof Error ? e.message : String(e);
		throw new Error(`Aktif kişilik dosyası yazılamadı: ${mesaj}`);
	}
}

function personaBul(ad: string, personalar: Persona[]): Persona | null {
	const temiz = ad.trim().toLowerCase();
	return personalar.find((p) => p.name.toLowerCase() === temiz) ?? null;
}

export default function kisilikExtension(pi: ExtensionAPI) {
	// Sistem prompt'a aktif persona içeriğini ekle
	pi.on("before_agent_start", async (event) => {
		const aktif = aktifKisilikOku();
		if (aktif === VARSAYILAN_KISILIK) {
			// Varsayılan zaten KANKA_SYSTEM_PROMPT içinde, tekrar enjekte etme
			return undefined;
		}

		const personalar = tumPersonalariYukle();
		const persona = personaBul(aktif, personalar);
		if (!persona) {
			// Geçersiz persona — sessiz geç
			return undefined;
		}

		return {
			systemPrompt:
				`${event.systemPrompt}\n\n---\n\n` +
				`## Aktif Kişilik: ${persona.emoji} ${persona.name}\n\n` +
				persona.icerik.trim(),
		};
	});

	// /kisilik komutu
	const kisilikHandler = async (
		args: string | undefined,
		ctx: { ui: { notify: (msg: string, kind?: "info" | "warning" | "error") => void } },
	): Promise<void> => {
		const arg = args?.trim();
		const personalar = tumPersonalariYukle();
		const aktif = aktifKisilikOku();

		// Argüman yok: durumu göster
		if (!arg) {
			const satirlar: string[] = [
				"",
				"🎭 Kişilikler — kanka'nın kim olarak konuşacağı",
				"─".repeat(60),
				`  Şu an aktif: ${aktif}`,
				"",
				"Seçenekler:",
				...personalar.map((p) => {
					const isaret = p.name === aktif ? "✓" : "·";
					return `  ${isaret} ${p.emoji} ${p.name.padEnd(10)} — ${p.description}`;
				}),
				"",
				"Değiştirmek için: /kisilik <isim>",
				"Detay için       : /kisilikler",
				"",
			];
			ctx.ui.notify(satirlar.join("\n"), "info");
			return;
		}

		// Persona seç
		const persona = personaBul(arg, personalar);
		if (!persona) {
			const mevcutlar = personalar.map((p) => p.name).join(", ");
			ctx.ui.notify(
				`Bilmediğim kişilik: "${arg}".\nMevcut: ${mevcutlar}`,
				"error",
			);
			return;
		}

		try {
			aktifKisilikYaz(persona.name);
			ctx.ui.notify(
				`Aktif kişilik: ${persona.emoji} ${persona.name} ✓\n` +
					`Yeni mesajdan itibaren bu tonla konuşacağım.`,
				"info",
			);
		} catch (e: unknown) {
			const mesaj = e instanceof Error ? e.message : String(e);
			ctx.ui.notify(`Hata: ${mesaj}`, "error");
		}
	};

	pi.registerCommand("kisilik", {
		description: "Aktif kişiliği değiştir (kanka/hoca/abi/patron)",
		handler: kisilikHandler,
		getArgumentCompletions: (prefix) => {
			const personalar = tumPersonalariYukle();
			const eslesen = personalar
				.filter((p) => p.name.toLowerCase().startsWith(prefix.toLowerCase()))
				.map((p) => ({ value: p.name, label: `${p.emoji} ${p.name} — ${p.description}` }));
			return eslesen.length > 0 ? eslesen : null;
		},
	});

	// Türkçe karakter alternatifi
	pi.registerCommand("kişilik", {
		description: "Aktif kişiliği değiştir (Türkçe karakterli alias)",
		handler: kisilikHandler,
	});

	// /kisilikler — detaylı liste
	pi.registerCommand("kisilikler", {
		description: "Tüm kişiliklerin detaylı listesi",
		handler: async (_args, ctx) => {
			const personalar = tumPersonalariYukle();
			const aktif = aktifKisilikOku();
			const satirlar: string[] = ["", "🎭 Kişilik kataloğu", "═".repeat(60), ""];

			for (const p of personalar) {
				const isaret = p.name === aktif ? "● AKTİF" : "○";
				satirlar.push(`${p.emoji} ${p.name}  ${isaret}`);
				satirlar.push(`   ${p.description}`);
				satirlar.push(`   Dosya: ${p.yol}`);
				satirlar.push("");
			}

			satirlar.push("Kendi kişiliğini ekle:");
			satirlar.push(`  ${kullaniciPersonaDizini()}/<isim>.md`);
			satirlar.push("");
			satirlar.push("Frontmatter şeması:");
			satirlar.push("  ---");
			satirlar.push("  name: <isim>");
			satirlar.push("  description: <kısa açıklama>");
			satirlar.push("  emoji: <emoji>");
			satirlar.push("  ---");
			satirlar.push("");

			ctx.ui.notify(satirlar.join("\n"), "info");
		},
	});
}
