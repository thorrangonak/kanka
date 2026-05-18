/**
 * Kanka Header Extension
 *
 * Pi'nin built-in header'ını (logo + "pi v0.74.1" + keybinding hints + 
 * "Pi can explain its own features...") tamamen kanka brand'iyle değiştirir.
 *
 * Sonuç: Kullanıcı sadece kanka logosu görür, "pi" geçmez.
 */

import type { ExtensionAPI, Theme } from "@earendil-works/pi-coding-agent";
import { guncellemeUyariVar } from "./guncelle.js";

const KANKA_VERSION = "0.4.0";

function getKankaHeader(theme: Theme): string[] {
	// ASCII art "kanka" — küçük ve şık
	const logo = [
		"  ╦╔═╔═╗╔╗╔╦╔═╔═╗",
		"  ╠╩╗╠═╣║║║╠╩╗╠═╣",
		"  ╩ ╩╩ ╩╝╚╝╩ ╩╩ ╩",
	].map((line) => theme.fg("accent", line));

	const subtitle =
		theme.bold("  kanka ") +
		theme.fg("dim", `v${KANKA_VERSION}`) +
		theme.fg("muted", "  ·  ") +
		theme.fg("muted", "Türkçe konuşan terminal kodlama asistanı");

	const hints = theme.fg("dim",
		"  /yardım komutlar  ·  /ekip subagent'lar  ·  /bilgi durum  ·  Ctrl+C çık"
	);

	const docs = theme.fg("dim",
		"  github.com/thorrangonak/kanka  ·  \"Kanka, şunu yapsana.\""
	);

	// Güncelleme uyarısı (varsa)
	const guncel = guncellemeUyariVar();
	const guncelUyari = guncel
		? theme.fg(
				"warning",
				`  📦 Yeni sürüm var: ${guncel.mevcut} → ${guncel.latest}  ·  Güncellemek için: /güncelle`,
		  )
		: null;

	const satirlar = ["", ...logo, "", subtitle, "", hints, docs];
	if (guncelUyari) satirlar.push(guncelUyari);
	satirlar.push("");
	return satirlar;
}

export default function kankaHeaderExtension(pi: ExtensionAPI) {
	// Session başlarken pi'nin header'ını kanka header'ıyla değiştir.
	pi.on("session_start", async (_event, ctx) => {
		if (!ctx.hasUI) return;

		ctx.ui.setHeader((_tui, theme) => {
			return {
				render(_width: number): string[] {
					return getKankaHeader(theme);
				},
				invalidate() {},
			};
		});
	});

	// Kullanıcı pi'nin orijinal header'ını görmek isterse:
	pi.registerCommand("pi-header", {
		description: "Pi'nin orijinal header'ını geri yükle (debug/troubleshoot)",
		handler: async (_args, ctx) => {
			ctx.ui.setHeader(undefined);
			ctx.ui.notify("Pi orijinal header'ı geri yüklendi.", "info");
		},
	});

	// Kanka header'ını geri getir
	pi.registerCommand("kanka-header", {
		description: "Kanka header'ını geri yükle",
		handler: async (_args, ctx) => {
			ctx.ui.setHeader((_tui, theme) => ({
				render: () => getKankaHeader(theme),
				invalidate() {},
			}));
			ctx.ui.notify("Kanka header'ı aktif.", "info");
		},
	});
}
