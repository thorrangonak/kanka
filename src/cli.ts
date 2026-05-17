#!/usr/bin/env node
/**
 * kanka — Türkçe konuşan terminal kodlama asistanı.
 *
 * Pi'nin coding-agent çekirdeğini kullanır, üzerine Türkçe kişilik,
 * Türkçe komutlar ve kanka markasını ekler.
 */

import { main } from "@earendil-works/pi-coding-agent";
import { printBanner } from "./banner.js";
import turkceKomutlarExtension from "./extensions/turkce-komutlar.js";
import turkceModExtension from "./extensions/turkce-mod.js";

// package.json'dan versiyonu oku (build sırasında dist'e kopyalanacak)
const VERSION = "0.1.0";

/**
 * Komut satırı argümanlarında yardım/versiyon istenmiş mi?
 */
function isYardimVeyaVersiyon(args: string[]): "yardim" | "versiyon" | null {
	for (const arg of args) {
		if (arg === "--yardım" || arg === "--yardim" || arg === "-y") return "yardim";
		if (arg === "--versiyon" || arg === "-v" || arg === "--version") return "versiyon";
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

	// İnteraktif modda mıyız? (TTY varsa banner basabiliriz)
	const interaktif = process.stdin.isTTY && process.stdout.isTTY && args.length === 0;
	if (interaktif) {
		printBanner(VERSION);
	}

	// Pi'nin main fonksiyonunu kendi extension'larımızla çağır.
	// extensionFactories listesi pi'nin extension yükleyicisine ek olarak çalışır.
	try {
		await main(args, {
			extensionFactories: [turkceModExtension, turkceKomutlarExtension],
		});
	} catch (e: unknown) {
		const mesaj = e instanceof Error ? e.message : String(e);
		console.error(`\nHata kanka: ${mesaj}\n`);
		process.exit(1);
	}
}

calistir().catch((e: unknown) => {
	const mesaj = e instanceof Error ? e.message : String(e);
	console.error(`\nBeklenmeyen hata kanka: ${mesaj}\n`);
	process.exit(1);
});
