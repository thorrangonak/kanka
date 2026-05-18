/**
 * Güncelleme (Update) Extension
 *
 * Pasif: Session başında günde bir kere npm registry'ye sorar, yeni versiyon varsa
 * `~/.kanka/son-versiyon-kontrol` cache'ine yazar. Başka extension'lar (kanka-header)
 * bu cache'i okuyup bildirim gösterir.
 *
 * Aktif komutlar:
 *   /güncelle           — Hemen kontrol et + onay ile güncelle
 *   /guncelle           — ASCII alias
 *   /versiyon-kontrol   — Sadece kontrol et, güncelleme yapma
 *
 * Devre dışı bırakma:
 *   KANKA_NO_UPDATE_CHECK=1     — Pasif kontrol kapanır
 *   KANKA_NO_UPDATE_PROMPT=1    — Header'da uyarı görünmez
 *
 * Cache şeması (~/.kanka/son-versiyon-kontrol):
 *   { ts: ISO8601, mevcut: "0.4.1", latest: "0.5.0", guncelMi: false }
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { KANKA_VERSION, PAKET_ADI } from "../version.js";

const execFileAsync = promisify(execFile);

const KANKA_DIR = path.join(os.homedir(), ".kanka");
const CACHE_DOSYA = path.join(KANKA_DIR, "son-versiyon-kontrol");

/**
 * Günde bir kere kontrol et (24h cache).
 */
const KONTROL_ARALIGI_MS = 24 * 60 * 60 * 1000;

/**
 * npm view komutu için timeout (ms).
 */
const NPM_TIMEOUT_MS = 5000;

interface VersiyonCache {
	ts: string;
	mevcut: string;
	latest: string;
	guncelMi: boolean;
}

/** Mevcut versiyon — version.ts'ten gelir, package.json ile senkron. */
const MEVCUT_VERSIYON = KANKA_VERSION;

/**
 * Semver karşılaştırma — a < b ise -1, a > b ise 1, eşit ise 0.
 * Basit major.minor.patch karşılaştırması (prerelease tag'leri yok say).
 */
function semverKarsilastir(a: string, b: string): number {
	const temizle = (v: string): number[] => {
		const ana = v.split("-")[0]; // prerelease at
		return ana.split(".").map((x) => Number.parseInt(x, 10) || 0);
	};
	const pa = temizle(a);
	const pb = temizle(b);
	for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
		const x = pa[i] ?? 0;
		const y = pb[i] ?? 0;
		if (x < y) return -1;
		if (x > y) return 1;
	}
	return 0;
}

function cacheOku(): VersiyonCache | null {
	try {
		if (!fs.existsSync(CACHE_DOSYA)) return null;
		const ham = fs.readFileSync(CACHE_DOSYA, "utf-8");
		const c = JSON.parse(ham) as VersiyonCache;
		if (!c.ts || !c.latest) return null;
		return c;
	} catch {
		return null;
	}
}

function cacheYaz(c: VersiyonCache): void {
	try {
		fs.mkdirSync(KANKA_DIR, { recursive: true });
		fs.writeFileSync(CACHE_DOSYA, JSON.stringify(c, null, 2), "utf-8");
	} catch {
		// Sessiz başarısız — cache write critical değil
	}
}

function cacheTazeMi(c: VersiyonCache | null): boolean {
	if (!c) return false;
	try {
		const yas = Date.now() - new Date(c.ts).getTime();
		return yas < KONTROL_ARALIGI_MS;
	} catch {
		return false;
	}
}

/**
 * npm registry'den latest versiyonu çek.
 * `npm view <paket> version` komutunu kullanır.
 */
async function latestVersiyonAl(): Promise<string | null> {
	try {
		const { stdout } = await execFileAsync("npm", ["view", PAKET_ADI, "version"], {
			timeout: NPM_TIMEOUT_MS,
			windowsHide: true,
			shell: process.platform === "win32", // Windows'ta npm.cmd için shell gerek
		});
		const versiyon = stdout.trim();
		// "1.2.3" formatına uygun mu basit kontrol
		if (/^\d+\.\d+\.\d+/.test(versiyon)) {
			return versiyon;
		}
		return null;
	} catch {
		// Network yok, npm yok, timeout — sessiz başarısız
		return null;
	}
}

