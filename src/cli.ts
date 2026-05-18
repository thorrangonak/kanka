#!/usr/bin/env node
/**
 * kanka — Türkçe konuşan terminal kodlama asistanı.
 *
 * Pi'nin coding-agent çekirdeğini kullanır, üzerine Türkçe kişilik,
 * Türkçe komutlar ve kanka markasını ekler.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { main, SettingsManager, getAgentDir } from "@earendil-works/pi-coding-agent";
import { printBanner } from "./banner.js";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import bilgiKomutlariExtension from "./extensions/bilgi-komutlari.js";
import bundledSkillYukleyiciExtension from "./extensions/bundled-skill-yukleyici.js";
import dusunceExtension from "./extensions/dusunce.js";
import easterEggsExtension from "./extensions/easter-eggs.js";
import guncelleExtension from "./extensions/guncelle.js";
import gunlukExtension from "./extensions/gunluk.js";
import istatistikExtension from "./extensions/istatistik.js";
import kankaHeaderExtension from "./extensions/kanka-header.js";
import kisilikExtension from "./extensions/kisilik.js";
import turkceAliaslarExtension from "./extensions/turkce-aliaslar.js";
import turkceKomutlarExtension from "./extensions/turkce-komutlar.js";
import turkceModExtension from "./extensions/turkce-mod.js";
import windowsTerminalExtension from "./extensions/windows-terminal.js";
import subagentExtension from "./subagent/index.js";

const execFileAsync = promisify(execFile);

// Versiyon src/version.ts'ten gelir (build sırasında package.json'dan auto-generate edilir)
import { KANKA_VERSION as VERSION, PAKET_ADI } from "./version.js";

/**
 * `kanka update` veya `kanka update --check` subcommand'ı mı?
 */
function updateSubcommandMi(args: string[]): "update" | "check" | null {
	if (args.length === 0) return null;
	const ilk = args[0];
	if (ilk !== "update" && ilk !== "guncelle" && ilk !== "güncelle") return null;
	if (args.includes("--check") || args.includes("--kontrol")) return "check";
	return "update";
}

/**
 * `kanka update` komutu — interaktif olmadan güncelle.
 * Standalone CLI olarak çalışır, pi runtime yüklemez.
 */
async function updateCalistir(sadeceKontrol: boolean): Promise<void> {
	const { default: chalk } = await import("chalk");

	console.log(chalk.cyan("\n📡 npm registry kontrol ediliyor...\n"));

	let latest: string;
	try {
		const { stdout } = await execFileAsync("npm", ["view", PAKET_ADI, "version"], {
			timeout: 10_000,
			windowsHide: true,
			shell: process.platform === "win32",
		});
		latest = stdout.trim();
		if (!/^\d+\.\d+\.\d+/.test(latest)) {
			console.error(chalk.red("❌ npm beklenmeyen çıktı verdi."));
			process.exit(1);
		}
	} catch (e: unknown) {
		const mesaj = e instanceof Error ? e.message : String(e);
		console.error(chalk.red(`❌ npm view başarısız: ${mesaj}`));
		process.exit(1);
	}

	const semverCmp = (a: string, b: string): number => {
		const t = (v: string): number[] =>
			v.split("-")[0].split(".").map((x) => Number.parseInt(x, 10) || 0);
		const pa = t(a);
		const pb = t(b);
		for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
			const x = pa[i] ?? 0;
			const y = pb[i] ?? 0;
			if (x < y) return -1;
			if (x > y) return 1;
		}
		return 0;
	};

	const karsilastir = semverCmp(VERSION, latest);

	if (karsilastir >= 0) {
		console.log(
			chalk.green(`✓ Zaten güncelsin kanka!\n  Mevcut: ${VERSION}\n  Latest: ${latest}\n`),
		);
		return;
	}

	console.log(
		chalk.yellow(
			`📦 Yeni sürüm var:\n  Mevcut: ${VERSION}\n  Yeni  : ${latest}\n`,
		),
	);

	if (sadeceKontrol) {
		console.log(
			chalk.dim(`Güncellemek için: ${chalk.bold("kanka update")}\n`),
		);
		return;
	}

	console.log(chalk.cyan(`📥 npm install -g ${PAKET_ADI}@${latest}...\n`));

	try {
		const { stdout, stderr } = await execFileAsync(
			"npm",
			["install", "-g", `${PAKET_ADI}@${latest}`],
			{
				timeout: 120_000,
				windowsHide: true,
				shell: process.platform === "win32",
			},
		);
		const ozet = stdout.trim().split("\n").slice(-3).join("\n");
		console.log(chalk.green(`\n✓ Tamamdır kanka! kanka@${latest} yüklendi.\n`));
		if (ozet) console.log(chalk.dim(ozet) + "\n");
		if (stderr && stderr.trim() && !stderr.toLowerCase().includes("npm warn")) {
			console.log(chalk.yellow(`npm uyarısı:\n${stderr.trim()}\n`));
		}
	} catch (e: unknown) {
		const mesaj = e instanceof Error ? e.message : String(e);
		const yetki =
			mesaj.includes("EACCES") || mesaj.includes("EPERM") || mesaj.includes("permission");
		if (yetki) {
			const cmd =
				process.platform === "win32"
					? `npm install -g ${PAKET_ADI}@${latest}\n  (PowerShell'i yönetici olarak açman gerekebilir)`
					: `sudo npm install -g ${PAKET_ADI}@${latest}`;
			console.error(
				chalk.red(`\n❌ Yetki hatası. Manuel çalıştır:\n  ${cmd}\n`),
			);
		} else {
			console.error(chalk.red(`\n❌ Güncelleme başarısız: ${mesaj}\n`));
		}
		process.exit(1);
	}
}

