/**
 * Türkçe Mod Extension
 *
 * kanka'nın varsayılan davranışı: sistem prompt'una Türkçe asistan
 * kişiliği enjekte eder. Tüm kullanıcı etkileşimi Türkçe olur.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { KANKA_SYSTEM_PROMPT } from "../system-prompt.js";

export default function turkceModExtension(pi: ExtensionAPI) {
	pi.on("before_agent_start", async (event) => {
		// Mevcut sistem prompt'unun sonuna kanka'nın Türkçe kişiliğini ekle.
		// Temel tool talimatları korunur, üstüne Türkçe katman gelir.
		return {
			systemPrompt: `${event.systemPrompt}\n\n---\n\n${KANKA_SYSTEM_PROMPT}`,
		};
	});
}
