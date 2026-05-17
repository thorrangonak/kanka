/**
 * Türkçe Slash Komut Alias Extension
 *
 * Pi'nin dahili slash komutlarına Türkçe alias'lar ekler.
 * Kullanıcı `/sıkıştır` yazınca otomatik olarak `/compact`'a dönüşür.
 *
 * Yaklaşım: `input` event handler ile mesaj agent'a gitmeden önce text'i
 * transform ederiz. Bu sayede pi'nin dahili komut işleyicisi orijinal
 * komutu görür ve normal şekilde çalıştırır.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

interface SlashAlias {
	/** Türkçe komut (slash'sız) */
	turkce: string;
	/** Pi'nin orijinal komutu (slash'sız) */
	pi: string;
	/** Komut açıklaması (yardım için) */
	aciklama: string;
}

/**
 * Türkçe → Pi alias eşleştirmeleri.
 * ASCII'siz Türkçe versiyonlar da eklendi (klavye kolaylığı).
 */
export const SLASH_ALIASLAR: SlashAlias[] = [
	// Context yönetimi
	{ turkce: "sıkıştır", pi: "compact", aciklama: "Context'i compact et (özet çıkar, eskileri sıkıştır)" },
	{ turkce: "sikistir", pi: "compact", aciklama: "Context'i compact et (ASCII)" },
	{ turkce: "özet", pi: "compact", aciklama: "Context'i compact et (alias)" },
	{ turkce: "ozet", pi: "compact", aciklama: "Context'i compact et (ASCII alias)" },

	// Kopyala / aktar
	{ turkce: "kopyala", pi: "copy", aciklama: "Son asistan mesajını panoya kopyala" },
	{ turkce: "aktar", pi: "export", aciklama: "Oturumu HTML'e aktar" },
	{ turkce: "dışaver", pi: "export", aciklama: "Oturumu HTML'e aktar (alias)" },
	{ turkce: "disaver", pi: "export", aciklama: "Oturumu HTML'e aktar (ASCII)" },
	{ turkce: "paylaş", pi: "share", aciklama: "Oturumu paylaş (gist link)" },
	{ turkce: "paylas", pi: "share", aciklama: "Oturumu paylaş (ASCII)" },

	// Oturum yönetimi
	{ turkce: "çatalla", pi: "fork", aciklama: "Mevcut oturumu fork et (kopya)" },
	{ turkce: "catalla", pi: "fork", aciklama: "Oturumu fork et (ASCII)" },
	{ turkce: "klonla", pi: "clone", aciklama: "Oturumu klonla" },
	{ turkce: "içeal", pi: "import", aciklama: "Oturum dosyası içe al" },
	{ turkce: "iceal", pi: "import", aciklama: "Oturum dosyası içe al (ASCII)" },
	{ turkce: "devam", pi: "resume", aciklama: "Bir oturumdan devam et" },
	{ turkce: "ağaç", pi: "tree", aciklama: "Oturum ağacını göster (branch navigator)" },
	{ turkce: "agac", pi: "tree", aciklama: "Oturum ağacı (ASCII)" },
	{ turkce: "isim", pi: "name", aciklama: "Mevcut oturumu adlandır" },

	// Auth
	{ turkce: "giriş", pi: "login", aciklama: "Provider'a giriş yap (OAuth veya API key)" },
	{ turkce: "giris", pi: "login", aciklama: "Provider'a giriş (ASCII)" },
	{ turkce: "çıkış", pi: "logout", aciklama: "Provider'dan çıkış yap" },
	{ turkce: "cikis", pi: "logout", aciklama: "Provider'dan çıkış (ASCII)" },

	// Sistem
	{ turkce: "ayarlar", pi: "settings", aciklama: "Ayarlar TUI'sini aç" },
	{ turkce: "yenile", pi: "reload", aciklama: "Runtime'ı yeniden yükle (config + extension)" },
	{ turkce: "kısayollar", pi: "hotkeys", aciklama: "Klavye kısayollarını göster" },
	{ turkce: "kisayollar", pi: "hotkeys", aciklama: "Klavye kısayolları (ASCII)" },
	{ turkce: "değişiklikler", pi: "changelog", aciklama: "Pi changelog'unu göster" },
	{ turkce: "degisiklikler", pi: "changelog", aciklama: "Changelog (ASCII)" },
	{ turkce: "hata-ayıkla", pi: "debug", aciklama: "Debug bilgisini göster" },
	{ turkce: "hata-ayikla", pi: "debug", aciklama: "Debug bilgisi (ASCII)" },
];

/**
 * `/turkce` formatındaki bir komutu `/pi` formatına çevirir.
 * Eşleşme yoksa orijinal metni döner.
 */
function aliasCevir(text: string): string | null {
	if (!text.startsWith("/")) return null;

	// Slash sonrası kısmı al
	const slashSonrasi = text.slice(1);
	// İlk boşluğa kadar = komut, sonrası = argüman
	const bosluk = slashSonrasi.indexOf(" ");
	const komut = bosluk === -1 ? slashSonrasi : slashSonrasi.slice(0, bosluk);
	const argumanlar = bosluk === -1 ? "" : slashSonrasi.slice(bosluk);

	// Alias bul (case-sensitive, çünkü Türkçe karakterler önemli)
	const alias = SLASH_ALIASLAR.find((a) => a.turkce === komut);
	if (!alias) return null;

	return `/${alias.pi}${argumanlar}`;
}

export default function turkceAliaslarExtension(pi: ExtensionAPI) {
	// Input event'i yakala — kullanıcı bir mesaj/komut girince çalışır.
	// Sadece interactive kaynaklı input'lara müdahale et (RPC veya extension'dan
	// gelen mesajları zaten programatik, dönüştürmeye gerek yok).
	pi.on("input", async (event) => {
		if (event.source !== "interactive") return;

		const yeniMetin = aliasCevir(event.text);
		if (!yeniMetin) return;

		// Komutu pi'nin orijinal versiyonuna transform et
		return {
			action: "transform" as const,
			text: yeniMetin,
			images: event.images,
		};
	});
}
