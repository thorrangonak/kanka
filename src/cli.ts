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
import { main } from "@earendil-works/pi-coding-agent";
import { printBanner } from "./banner.js";
import bilgiKomutlariExtension from "./extensions/bilgi-komutlari.js";
import dusunceExtension from "./extensions/dusunce.js";
import kankaHeaderExtension from "./extensions/kanka-header.js";
import turkceAliaslarExtension from "./extensions/turkce-aliaslar.js";
import turkceKomutlarExtension from "./extensions/turkce-komutlar.js";
import turkceModExtension from "./extensions/turkce-mod.js";
import subagentExtension from "./subagent/index.js";

// package.json'dan versiyonu oku (build sırasında dist'e kopyalanacak)
const VERSION = "0.3.2";

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

OTURUM İÇİ KOMUTLAR (Pi orijinal — hepsi çalışır)
  /help /exit /clear /status /sessions /new /model ...

DAHA FAZLASI
  https://github.com/thorrangonak/kanka
`);
}

async function calistir(): Promise<void> {
	const args = process.argv.slice(2);

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
				kankaHeaderExtension,
				turkceModExtension,
				turkceKomutlarExtension,
				turkceAliaslarExtension,
				dusunceExtension,
				bilgiKomutlariExtension,
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
