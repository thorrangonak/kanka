/**
 * Agent discovery and configuration (kanka edition)
 *
 * Pi-mono'nun örneğinden farklı olarak:
 *  1. Paketin içindeki bundled agent'ları (Türkçe) otomatik yükler.
 *  2. Kullanıcının ~/.kanka/agents/ klasörünü tarar (kendi agent'ları).
 *  3. Hala ~/.pi/agent/agents/ pi-uyumluluğu için tarar (kullanıcı pi'den geçiyorsa).
 */

import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { getAgentDir, parseFrontmatter } from "@earendil-works/pi-coding-agent";

/** kanka kullanıcı konfig dizini: ~/.kanka/ */
function getKankaUserDir(): string {
	return path.join(os.homedir(), ".kanka");
}

/** Paket içindeki bundled agent dizini */
function getBundledAgentsDir(): string {
	// __dirname yok ESM'de, import.meta.url'den çözümlüyoruz
	const here = path.dirname(fileURLToPath(import.meta.url));
	// dist/subagent/agents.js → dist/bundled-agents/
	return path.resolve(here, "..", "bundled-agents");
}

/** Paket içindeki bundled workflow prompt'ları dizini */
export function getBundledPromptsDir(): string {
	const here = path.dirname(fileURLToPath(import.meta.url));
	return path.resolve(here, "..", "bundled-prompts");
}

export type AgentScope = "user" | "project" | "both";

export interface AgentConfig {
	name: string;
	description: string;
	tools?: string[];
	model?: string;
	systemPrompt: string;
	source: "user" | "project";
	filePath: string;
}

export interface AgentDiscoveryResult {
	agents: AgentConfig[];
	projectAgentsDir: string | null;
}

function loadAgentsFromDir(dir: string, source: "user" | "project"): AgentConfig[] {
	const agents: AgentConfig[] = [];

	if (!fs.existsSync(dir)) {
		return agents;
	}

	let entries: fs.Dirent[];
	try {
		entries = fs.readdirSync(dir, { withFileTypes: true });
	} catch {
		return agents;
	}

	for (const entry of entries) {
		if (!entry.name.endsWith(".md")) continue;
		if (!entry.isFile() && !entry.isSymbolicLink()) continue;

		const filePath = path.join(dir, entry.name);
		let content: string;
		try {
			content = fs.readFileSync(filePath, "utf-8");
		} catch {
			continue;
		}

		const { frontmatter, body } = parseFrontmatter<Record<string, string>>(content);

		if (!frontmatter.name || !frontmatter.description) {
			continue;
		}

		const tools = frontmatter.tools
			?.split(",")
			.map((t: string) => t.trim())
			.filter(Boolean);

		agents.push({
			name: frontmatter.name,
			description: frontmatter.description,
			tools: tools && tools.length > 0 ? tools : undefined,
			model: frontmatter.model,
			systemPrompt: body,
			source,
			filePath,
		});
	}

	return agents;
}

function isDirectory(p: string): boolean {
	try {
		return fs.statSync(p).isDirectory();
	} catch {
		return false;
	}
}

function findNearestProjectAgentsDir(cwd: string): string | null {
	let currentDir = cwd;
	while (true) {
		const candidate = path.join(currentDir, ".pi", "agents");
		if (isDirectory(candidate)) return candidate;

		const parentDir = path.dirname(currentDir);
		if (parentDir === currentDir) return null;
		currentDir = parentDir;
	}
}

export function discoverAgents(cwd: string, scope: AgentScope): AgentDiscoveryResult {
	const bundledDir = getBundledAgentsDir();
	const kankaUserDir = path.join(getKankaUserDir(), "agents");
	const piUserDir = path.join(getAgentDir(), "agents");
	const projectAgentsDir = findNearestProjectAgentsDir(cwd);

	// Bundled agent'lar her zaman yüklenir (paket içinde, Türkçe default ekip)
	const bundledAgents = loadAgentsFromDir(bundledDir, "user");
	// Kullanıcının kendi agent'ları (önce kanka, sonra pi uyumluluğu için)
	const kankaUserAgents = scope === "project" ? [] : loadAgentsFromDir(kankaUserDir, "user");
	const piUserAgents = scope === "project" ? [] : loadAgentsFromDir(piUserDir, "user");
	const projectAgents = scope === "user" || !projectAgentsDir ? [] : loadAgentsFromDir(projectAgentsDir, "project");

	const agentMap = new Map<string, AgentConfig>();

	// Öncelik sırası (sonra gelen önceki yi ezer):
	//   1. bundled (en düşük öncelik, varsayılan)
	//   2. pi user dir (eğer kullanıcı pi'den geçiyorsa, mevcut agent'ları korunsun)
	//   3. kanka user dir (kullanıcının kanka'ya özel agent'ları)
	//   4. project (en yüksek öncelik)
	if (scope === "project") {
		for (const agent of projectAgents) agentMap.set(agent.name, agent);
	} else {
		for (const agent of bundledAgents) agentMap.set(agent.name, agent);
		for (const agent of piUserAgents) agentMap.set(agent.name, agent);
		for (const agent of kankaUserAgents) agentMap.set(agent.name, agent);
		if (scope === "both") {
			for (const agent of projectAgents) agentMap.set(agent.name, agent);
		}
	}

	return { agents: Array.from(agentMap.values()), projectAgentsDir };
}

export function formatAgentList(agents: AgentConfig[], maxItems: number): { text: string; remaining: number } {
	if (agents.length === 0) return { text: "none", remaining: 0 };
	const listed = agents.slice(0, maxItems);
	const remaining = agents.length - listed.length;
	return {
		text: listed.map((a) => `${a.name} (${a.source}): ${a.description}`).join("; "),
		remaining,
	};
}