/**
 * Pasif kontrol — sessiz çalışır, cache yazar.
 */
async function pasifKontrol(): Promise<VersiyonCache | null> {
	if (process.env.KANKA_NO_UPDATE_CHECK) return null;

	// Cache hâlâ taze mi?
	const eski = cacheOku();
	if (cacheTazeMi(eski)) return eski;

	// Latest çek
	const latest = await latestVersiyonAl();
	if (!latest) return null;

	const guncelMi = semverKarsilastir(MEVCUT_VERSIYON, latest) >= 0;
	const yeni: VersiyonCache = {
		ts: new Date().toISOString(),
		mevcut: MEVCUT_VERSIYON,
		latest,
		guncelMi,
	};
	cacheYaz(yeni);
	return yeni;
}

/**
 * SDK fonksiyonu — header extension'ı bu cache'i okuyup bildirim gösterir.
 */
export function guncellemeUyariVar(): { latest: string; mevcut: string } | null {
	if (process.env.KANKA_NO_UPDATE_PROMPT) return null;
	const c = cacheOku();
	if (!c || c.guncelMi) return null;
	return { latest: c.latest, mevcut: c.mevcut };
}

/**
 * Aktif güncelleme — npm install -g çalıştırır.
 */
async function guncellemeYap(
	ctx: {
		ui: {
			notify: (msg: string, kind?: "info" | "warning" | "error") => void;
			confirm?: (baslik: string, mesaj: string) => Promise<boolean>;
		};
		hasUI?: boolean;
	},
	hedef: string,
): Promise<void> {
	ctx.ui.notify(
		`📦 npm install -g ${PAKET_ADI}@${hedef} çalıştırılıyor...\n` +
			`Bu birkaç saniye sürebilir.`,
		"info",
	);

	try {
		const { stdout, stderr } = await execFileAsync(
			"npm",
			["install", "-g", `${PAKET_ADI}@${hedef}`],
			{
				timeout: 120_000, // 2 dakika
				windowsHide: true,
				shell: process.platform === "win32",
			},
		);

		// Cache'i temizle ki bir sonraki sefer yeniden kontrol etsin
		try {
			fs.unlinkSync(CACHE_DOSYA);
		} catch {
			// Sorun değil
		}

		const ozet = stdout.trim().split("\n").slice(-3).join("\n");
		ctx.ui.notify(
			`✓ Güncelleme tamam! kanka@${hedef} yüklendi.\n\n` +
				`${ozet}\n\n` +
				`⚠️ Değişiklikleri görmek için kanka'yı yeniden başlat:\n` +
				`  1. /çık veya Ctrl+C ile çık\n` +
				`  2. Tekrar \`kanka\` yaz`,
			"info",
		);

		if (stderr && stderr.trim() && !stderr.includes("npm warn")) {
			ctx.ui.notify(`npm uyarısı:\n${stderr.trim()}`, "warning");
		}
	} catch (e: unknown) {
		const mesaj = e instanceof Error ? e.message : String(e);
		// Yetki hatası muhtemelen
		const yetkiHatasi =
			mesaj.includes("EACCES") ||
			mesaj.includes("EPERM") ||
			mesaj.includes("permission");

		if (yetkiHatasi) {
			ctx.ui.notify(
				`❌ Güncelleme başarısız: yetki hatası.\n\n` +
					`Şunu manuel çalıştır:\n` +
					(process.platform === "win32"
						? `  npm install -g ${PAKET_ADI}@${hedef}\n  (PowerShell'i yönetici olarak aç gerekiyorsa)`
						: `  sudo npm install -g ${PAKET_ADI}@${hedef}`),
				"error",
			);
		} else {
			ctx.ui.notify(`❌ Güncelleme başarısız: ${mesaj}`, "error");
		}
	}
}

