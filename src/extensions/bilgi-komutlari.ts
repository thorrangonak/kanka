/**
 * Kanka-özel bilgi komutları
 *
 *   /ekip      — Kullanılabilir subagent ekibini listele
 *   /araçlar   — Aktif tool listesi
 *   /bilgi     — Kanka durum özeti (versiyon, model, thinking, tools, agents)
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { parseFrontmatter } from "@earendil-works/pi-coding-agent";

interface BundledAgentBilgi {
	name: string;
	description: string;
}

const KANKA_VERSION = "0.4.1";

/**
 * Paket içindeki bundled-agents/ klasöründen agent meta bilgisini okur.
 */
function bundledAgentleriOku(): BundledAgentBilgi[] {
	try {
		const here = path.dirname(fileURLToPath(import.meta.url));
		// dist/extensions/bilgi-komutlari.js → dist/bundled-agents/
		const dizin = path.resolve(here, "..", "bundled-agents");
		if (!fs.existsSync(dizin)) return [];

		const dosyalar = fs.readdirSync(dizin).filter((f) => f.endsWith(".md"));
		const agentlar: BundledAgentBilgi[] = [];

		for (const dosya of dosyalar) {
			const icerik = fs.readFileSync(path.join(dizin, dosya), "utf-8");
			const { frontmatter } = parseFrontmatter<Record<string, string>>(icerik);
			if (frontmatter.name && frontmatter.description) {
				agentlar.push({
					name: frontmatter.name,
					description: frontmatter.description,
				});
			}
		}

		// İsme göre sırala (kanka'nın iş akışı sırası değil, alfabetik tutarlı liste)
		agentlar.sort((a, b) => a.name.localeCompare(b.name, "tr"));
		return agentlar;
	} catch {
		return [];
	}
}

export default function bilgiKomutlariExtension(pi: ExtensionAPI) {
	// /ekip — Subagent listesi
	pi.registerCommand("ekip", {
		description: "Kullanılabilir subagent ekibini listele",
		handler: async (_args, ctx) => {
			const agentlar = bundledAgentleriOku();
			if (agentlar.length === 0) {
				ctx.ui.notify("Henüz bundled agent yok kanka.", "warning");
				return;
			}

			const satirlar: string[] = [
				"",
				"🤝 kanka ekibi — Kullanılabilir subagent'lar",
				"─".repeat(60),
				...agentlar.map((a) => `  ${a.name.padEnd(18)} — ${a.description}`),
				"",
				"Workflow komutları:",
				"  /yap <görev>             kasif → planlayici → isci",
				"  /plan-yap <görev>        kasif → planlayici",
				"  /yap-ve-incele <görev>   isci → gozden-geciren → isci",
				"  /hata-ayikla <bug>      kasif → hata-avcisi",
				"  /refactor-incele <hedef> kasif → refactorcu → gozden-geciren",
				"",
				"Manuel çağırmak için: `delege` tool'unu kullan.",
				"",
			];
			ctx.ui.notify(satirlar.join("\n"), "info");
		},
	});

	// /araçlar — Tool listesi
	pi.registerCommand("araçlar", {
		description: "Aktif tool listesini göster",
		handler: async (_args, ctx) => {
			const tumToollar = pi.getAllTools();
			const aktifIsimler = pi.getActiveTools();
			const aktifSet = new Set(aktifIsimler);

			const satirlar: string[] = ["", "🛠️  kanka araç listesi", "─".repeat(60)];

			for (const tool of tumToollar) {
				const isim = tool.name;
				const aktif = aktifSet.has(isim) ? "✓" : "·";
				const aciklama =
					typeof tool.description === "string"
						? tool.description.slice(0, 60)
						: "";
				satirlar.push(`  ${aktif} ${isim.padEnd(20)} ${aciklama}`);
			}

			satirlar.push("");
			satirlar.push(`Toplam: ${tumToollar.length} araç, ${aktifIsimler.length} aktif`);
			satirlar.push("Açma/kapama: pi config veya extension üzerinden.");
			satirlar.push("");
			ctx.ui.notify(satirlar.join("\n"), "info");
		},
	});

	// ASCII alias
	pi.registerCommand("araclar", {
		description: "Aktif tool listesi (ASCII alias)",
		handler: async (_args, ctx) => {
			const tumToollar = pi.getAllTools();
			const aktifIsimler = pi.getActiveTools();
			const aktifSet = new Set(aktifIsimler);
			const satirlar: string[] = ["", "kanka arac listesi", "─".repeat(50)];
			for (const tool of tumToollar) {
				const aktif = aktifSet.has(tool.name) ? "[+]" : "[ ]";
				satirlar.push(`  ${aktif} ${tool.name}`);
			}
			satirlar.push(`\nToplam: ${tumToollar.length}, aktif: ${aktifIsimler.length}\n`);
			ctx.ui.notify(satirlar.join("\n"), "info");
		},
	});

	// /bilgi — Durum özeti
	pi.registerCommand("bilgi", {
		description: "Kanka durum özetini göster (versiyon, model, thinking, ekip)",
		handler: async (_args, ctx) => {
			const thinking = pi.getThinkingLevel();
			const model = ctx.model;
			const aktifToollar = pi.getActiveTools();
			const agentlar = bundledAgentleriOku();
			const usage = ctx.getContextUsage?.();

			const modelMetni = model
				? `${(model as { provider?: string }).provider ?? "?"}/${(model as { id?: string }).id ?? "?"}`
				: "(seçilmedi — /giriş veya /model)";

			const contextMetni = usage
				? `${usage.tokens ?? "?"} / ${usage.contextWindow} token${usage.percent != null ? ` (${usage.percent.toFixed(0)}%)` : ""}`
				: "(bilgi yok)";

			const satirlar: string[] = [
				"",
				"📊 kanka — Durum özeti",
				"─".repeat(60),
				`  Versiyon       : v${KANKA_VERSION}`,
				`  Model          : ${modelMetni}`,
				`  Düşünce        : ${thinking}`,
				`  Aktif araçlar  : ${aktifToollar.length} (${aktifToollar.join(", ")})`,
				`  Bundled agent  : ${agentlar.length} (${agentlar.map((a) => a.name).join(", ")})`,
				`  Context kullanım: ${contextMetni}`,
				`  CWD            : ${ctx.cwd}`,
				"",
				"Daha fazlası: /ekip, /araçlar, /düşünce, /model, /yardım",
				"",
			];
			ctx.ui.notify(satirlar.join("\n"), "info");
		},
	});
}
