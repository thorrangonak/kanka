/**
 * Türkçe Komutlar Extension — /yardım, /çık, /selam ve diğerleri
 *
 * Pi'nin orijinal slash komutlarına Türkçe alias'lar TURKCE_ALIASLAR
 * extension'ında. Bu extension sadece:
 *   - /yardım   — kapsamlı yardım metni
 *   - /çık      — graceful shutdown
 *   - /selam    — paskalya yumurtası
 *   - /yeni, /temizle, /durum vb. — pi'de direkt yok, manuel implement
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

interface YardimBolumu {
	baslik: string;
	komutlar: Array<{ turkce: string; pi?: string; aciklama: string }>;
}

const YARDIM_BOLUMLERI: YardimBolumu[] = [
	{
		baslik: "📋 Temel komutlar",
		komutlar: [
			{ turkce: "/yardım", aciklama: "Bu yardım metnini göster" },
			{ turkce: "/çık", pi: "/exit", aciklama: "Oturumdan çık" },
			{ turkce: "/selam", aciklama: "kanka'dan bir selam" },
			{ turkce: "/bilgi", aciklama: "Kanka durum özeti (versiyon, model, ekip)" },
			{ turkce: "/ekip", aciklama: "Subagent ekibini listele" },
			{ turkce: "/araçlar", aciklama: "Aktif tool listesini göster" },
			{ turkce: "/düşünce", aciklama: "Thinking level'ı yönet" },
		],
	},
	{
		baslik: "🔗 Workflow komutları (chain pipeline)",
		komutlar: [
			{ turkce: "/yap <görev>", aciklama: "kasif → planlayici → isci (tam uygulama)" },
			{ turkce: "/plan-yap <görev>", aciklama: "kasif → planlayici (sadece plan)" },
			{ turkce: "/yap-ve-incele <görev>", aciklama: "isci → gozden-geciren → isci" },
			{ turkce: "/debug <bug>", aciklama: "kasif → hata-avcisi (root cause)" },
			{ turkce: "/refactor-incele <hedef>", aciklama: "kasif → refactorcu → gozden-geciren" },
		],
	},
	{
		baslik: "🗂️  Context yönetimi",
		komutlar: [
			{ turkce: "/sıkıştır", pi: "/compact", aciklama: "Context'i compact et (eskileri özetle)" },
			{ turkce: "/özet", pi: "/compact", aciklama: "Context'i compact et (alias)" },
			{ turkce: "/yenile", pi: "/reload", aciklama: "Runtime'ı yeniden yükle" },
		],
	},
	{
		baslik: "💾 Oturum yönetimi",
		komutlar: [
			{ turkce: "/çatalla", pi: "/fork", aciklama: "Mevcut oturumu fork et" },
			{ turkce: "/klonla", pi: "/clone", aciklama: "Oturumu klonla" },
			{ turkce: "/devam", pi: "/resume", aciklama: "Bir oturumdan devam et" },
			{ turkce: "/ağaç", pi: "/tree", aciklama: "Oturum ağacını göster" },
			{ turkce: "/isim", pi: "/name", aciklama: "Mevcut oturumu adlandır" },
			{ turkce: "/içeal", pi: "/import", aciklama: "Oturum dosyası içe al" },
			{ turkce: "/aktar", pi: "/export", aciklama: "Oturumu HTML'e aktar" },
			{ turkce: "/paylaş", pi: "/share", aciklama: "Oturumu paylaş" },
			{ turkce: "/kopyala", pi: "/copy", aciklama: "Son mesajı kopyala" },
		],
	},
	{
		baslik: "🔐 Auth & ayarlar",
		komutlar: [
			{ turkce: "/giriş", pi: "/login", aciklama: "Provider'a giriş yap" },
			{ turkce: "/çıkış", pi: "/logout", aciklama: "Provider'dan çıkış" },
			{ turkce: "/ayarlar", pi: "/settings", aciklama: "Ayarlar TUI'sini aç" },
			{ turkce: "/kısayollar", pi: "/hotkeys", aciklama: "Klavye kısayolları" },
		],
	},
];

export default function turkceKomutlarExtension(pi: ExtensionAPI) {
	// /yardım — kapsamlı yardım menüsü
	pi.registerCommand("yardım", {
		description: "Komut listesini Türkçe göster",
		handler: async (_args, ctx) => {
			const satirlar: string[] = [
				"",
				"kanka — Türkçe komut listesi",
				"═".repeat(60),
			];

			for (const bolum of YARDIM_BOLUMLERI) {
				satirlar.push("");
				satirlar.push(bolum.baslik);
				satirlar.push("─".repeat(60));
				for (const k of bolum.komutlar) {
					const sol = k.turkce.padEnd(28);
					const ek = k.pi ? ` (${k.pi})` : "";
					satirlar.push(`  ${sol}${ek}`);
					satirlar.push(`    ${k.aciklama}`);
				}
			}

			satirlar.push("");
			satirlar.push("─".repeat(60));
			satirlar.push("Pi'nin orijinal İngilizce komutları (/compact, /fork vb.) da çalışır.");
			satirlar.push("Detay: https://github.com/thorrangonak/kanka");
			satirlar.push("");

			ctx.ui.notify(satirlar.join("\n"), "info");
		},
	});

	// ASCII alias
	pi.registerCommand("yardim", {
		description: "Komut listesi (ASCII alias)",
		handler: async (_args, ctx) => {
			const satirlar = ["", "kanka — Komut listesi (ASCII)", "─".repeat(50)];
			for (const bolum of YARDIM_BOLUMLERI) {
				satirlar.push("");
				satirlar.push(bolum.baslik.replace(/[^\x00-\x7F]/g, "").trim());
				for (const k of bolum.komutlar) {
					satirlar.push(`  ${k.turkce.padEnd(24)} ${k.aciklama}`);
				}
			}
			satirlar.push("");
			ctx.ui.notify(satirlar.join("\n"), "info");
		},
	});

	// /çık — graceful shutdown
	pi.registerCommand("çık", {
		description: "kanka'dan çık",
		handler: async (_args, ctx) => {
			ctx.ui.notify("Görüşmek üzere kanka! 👋", "info");
			ctx.shutdown();
		},
	});

	pi.registerCommand("cik", {
		description: "kanka'dan çık (ASCII)",
		handler: async (_args, ctx) => {
			ctx.ui.notify("Gorusmek uzere kanka!", "info");
			ctx.shutdown();
		},
	});

	// /selam — paskalya yumurtası
	pi.registerCommand("selam", {
		description: "kanka'dan bir selam al",
		handler: async (_args, ctx) => {
			const mesajlar = [
				"Selamün aleyküm kanka.",
				"Naber kanka, hazırım.",
				"Eyvallah kanka, dinliyorum.",
				"Selam selam, ne yapalım?",
				"Buradayım kanka, söyle.",
				"Hadi başlayalım kanka.",
			];
			const secilen = mesajlar[Math.floor(Math.random() * mesajlar.length)]!;
			ctx.ui.notify(secilen, "info");
		},
	});
}