/**
 * Komut satırı argümanlarında yardım/versiyon istenmiş mi?
 * Hem Türkçe (--yardım, --versiyon) hem İngilizce (--help, --version) bayrakları yakalar.
 * Böylece pi'nin kendi help/version çıktısı asla görünmez; kullanıcı her zaman kanka brand'i görür.
 */
function isYardimVeyaVersiyon(args: string[]): "yardim" | "versiyon" | null {
	for (const arg of args) {
		if (
			arg === "--yardım" ||
			arg === "--yardim" ||
			arg === "-y" ||
			arg === "--help" ||
			arg === "-h"
		) {
			return "yardim";
		}
		if (
			arg === "--versiyon" ||
			arg === "--version" ||
			arg === "-v"
		) {
			return "versiyon";
		}
	}
	return null;
}

/**
 * Türkçe yardım metnini basar.
 */
function yardimGoster(): void {
	console.log(`
kanka — Türkçe konuşan terminal kodlama asistanı

KULLANIM
  kanka [seçenekler] [komut]

SEÇENEKLER
  --yardım, -y       Bu yardım metnini göster
  --versiyon, -v     Versiyon numarasını göster

SUBCOMMAND'LAR
  kanka update              Latest sürüme güncelle (npm üzerinden)
  kanka update --check      Sadece kontrol et, güncelleme yapma

ÖRNEK
  kanka                              İnteraktif moda başla
  kanka "Bana bir Express app yaz"   Doğrudan görev ver
  echo "ne var ne yok" | kanka       Stdin üzerinden mesaj gönder

OTURUM İÇİ KOMUTLAR (Türkçe)
  /yardım            Komut listesi
  /çık               Oturumdan çık
  /temizle           Ekranı temizle
  /durum             Oturum durumu
  /oturum            Oturumları listele
  /yeni              Yeni oturum başlat
  /selam             kanka'dan bir selam

KİŞİLİK & GÜNLÜK (yeni 🆕)
  /kisilik           Kişilik yönetimi (kanka/hoca/abi/patron)
  /kisilikler        Detaylı kişilik kataloğu
  /gunluk yaz <not>  Geliştirme günlüğüne kayıt
  /gunluk bugun      Bugünün notları
  /gunluk ara <kw>   Notlarda arama

GÜNCELLEME
  /güncelle          Latest sürüme güncelle (interaktif onay)
  /versiyon-kontrol  Sadece kontrol et
  Devre dışı: KANKA_NO_UPDATE_CHECK=1 (kontrol kapanır)
                KANKA_NO_UPDATE_PROMPT=1 (header'da uyarı görünmez)

İSTATİSTİK & EĞLENCE (v0.5 🆕)
  /istatistik        Lokal kullanım özeti (günlük + persona + session)
  /şaka             Yazılım şakası
  /atasözü           Dev versiyonu Türk atasözü
  /kahve             Kahve molası + ASCII art
  /övgü              Motivasyon mesajı
  /eğlence           Tüm eğlenceli komutlar

TERMİNAL ENTEGRASYONU
  /tab-title <metin> Manuel tab title (test)
  /bildir <metin>    Test bildirimi (OSC 9)
  Devre dışı: KANKA_NO_TERMINAL_INTEGRATION=1

OTURUM İÇİ KOMUTLAR (Pi orijinal — hepsi çalışır)
  /help /exit /clear /status /sessions /new /model ...

DAHA FAZLASI
  https://github.com/thorrangonak/kanka
`);
}

