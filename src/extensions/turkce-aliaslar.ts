/**
 * Türkçe Slash Komut Alias Extension
 *
 * İki kategoride alias sağlıyoruz:
 *
 * 1. **Gerçek alias'lar (Tier 1)** — Extension API üzerinden direkt action çağrılır:
 *      /sıkıştır, /özet → ctx.compact()
 *      /yenile          → ctx.reload()
 *      /yeni            → ctx.newSession()
 *
 * 2. **Yönlendirici alias'lar (Tier 2)** — Pi'nin TUI seviyesi komutlarına
 *    extension API'den erişilemiyor (login, settings, fork, copy vb.). Bu komutlar
 *    çağrılınca kullanıcıyı pi'nin orijinal komutuna yönlendiriyoruz.
 *
 * Not: Pi'nin slash komut parser'ı `emitInput`'tan ÖNCE çalıştığı için, sadece
 * text transform yapan bir alias çalışmıyor — bu yüzden kanka kendi extension
 * komutlarını `registerCommand` ile kayıt ediyor ve action'ları manuel tetikliyor.
 */

import type { ExtensionAPI, ExtensionCommandContext } from "@earendil-works/pi-coding-agent";

interface YonlendirmeAlias {
	turkce: string;
	piKomut: string;
	aciklama: string;
}

/**
 * Pi'nin TUI seviyesi komutları — extension'dan tetiklenemez.
 * Kullanıcıya orijinal komutu hatırlat.
 */
const YONLENDIRME_ALIASLARI: YonlendirmeAlias[] = [
	{ turkce: "çatalla", piKomut: "/fork", aciklama: "Oturumu fork et" },
	{ turkce: "catalla", piKomut: "/fork", aciklama: "Oturumu fork et" },
	{ turkce: "klonla", piKomut: "/clone", aciklama: "Oturumu klonla" },
	{ turkce: "devam", piKomut: "/resume", aciklama: "Bir oturumdan devam et" },
	{ turkce: "ağaç", piKomut: "/tree", aciklama: "Oturum ağacını göster" },
	{ turkce: "agac", piKomut: "/tree", aciklama: "Oturum ağacı" },
	{ turkce: "isim", piKomut: "/name", aciklama: "Mevcut oturumu adlandır" },
	{ turkce: "içeal", piKomut: "/import", aciklama: "Oturum dosyası içe al" },
	{ turkce: "iceal", piKomut: "/import", aciklama: "Oturum içe al" },
	{ turkce: "aktar", piKomut: "/export", aciklama: "Oturumu HTML'e aktar" },
	{ turkce: "dışaver", piKomut: "/export", aciklama: "HTML'e aktar" },
	{ turkce: "disaver", piKomut: "/export", aciklama: "HTML'e aktar" },
	{ turkce: "paylaş", piKomut: "/share", aciklama: "Oturumu paylaş" },
	{ turkce: "paylas", piKomut: "/share", aciklama: "Oturumu paylaş" },
	{ turkce: "kopyala", piKomut: "/copy", aciklama: "Son asistan mesajını kopyala" },
	{ turkce: "giriş", piKomut: "/login", aciklama: "Provider'a giriş yap" },
	{ turkce: "giris", piKomut: "/login", aciklama: "Provider'a giriş" },
	{ turkce: "çıkış", piKomut: "/logout", aciklama: "Provider'dan çıkış" },
	{ turkce: "cikis", piKomut: "/logout", aciklama: "Provider'dan çıkış" },
	{ turkce: "ayarlar", piKomut: "/settings", aciklama: "Ayarlar TUI'sini aç" },
	{ turkce: "kısayollar", piKomut: "/hotkeys", aciklama: "Klavye kısayolları" },
	{ turkce: "kisayollar", piKomut: "/hotkeys", aciklama: "Klavye kısayolları" },
	{ turkce: "değişiklikler", piKomut: "/changelog", aciklama: "Pi changelog'u" },
	{ turkce: "degisiklikler", piKomut: "/changelog", aciklama: "Pi changelog" },
	{ turkce: "hata-ayıkla", piKomut: "/debug", aciklama: "Debug bilgisi" },
	{ turkce: "hata-ayikla", piKomut: "/debug", aciklama: "Debug bilgisi" },
];

export default function turkceAliaslarExtension(pi: ExtensionAPI) {
	// ───────────────────────────────────────────────
	// TIER 1: Gerçek alias'lar (action API üzerinden)
	// ───────────────────────────────────────────────

	const sikistirHandler = async (args: string, ctx: ExtensionCommandContext): Promise<void> => {
		const ozelTalimat = args?.trim() || undefined;
		ctx.ui.notify(
			ozelTalimat
				? `Context sıkıştırılıyor (özel talimat: "${ozelTalimat}")...`
				: "Context sıkıştırılıyor...",
			"info",
		);
		ctx.compact({ customInstructions: ozelTalimat });
	};

	pi.registerCommand("sıkıştır", {
		description: "Context'i sıkıştır (compact). İsteğe bağlı: özel özet talimatı.",
		handler: sikistirHandler,
	});
	pi.registerCommand("sikistir", {
		description: "Context'i sıkıştır (ASCII)",
		handler: sikistirHandler,
	});
	pi.registerCommand("özet", {
		description: "Context'i sıkıştır (alias: /sıkıştır)",
		handler: sikistirHandler,
	});
	pi.registerCommand("ozet", {
		description: "Context'i sıkıştır (ASCII)",
		handler: sikistirHandler,
	});

	pi.registerCommand("yenile", {
		description: "Runtime'ı yeniden yükle (config + extension)",
		handler: async (_args, ctx) => {
			ctx.ui.notify("Runtime yeniden yükleniyor...", "info");
			await ctx.reload();
		},
	});

	pi.registerCommand("yeniden-yukle", {
		description: "Runtime'ı yeniden yükle (ASCII alias)",
		handler: async (_args, ctx) => {
			ctx.ui.notify("Runtime yeniden yukleniyor...", "info");
			await ctx.reload();
		},
	});

	pi.registerCommand("yeni-oturum", {
		description: "Yeni oturum başlat",
		handler: async (_args, ctx) => {
			ctx.ui.notify("Yeni oturum başlatılıyor...", "info");
			await ctx.newSession();
		},
	});

	// ───────────────────────────────────────────────
	// TIER 2: Yönlendirici alias'lar
	// (Pi TUI'sine erişim yok, kullanıcıyı orijinal komuta yönlendir)
	// ───────────────────────────────────────────────

	for (const alias of YONLENDIRME_ALIASLARI) {
		pi.registerCommand(alias.turkce, {
			description: `${alias.aciklama} (kanka: ${alias.piKomut} yaz)`,
			handler: async (_args, ctx) => {
				ctx.ui.notify(
					`Bu komut için pi'nin yerel komutu lazım kanka:\n  ${alias.piKomut}\n\n(Pi TUI seviyesi komutlar extension'lardan tetiklenemiyor.\nYazıp Enter'a bas, aynı işi yapar.)`,
					"info",
				);
			},
		});
	}
}
