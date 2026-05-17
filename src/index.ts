/**
 * kanka SDK — programatik kullanım için.
 *
 * Pi'nin SDK'sını yeniden export eder, üzerine kanka'nın Türkçe
 * extension'larını ekler.
 */

export { KANKA_SYSTEM_PROMPT } from "./system-prompt.js";
export { printBanner, welcomeMessage } from "./banner.js";
export { default as turkceModExtension } from "./extensions/turkce-mod.js";
export { default as turkceKomutlarExtension } from "./extensions/turkce-komutlar.js";

// Pi'nin temel SDK'sını da yeniden export et (kullanıcı kendi entegrasyonu için).
export {
	createAgentSession,
	createAgentSessionRuntime,
	SessionManager,
	AuthStorage,
	ModelRegistry,
} from "@earendil-works/pi-coding-agent";

export type {
	AgentSession,
	AgentSessionEvent,
	ExtensionAPI,
	ExtensionContext,
	ExtensionFactory,
} from "@earendil-works/pi-coding-agent";
