/**
 * Türkçe Komutlar Extension
 *
 * kanka için Türkçe slash komutları:
 *   /yardım   →  Komut listesi (Türkçe)
 *   /çık      →  Oturumdan çık
 *   /selam    →  Karşılama mesajı (paskalya yumurtası)
 *
 * Not: Pi'nin orijinal komutları (/help, /exit, /clear, /status, /sessions, /new) da
 * her zaman çalışmaya devam eder.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

interface YardimGirisi {
	turkce: string;
	orijinal: string;
	aciklama: string;
}

const YARDIM_LISTESI: YardimGirisi[] = [
	{ turkce: "/yardım", orijinal: "/help", aciklama: "Komut listesini göster" },
	{ turkce: "/çık", orijinal: "/exit", aciklama: "kanka'dan çık" },
	{ turkce: "/temizle", orijinal: "/clear", aciklama: "Ekranı temizle" },
	{ turkce: "/durum", orijinal: "/status", aciklama: "Oturum durumunu göster" },
	{ turkce: "/oturum", orijinal: "/sessions", aciklama: "Oturumları listele" },
	{ turkce: "/yeni", orijinal: "/new", aciklama: "Yeni oturum başlat" },
	{ turkce: "/model", orijinal: "/model", aciklama: "Aktif modeli değiştir" },
];

export default function turkceKomutlarExtension(pi: ExtensionAPI) {
	// /yardım — kanka'nın özel yardım menüsü
	pi.registerCommand("yardım", {
		description: "Komut listesini Türkçe göster",
		handler: async (_args, ctx) => {
			const satirlar: string[] = [
				"",
				"kanka — Türkçe komut listesi",
				"─────────────────────────────",
				...YARDIM_LISTESI.map(
					(k) => `  ${k.turkce.padEnd(12)} (${k.orijinal.padEnd(10)}) — ${k.aciklama}`,
				),
				"",
				"Pi'nin orijinal İngilizce komutları da çalışır.",
				"Bir şey yazmak için Enter'a bas, çıkmak için Ctrl+C.",
				"",
			];
			ctx.ui.notify(satirlar.join("\n"), "info");
		},
	});

	// ASCII fallback
	pi.registerCommand("yardim", {
		description: "Komut listesini Türkçe göster (ASCII)",
		handler: async (_args, ctx) => {
			const satirlar: string[] = [
				"",
				"kanka — Türkçe komut listesi",
				"─────────────────────────────",
				...YARDIM_LISTESI.map(
					(k) => `  ${k.turkce.padEnd(12)} (${k.orijinal.padEnd(10)}) — ${k.aciklama}`,
				),
				"",
			];
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
			ctx.ui.notify("Görüşmek üzere kanka! 👋", "info");
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
			];
			const secilen = mesajlar[Math.floor(Math.random() * mesajlar.length)]!;
			ctx.ui.notify(secilen, "info");
		},
	});
}
