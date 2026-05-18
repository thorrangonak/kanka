/**
 * /istatistik — Kanka kullanım analitiği (lokal)
 *
 * - Telemetri yok, ağ çağrısı yok. Tüm veri lokal.
 * - Kaynaklar:
 *   - ~/.kanka/gunlukler/*.jsonl     → günlük girişleri
 *   - ~/.kanka/aktif-kisilik          → aktif persona
 *   - ~/.kanka/son-versiyon-kontrol   → versiyon cache
 *   - Mevcut session bilgileri (ctx.sessionManager)
 *
 * Komutlar:
 *   /istatistik          — Genel özet
 *   /istatistik gunluk   — Günlük detayları
 *   /istatistik persona  — Persona kullanım dağılımı (gelecek versiyonda)
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { KANKA_VERSION } from "../version.js";

const KANKA_DIR = path.join(os.homedir(), ".kanka");
const GUNLUK_DIR = path.join(KANKA_DIR, "gunlukler");

interface GunlukKayit {
	ts: string;
	proje: string;
	metin: string;
	etiketler: string[];
}

interface ProjeIstatistik {
	proje: string;
	toplam: number;
	bugun: number;
	ilkTarih: string | null;
	sonTarih: string | null;
}

function bugunMu(iso: string): boolean {
	try {
		const d = new Date(iso);
		const s = new Date();
		return (
			d.getFullYear() === s.getFullYear() &&
			d.getMonth() === s.getMonth() &&
			d.getDate() === s.getDate()
		);
	} catch {
		return false;
	}
}

function tarihFormat(iso: string | null): string {
	if (!iso) return "—";
	try {
		const d = new Date(iso);
		return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
	} catch {
		return iso;
	}
}

function dosyadanKayitlariOku(yol: string): GunlukKayit[] {
	if (!fs.existsSync(yol)) return [];
	try {
		const ham = fs.readFileSync(yol, "utf-8");
		const sonuc: GunlukKayit[] = [];
		for (const satir of ham.split("\n")) {
			if (!satir.trim()) continue;
			try {
				const k = JSON.parse(satir) as GunlukKayit;
				if (k.ts && k.metin) sonuc.push(k);
			} catch {
				// bozuk satır, atla
			}
		}
		return sonuc;
	} catch {
		return [];
	}
}

function tumGunlukleriTopla(): { tum: GunlukKayit[]; projeler: ProjeIstatistik[] } {
	const projeler: ProjeIstatistik[] = [];
	const tum: GunlukKayit[] = [];

	if (!fs.existsSync(GUNLUK_DIR)) {
		return { tum, projeler };
	}

	try {
		const dosyalar = fs.readdirSync(GUNLUK_DIR).filter((f) => f.endsWith(".jsonl"));
		for (const dosya of dosyalar) {
			const projeAd = path.basename(dosya, ".jsonl");
			const kayitlar = dosyadanKayitlariOku(path.join(GUNLUK_DIR, dosya));
			if (kayitlar.length === 0) continue;

			const bugunSay = kayitlar.filter((k) => bugunMu(k.ts)).length;
			projeler.push({
				proje: projeAd,
				toplam: kayitlar.length,
				bugun: bugunSay,
				ilkTarih: kayitlar[0]?.ts ?? null,
				sonTarih: kayitlar[kayitlar.length - 1]?.ts ?? null,
			});
			tum.push(...kayitlar);
		}
	} catch {
		// dizin okunamadı
	}

	projeler.sort((a, b) => b.toplam - a.toplam);
	return { tum, projeler };
}

function aktifPersonaOku(): string {
	const yol = path.join(KANKA_DIR, "aktif-kisilik");
	try {
		if (fs.existsSync(yol)) {
			return fs.readFileSync(yol, "utf-8").trim() || "kanka";
		}
	} catch {
		// yok say
	}
	return "kanka";
}

function versiyonCacheOku(): { latest?: string; guncel?: boolean } {
	const yol = path.join(KANKA_DIR, "son-versiyon-kontrol");
	try {
		if (!fs.existsSync(yol)) return {};
		const c = JSON.parse(fs.readFileSync(yol, "utf-8")) as {
			latest?: string;
			guncelMi?: boolean;
		};
		return { latest: c.latest, guncel: c.guncelMi };
	} catch {
		return {};
	}
}

function topEtiketler(tum: GunlukKayit[], n = 5): Array<[string, number]> {
	const harita = new Map<string, number>();
	for (const k of tum) {
		for (const e of k.etiketler ?? []) {
			harita.set(e, (harita.get(e) ?? 0) + 1);
		}
	}
	return Array.from(harita.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, n);
}

function tarihBosluguGun(iso: string | null): number {
	if (!iso) return 0;
	try {
		const d = new Date(iso);
		const gun = Math.floor((Date.now() - d.getTime()) / 86400000);
		return Math.max(0, gun);
	} catch {
		return 0;
	}
}

export default function istatistikExtension(pi: ExtensionAPI) {
	pi.registerCommand("istatistik", {
		description: "Kanka kullanım istatistikleri (lokal, telemetri yok)",
		handler: async (args, ctx) => {
			const altKomut = (args ?? "").trim().toLowerCase();

			if (altKomut === "gunluk" || altKomut === "günlük") {
				return gunlukDetayi(ctx);
			}

			const { tum, projeler } = tumGunlukleriTopla();
			const persona = aktifPersonaOku();
			const verCache = versiyonCacheOku();

			// Session bilgisi
			const entries = ctx.sessionManager?.getEntries?.() ?? [];
			const sessionFile = ctx.sessionManager?.getSessionFile?.();
			const usage = ctx.getContextUsage?.();

			const tumBugun = tum.filter((k) => bugunMu(k.ts)).length;
			const enEskiKayit =
				tum.length > 0
					? [...tum].sort((a, b) => a.ts.localeCompare(b.ts))[0]
					: null;
			const gecGun = tarihBosluguGun(enEskiKayit?.ts ?? null);

			const ustEtiketler = topEtiketler(tum);
			const etiketSatir =
				ustEtiketler.length > 0
					? ustEtiketler.map(([e, n]) => `#${e}(${n})`).join("  ")
					: "(henüz etiket yok)";

			const versiyonSatir = verCache.latest
				? verCache.guncel
					? `${KANKA_VERSION} (güncel ✓)`
					: `${KANKA_VERSION} → ${verCache.latest} mevcut`
				: KANKA_VERSION;

			const ctxSatir = usage
				? `${usage.tokens ?? "?"} / ${usage.contextWindow} token (${usage.percent?.toFixed(0) ?? "?"}%)`
				: "(bilgi yok)";

			const satirlar: string[] = [
				"",
				"📊 kanka istatistik (lokal)",
				"═".repeat(70),
				"",
				"🚀 Genel",
				"─".repeat(70),
				`  Versiyon       : ${versiyonSatir}`,
				`  Aktif persona  : ${persona}`,
				`  Mevcut session : ${entries.length} mesaj`,
				`  Context kullanım: ${ctxSatir}`,
				`  Session dosya  : ${sessionFile ?? "(geçici)"}`,
				"",
				"📓 Günlük",
				"─".repeat(70),
				`  Toplam giriş   : ${tum.length}`,
				`  Bugün          : ${tumBugun}`,
				`  Proje sayısı   : ${projeler.length}`,
				`  İlk kayıt      : ${tarihFormat(enEskiKayit?.ts ?? null)} (${gecGun} gün önce)`,
				`  Top etiketler  : ${etiketSatir}`,
				"",
			];

			if (projeler.length > 0) {
				satirlar.push("🗂️  Projeler (top 5)");
				satirlar.push("─".repeat(70));
				for (const p of projeler.slice(0, 5)) {
					satirlar.push(
						`  ${p.proje.padEnd(20)} ${String(p.toplam).padStart(4)} giriş  ·  bugün: ${p.bugun}`,
					);
				}
				satirlar.push("");
			}

			satirlar.push("Detay için: /istatistik gunluk");
			satirlar.push("");

			ctx.ui.notify(satirlar.join("\n"), "info");
		},
	});
}

function gunlukDetayi(ctx: {
	ui: { notify: (msg: string, kind?: "info" | "warning" | "error") => void };
}) {
	const { tum, projeler } = tumGunlukleriTopla();

	if (tum.length === 0) {
		ctx.ui.notify(
			"Henüz hiç günlük kaydı yok kanka.\nİlk kaydını yaz: /gunluk yaz <metin>",
			"info",
		);
		return;
	}

	const ustEtiketler = topEtiketler(tum, 10);
	const satirlar: string[] = [
		"",
		"📓 Günlük detaylı analiz",
		"═".repeat(70),
		"",
		`  Toplam giriş        : ${tum.length}`,
		`  Proje sayısı        : ${projeler.length}`,
		`  Bugün eklenen       : ${tum.filter((k) => bugunMu(k.ts)).length}`,
		"",
		"🏷️  Top 10 etiket",
		"─".repeat(70),
	];

	for (const [e, n] of ustEtiketler) {
		const bar = "█".repeat(Math.min(40, Math.ceil((n / ustEtiketler[0][1]) * 40)));
		satirlar.push(`  #${e.padEnd(20)} ${String(n).padStart(4)}  ${bar}`);
	}

	satirlar.push("");
	satirlar.push("🗂️  Tüm projeler");
	satirlar.push("─".repeat(70));
	for (const p of projeler) {
		const gecen = tarihBosluguGun(p.sonTarih);
		const gecenStr = gecen === 0 ? "bugün" : `${gecen} gün önce`;
		satirlar.push(
			`  ${p.proje.padEnd(22)} ${String(p.toplam).padStart(4)} giriş  ·  son: ${gecenStr}`,
		);
	}

	satirlar.push("");
	ctx.ui.notify(satirlar.join("\n"), "info");
}
