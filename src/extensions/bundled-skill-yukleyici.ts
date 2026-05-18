/**
 * Bundled Skill Yükleyici
 *
 * kanka paketiyle birlikte gelen bundled-skills/ dizinini pi'nin skill
 * keşif mekanizmasına eklenecek path olarak bildirir.
 *
 * Böylece:
 *   - turkce-commit (Türkçe Conventional Commit kılavuzu)
 *   - turkce-docs   (Türkçe dokümantasyon kılavuzu)
 *   - ... ileride eklenecek diğer Türkçe skill'ler
 *
 * pi tarafından otomatik bulunup /skill:turkce-commit, /skill:turkce-docs
 * komutları olarak kullanıma açılır.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

function bundledSkillDizini(): string {
	const here = path.dirname(fileURLToPath(import.meta.url));
	// dist/extensions/bundled-skill-yukleyici.js → dist/bundled-skills/
	return path.resolve(here, "..", "bundled-skills");
}

export default function bundledSkillYukleyiciExtension(pi: ExtensionAPI) {
	pi.on("resources_discover", async () => {
		const dizin = bundledSkillDizini();
		if (!fs.existsSync(dizin)) return {};
		return {
			skillPaths: [dizin],
		};
	});
}
