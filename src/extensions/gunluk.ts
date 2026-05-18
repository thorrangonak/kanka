/**
 * Günlük (Journal) Extension
 *
 * Geliştirici günlüğü — kararlar, fix'ler, deployment notları, öğrendiklerin
 * proje bazında ~/.kanka/gunlukler/<proje>.jsonl içine kaydedilir.
 *
 * Komutlar:
 *   /gunluk yaz <metin>     — Yeni giriş ekle
 *   /gunluk bugun           — Bugünün girişlerini göster
 *   /gunluk ara <kelime>    — Girişlerde ara (substring)
 *   /gunluk son [N]         — Son N giriş (varsayılan 10)
 *   /gunluk istatistik      — Toplam giriş, ilk/son tarih
 *   /gunluk                 — Yardım metni
 *
 * Türkçe karakter alternatifi: /günlük
 *
 * Format: her satır bir JSON object
 *   { ts: ISO8601, proje: "kanka", metin: "...", etiketler: ["fix","db"] }
 *
 * Etiket sözdizimi: metin içinde #etiket geçerse otomatik parse edilir.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const KANKA_DIR = path.join(os.homedir(), ".kanka");
const GUNLUK_DIR = path.join(KANKA_DIR, "gunlukler");
const MAKS_AR_SONUC = 50;

interface GunlukKayit {
	ts: string;
	proje: string;
	metin: string;
	etiketler: string[];
}

function projeAdi(cwd: string): string {
	// cwd'nin son segmenti proje adı olarak kullanılır
	return path.basename(cwd) || "default";
}

function gunlukDosyaYolu(cwd: string): string {
	return path.join(GUNLUK_DIR, `${projeAdi(cwd)}.jsonl`);
}

function dizinHazirla(): void {
	fs.mkdirSync(GUNLUK_DIR, { recursive: true });
}

function etiketleriCikar(metin: string): string[] {
	const eslesme = metin.match(/#[\p{L}\p{N}_-]+/gu);
	if (!eslesme) return [];
	return Array.from(new Set(eslesme.map((e) => e.slice(1).toLowerCase())));
}

function girisYaz(cwd: string, metin: string): GunlukKayit {
	dizinHazirla();
	const kayit: GunlukKayit = {
		ts: new Date().toISOString(),
		proje: projeAdi(cwd),
		metin: metin.trim(),
		etiketler: etiketleriCikar(metin),
	};
	const satir = JSON.stringify(kayit) + "\n";
	fs.appendFileSync(gunlukDosyaYolu(cwd), satir, "utf-8");
	return kayit;
}

function tumKayitlariOku(cwd: string): GunlukKayit[] {
	const yol = gunlukDosyaYolu(cwd);
	if (!fs.existsSync(yol)) return [];
	try {
		const ham = fs.readFileSync(yol, "utf-8");
		const kayitlar: GunlukKayit[] = [];
		for (const satir of ham.split("\n")) {
			if (!satir.trim()) continue;
			try {
				const k = JSON.parse(satir) as GunlukKayit;
				if (k.ts && k.metin) kayitlar.push(k);
			} catch {
				// Bozuk satır — atla
			}
		}
		return kayitlar;
	} catch {
		return [];
	}
}

function tarihFormat(iso: string): string {
	try {
		const d = new Date(iso);
		const gun = String(d.getDate()).padStart(2, "0");
		const ay = String(d.getMonth() + 1).padStart(2, "0");
		const yil = d.getFullYear();
		const sa = String(d.getHours()).padStart(2, "0");
		const dk = String(d.getMinutes()).padStart(2, "0");
		return `${gun}.${ay}.${yil} ${sa}:${dk}`;
	} catch {
		return iso;
	}
}

function kayitGoster(k: GunlukKayit): string {
	const tarih = tarihFormat(k.ts);
	const etk = k.etiketler.length > 0 ? `  [${k.etiketler.map((e) => `#${e}`).join(" ")}]` : "";
	return `  ${tarih}${etk}\n  → ${k.metin}`;
}

function bugunMu(iso: string): boolean {
	try {
		const d = new Date(iso);
		const simdi = new Date();
		return (
			d.getFullYear() === simdi.getFullYear() &&
			d.getMonth() === simdi.getMonth() &&
			d.getDate() === simdi.getDate()
		);
	} catch {
		return false;
	}
}

function yardimMetni(): string[] {
	return [
		"",
		"📓 kanka günlük — geliştirme notları",
		"─".repeat(60),
		"  /gunluk yaz <metin>     Yeni giriş ekle",
		"  /gunluk bugun           Bugünün girişleri",
		"  /gunluk son [N]         Son N giriş (varsayılan 10)",
		"  /gunluk ara <kelime>    Girişlerde ara",
		"  /gunluk istatistik      İstatistik özeti",
		"",
		"Etiket: metinde #etiket geçirirsen otomatik parse edilir.",
		`Dosya : ${GUNLUK_DIR}/<proje>.jsonl`,
		"",
	];
}

type GunlukCtx = {
	cwd: string;
	ui: { notify: (msg: string, kind?: "info" | "warning" | "error") => void };
};

function altKomutCalistir(
	altKomut: string,
	arg: string,
	ctx: GunlukCtx,
): void {
	const cwd = ctx.cwd;

	switch (altKomut) {
		case "yaz":
		case "ekle":
		case "not": {
			if (!arg) {
				ctx.ui.notify("Ne yazacağım kanka? Örn: /gunluk yaz bug fix #auth", "warning");
				return;
			}
			try {
				const kayit = girisYaz(cwd, arg);
				const etk =
					kayit.etiketler.length > 0
						? ` [${kayit.etiketler.map((e) => `#${e}`).join(" ")}]`
						: "";
				ctx.ui.notify(`✓ Günlüğe yazdım${etk}\n  → ${kayit.metin}`, "info");
			} catch (e: unknown) {
				const mesaj = e instanceof Error ? e.message : String(e);
				ctx.ui.notify(`Hata: ${mesaj}`, "error");
			}
			return;
		}

		case "bugun":
		case "bugün": {
			const tum = tumKayitlariOku(cwd);
			const bugun = tum.filter((k) => bugunMu(k.ts));
			if (bugun.length === 0) {
				ctx.ui.notify(`Bugün için kayıt yok kanka (${projeAdi(cwd)}).`, "info");
				return;
			}
			const satirlar = [
				"",
				`📓 Bugün (${bugun.length} giriş) — ${projeAdi(cwd)}`,
				"─".repeat(60),
				...bugun.map(kayitGoster),
				"",
			];
			ctx.ui.notify(satirlar.join("\n"), "info");
			return;
		}

		case "son":
		case "last": {
			const tum = tumKayitlariOku(cwd);
			const n = Math.max(1, Math.min(100, Number.parseInt(arg, 10) || 10));
			const sonN = tum.slice(-n).reverse();
			if (sonN.length === 0) {
				ctx.ui.notify(`Henüz kayıt yok (${projeAdi(cwd)}).`, "info");
				return;
			}
			const satirlar = [
				"",
				`📓 Son ${sonN.length} giriş — ${projeAdi(cwd)}`,
				"─".repeat(60),
				...sonN.map(kayitGoster),
				"",
			];
			ctx.ui.notify(satirlar.join("\n"), "info");
			return;
		}

		case "ara":
		case "search": {
			if (!arg) {
				ctx.ui.notify("Ne arayayım? Örn: /gunluk ara auth", "warning");
				return;
			}
			const tum = tumKayitlariOku(cwd);
			const aranan = arg.toLowerCase();
			const eslesen = tum.filter(
				(k) =>
					k.metin.toLowerCase().includes(aranan) ||
					k.etiketler.some((e) => e.includes(aranan)),
			);
			if (eslesen.length === 0) {
				ctx.ui.notify(`"${arg}" için eşleşme yok.`, "info");
				return;
			}
			const gosterilen = eslesen.slice(-MAKS_AR_SONUC).reverse();
			const satirlar = [
				"",
				`🔍 "${arg}" için ${eslesen.length} sonuç` +
					(eslesen.length > MAKS_AR_SONUC ? ` (son ${MAKS_AR_SONUC} gösterildi)` : ""),
				"─".repeat(60),
				...gosterilen.map(kayitGoster),
				"",
			];
			ctx.ui.notify(satirlar.join("\n"), "info");
			return;
		}

		case "istatistik":
		case "stats": {
			const tum = tumKayitlariOku(cwd);
			if (tum.length === 0) {
				ctx.ui.notify(`Henüz kayıt yok (${projeAdi(cwd)}).`, "info");
				return;
			}
			const ilk = tum[0];
			const son = tum[tum.length - 1];
			const etiketSay = new Map<string, number>();
			for (const k of tum) {
				for (const e of k.etiketler) {
					etiketSay.set(e, (etiketSay.get(e) ?? 0) + 1);
				}
			}
			const enCokEtiket = Array.from(etiketSay.entries())
				.sort((a, b) => b[1] - a[1])
				.slice(0, 5)
				.map(([e, n]) => `#${e}(${n})`)
				.join(" ");

			const satirlar = [
				"",
				`📊 Günlük istatistik — ${projeAdi(cwd)}`,
				"─".repeat(60),
				`  Toplam giriş : ${tum.length}`,
				`  İlk          : ${tarihFormat(ilk.ts)}`,
				`  Son          : ${tarihFormat(son.ts)}`,
				`  Bugün        : ${tum.filter((k) => bugunMu(k.ts)).length}`,
				`  En çok etiket: ${enCokEtiket || "(yok)"}`,
				`  Dosya        : ${gunlukDosyaYolu(cwd)}`,
				"",
			];
			ctx.ui.notify(satirlar.join("\n"), "info");
			return;
		}

		case "yardim":
		case "yardım":
		case "help":
		case "":
			ctx.ui.notify(yardimMetni().join("\n"), "info");
			return;

		default:
			ctx.ui.notify(
				`Bilmediğim alt komut: "${altKomut}".\n${yardimMetni().join("\n")}`,
				"warning",
			);
	}
}

async function handler(args: string | undefined, ctx: GunlukCtx): Promise<void> {
	const raw = (args ?? "").trim();
	if (!raw) {
		ctx.ui.notify(yardimMetni().join("\n"), "info");
		return;
	}

	// İlk kelime alt komut, gerisi argüman
	const bosluk = raw.indexOf(" ");
	const altKomut = (bosluk === -1 ? raw : raw.slice(0, bosluk)).toLowerCase();
	const arg = bosluk === -1 ? "" : raw.slice(bosluk + 1).trim();

	altKomutCalistir(altKomut, arg, ctx);
}

const ALT_KOMUTLAR = [
	{ value: "yaz", label: "yaz <metin> — yeni giriş" },
	{ value: "bugun", label: "bugun — bugünün girişleri" },
	{ value: "son", label: "son [N] — son N giriş" },
	{ value: "ara", label: "ara <kelime> — substring arama" },
	{ value: "istatistik", label: "istatistik — özet" },
];

export default function gunlukExtension(pi: ExtensionAPI) {
	pi.registerCommand("gunluk", {
		description: "Geliştirme günlüğü (yaz/bugun/son/ara/istatistik)",
		handler,
		getArgumentCompletions: (prefix: string) => {
			// Sadece ilk kelimede tamamla
			if (prefix.includes(" ")) return null;
			const eslesen = ALT_KOMUTLAR.filter((k) =>
				k.value.startsWith(prefix.toLowerCase()),
			);
			return eslesen.length > 0 ? eslesen : null;
		},
	});

	// Türkçe karakter alternatifi
	pi.registerCommand("günlük", {
		description: "Geliştirme günlüğü (Türkçe karakterli alias)",
		handler,
	});
}