export default function guncelleExtension(pi: ExtensionAPI) {
	// Pasif kontrol — session başında, async, fire-and-forget
	pi.on("session_start", async () => {
		// Race condition'ı önle: arka planda çalışsın, session yüklemesini bloklamasın
		void pasifKontrol().catch(() => {
			// Sessiz başarısız
		});
	});

	// /güncelle komutu — interaktif güncelleme
	const guncelleHandler = async (
		_args: string | undefined,
		ctx: {
			ui: {
				notify: (msg: string, kind?: "info" | "warning" | "error") => void;
				confirm?: (baslik: string, mesaj: string) => Promise<boolean>;
			};
			hasUI?: boolean;
		},
	): Promise<void> => {
		ctx.ui.notify("📡 npm registry kontrol ediliyor...", "info");

		const latest = await latestVersiyonAl();
		if (!latest) {
			ctx.ui.notify(
				"❌ Latest versiyon kontrol edilemedi.\n" +
					"İnternet bağlantını kontrol et veya:\n" +
					`  npm install -g ${PAKET_ADI}@latest`,
				"error",
			);
			return;
		}

		const karsilastir = semverKarsilastir(MEVCUT_VERSIYON, latest);

		// Cache güncelle
		cacheYaz({
			ts: new Date().toISOString(),
			mevcut: MEVCUT_VERSIYON,
			latest,
			guncelMi: karsilastir >= 0,
		});

		if (karsilastir >= 0) {
			ctx.ui.notify(
				`✓ Zaten güncelsin kanka!\n` +
					`  Mevcut: ${MEVCUT_VERSIYON}\n` +
					`  Latest: ${latest}`,
				"info",
			);
			return;
		}

		// Yeni versiyon var — onay
		const onayMesaji =
			`Yeni versiyon var:\n` +
			`  Mevcut: ${MEVCUT_VERSIYON}\n` +
			`  Yeni  : ${latest}\n\n` +
			`Güncelleyim mi?`;

		let onay = true;
		if (ctx.ui.confirm) {
			onay = await ctx.ui.confirm("Güncelleme", onayMesaji);
		} else {
			ctx.ui.notify(onayMesaji + "\n(Otomatik onay)", "info");
		}

		if (!onay) {
			ctx.ui.notify("Güncelleme iptal edildi.", "info");
			return;
		}

		await guncellemeYap(ctx, latest);
	};

	pi.registerCommand("güncelle", {
		description: "kanka'yı npm üzerinden güncelle (latest sürüm)",
		handler: guncelleHandler,
	});

	pi.registerCommand("guncelle", {
		description: "kanka'yı güncelle (ASCII alias)",
		handler: guncelleHandler,
	});

	// /versiyon-kontrol — sadece kontrol, güncelleme yok
	pi.registerCommand("versiyon-kontrol", {
		description: "Yeni kanka sürümü var mı kontrol et",
		handler: async (_args, ctx) => {
			ctx.ui.notify("📡 Kontrol ediliyor...", "info");
			const latest = await latestVersiyonAl();
			if (!latest) {
				ctx.ui.notify(
					"❌ Kontrol başarısız (internet/timeout).",
					"error",
				);
				return;
			}
			const karsilastir = semverKarsilastir(MEVCUT_VERSIYON, latest);
			cacheYaz({
				ts: new Date().toISOString(),
				mevcut: MEVCUT_VERSIYON,
				latest,
				guncelMi: karsilastir >= 0,
			});
			if (karsilastir >= 0) {
				ctx.ui.notify(
					`✓ En son sürümdesin (${MEVCUT_VERSIYON}).`,
					"info",
				);
			} else {
				ctx.ui.notify(
					`📦 Yeni sürüm var: ${MEVCUT_VERSIYON} → ${latest}\n` +
						`Güncellemek için: /güncelle`,
					"warning",
				);
			}
		},
	});
}