async function calistir(): Promise<void> {
	const args = process.argv.slice(2);

	// `kanka update` subcommand'ı — pi runtime'ı hiç başlatmadan çalış
	const updateMod = updateSubcommandMi(args);
	if (updateMod) {
		await updateCalistir(updateMod === "check");
		return;
	}

	// Türkçe meta-bayraklar (pi'ye geçirmeden önce yakala)
	const meta = isYardimVeyaVersiyon(args);
	if (meta === "yardim") {
		printBanner(VERSION);
		yardimGoster();
		return;
	}
	if (meta === "versiyon") {
		console.log(`kanka v${VERSION}`);
		return;
	}

	// ════════════════════════════════════════════════════════════════════
	// Pi brand baskılama — kullanıcı sadece kanka görsün
	// ════════════════════════════════════════════════════════════════════
	// Pi'nin update kontrolünü kapat ("New version X.X.X available, run pi update" mesajı görünmesin)
	// API call'ları ve model registry'yi ETKİLEMEZ — sadece pi'nin kendi pi.dev'e
	// yaptığı versiyon kontrol HTTP'sini iptal eder.
	process.env.PI_SKIP_VERSION_CHECK = "1";

	// Pi'nin startup dump'larını sustur:
	//   - "Model scope: ..." listesi
	//   - [Context], [Skills], [Prompts], [Extensions], [Themes] dump'ı
	//   - Pi'nin keybinding hint'leri (kanka-header zaten başka gösteriyor)
	//
	// Bunlar pi'nin settings.json'ındaki `quietStartup` flag'i ile kontrol ediliyor.
	// Kanka kullanıcısı zaten kanka deneyimini istiyor, otomatik sessize alıyoruz.
	// Not: Bu `~/.pi/agent/settings.json`'a yazılır, yani pi tek başına açılınca da
	// quiet başlatır. Pi'nin onboarding'ini geri istersen `pi config` ile ayarlayabilirsin.
	try {
		const sm = SettingsManager.create(process.cwd(), getAgentDir());
		if (!sm.getQuietStartup()) {
			sm.setQuietStartup(true);
		}
	} catch {
		// Settings yazılamasa bile devam et — sadece startup biraz daha verbose olur.
	}

	// İnteraktif modda banner basmıyoruz — çünkü TUI açılınca
	// kanka-header extension'ı zaten kanka logosunu gösterir.
	// Çift logo görünmesin diye burada baskılanıyor.
	//
	// Banner sadece --yardım flag'inde basılıyor (TUI açılmadan).

	// Bundled workflow prompt'larını args'a otomatik enjekte et.
	// Böylece /yap, /plan-yap, /yap-ve-incele, /debug, /refactor-incele komutları her zaman aktif olur.
	const bundledPromptsArgs = getBundledPromptArgs();
	const genisletilmisArgs = [...bundledPromptsArgs, ...args];

	// Pi'nin main fonksiyonunu kendi extension'larımızla çağır.
	// extensionFactories listesi pi'nin extension yükleyicisine ek olarak çalışır.
	try {
		await main(genisletilmisArgs, {
			extensionFactories: [
				// guncelleExtension'ı header'dan ÖNCE yükle ki pasif kontrol
				// session_start sırasında çalışsın, header onun cache'ini okusun.
				guncelleExtension,
				kankaHeaderExtension,
				turkceModExtension,
				turkceKomutlarExtension,
				turkceAliaslarExtension,
				dusunceExtension,
				bilgiKomutlariExtension,
				kisilikExtension,
				windowsTerminalExtension,
				gunlukExtension,
				istatistikExtension,
				easterEggsExtension,
				bundledSkillYukleyiciExtension,
				subagentExtension,
			],
		});
	} catch (e: unknown) {
		const mesaj = e instanceof Error ? e.message : String(e);
		console.error(`\nHata kanka: ${mesaj}\n`);
		process.exit(1);
	}
}

/**
 * Paketle birlikte gelen workflow prompt'larının yolunu döner.
 * Her .md dosyası için pi'nin --prompt-template bayrağını üretir.
 */
function getBundledPromptArgs(): string[] {
	const here = path.dirname(fileURLToPath(import.meta.url));
	const promptsDir = path.resolve(here, "bundled-prompts");
	if (!fs.existsSync(promptsDir)) return [];

	try {
		const dosyalar = fs.readdirSync(promptsDir).filter((f) => f.endsWith(".md"));
		const args: string[] = [];
		for (const dosya of dosyalar) {
			args.push("--prompt-template", path.join(promptsDir, dosya));
		}
		return args;
	} catch {
		return [];
	}
}

calistir().catch((e: unknown) => {
	const mesaj = e instanceof Error ? e.message : String(e);
	console.error(`\nBeklenmeyen hata kanka: ${mesaj}\n`);
	process.exit(1);
});
