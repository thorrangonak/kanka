/**
 * /düşünce komutu — thinking level'ı Türkçe seçim/değiştirme
 *
 * Kullanım:
 *   /düşünce              — mevcut level'ı göster
 *   /düşünce kapat        — off
 *   /düşünce minimal      — minimal
 *   /düşünce düşük        — low
 *   /düşünce orta         — medium
 *   /düşünce yüksek       — high
 *   /düşünce max          — xhigh
 *
 * Pi'nin default kısayolu: Shift+Tab (cycle)
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

type ThinkingLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh";

interface SeviyeHaritasi {
	turkce: string[];
	pi: ThinkingLevel;
	gosterim: string;
}

const SEVIYELER: SeviyeHaritasi[] = [
	{ turkce: ["kapat", "kapali", "kapalı", "off", "yok"], pi: "off", gosterim: "kapalı" },
	{ turkce: ["minimal", "min"], pi: "minimal", gosterim: "minimal" },
	{ turkce: ["düşük", "dusuk", "low", "az"], pi: "low", gosterim: "düşük" },
	{ turkce: ["orta", "medium", "med"], pi: "medium", gosterim: "orta" },
	{ turkce: ["yüksek", "yuksek", "high", "çok"], pi: "high", gosterim: "yüksek" },
	{ turkce: ["max", "xhigh", "ekstra", "en-yüksek", "en-yuksek"], pi: "xhigh", gosterim: "maksimum" },
];

const TURKCE_GOSTERIM: Record<ThinkingLevel, string> = {
	off: "kapalı",
	minimal: "minimal",
	low: "düşük",
	medium: "orta",
	high: "yüksek",
	xhigh: "maksimum",
};

function seviyeBul(input: string): ThinkingLevel | null {
	const temiz = input.trim().toLowerCase();
	for (const s of SEVIYELER) {
		if (s.turkce.includes(temiz)) return s.pi;
	}
	return null;
}

export default function dusunceExtension(pi: ExtensionAPI) {
	pi.registerCommand("düşünce", {
		description: "Thinking level'ı Türkçe yönet (kapat/min/düşük/orta/yüksek/max)",
		handler: async (args, ctx) => {
			const arg = args?.trim();

			// Argüman yoksa mevcut seviyeyi göster
			if (!arg) {
				const mevcut = pi.getThinkingLevel();
				const turkce = TURKCE_GOSTERIM[mevcut];
				const secenekler = "kapat | minimal | düşük | orta | yüksek | max";
				ctx.ui.notify(
					`Mevcut düşünce seviyesi: ${turkce} (${mevcut})\n\nDeğiştirmek için: /düşünce <${secenekler}>`,
					"info",
				);
				return;
			}

			// Argüman var, seviyeyi değiştir
			const yeniSeviye = seviyeBul(arg);
			if (!yeniSeviye) {
				ctx.ui.notify(
					`Bilmediğim bir seviye: "${arg}".\nGeçerli: kapat, minimal, düşük, orta, yüksek, max`,
					"error",
				);
				return;
			}

			pi.setThinkingLevel(yeniSeviye);
			ctx.ui.notify(`Düşünce seviyesi: ${TURKCE_GOSTERIM[yeniSeviye]} (${yeniSeviye}) ✓`, "info");
		},
	});

	// ASCII alias
	pi.registerCommand("dusunce", {
		description: "Thinking level'ı yönet (ASCII alias)",
		handler: async (args, ctx) => {
			// Aynı handler'ı tekrar çağır
			const arg = args?.trim();
			if (!arg) {
				const mevcut = pi.getThinkingLevel();
				ctx.ui.notify(
					`Mevcut: ${TURKCE_GOSTERIM[mevcut]} (${mevcut})\nDegistir: /dusunce <kapat|min|dusuk|orta|yuksek|max>`,
					"info",
				);
				return;
			}
			const yeni = seviyeBul(arg);
			if (!yeni) {
				ctx.ui.notify(`Bilinmeyen seviye: ${arg}`, "error");
				return;
			}
			pi.setThinkingLevel(yeni);
			ctx.ui.notify(`Dusunce: ${TURKCE_GOSTERIM[yeni]} (${yeni})`, "info");
		},
	});
}
