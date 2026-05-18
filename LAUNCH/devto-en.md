---
title: "Building a Turkish-first AI coding agent (and what I learned)"
published: false
description: "Why I built kanka — a localized AI coding assistant for Turkish developers. 7 personas, KVKK-compliant skills, multi-LLM, 70% token savings."
tags: opensource, ai, llm, typescript, cli, devops, productivity, claude
cover_image: https://raw.githubusercontent.com/thorrangonak/kanka/main/assets/hero.svg
canonical_url: https://github.com/thorrangonak/kanka
---

# Building a Turkish-first AI coding agent (and what I learned)

> **TL;DR**: I built **[kanka](https://github.com/thorrangonak/kanka)** — a Turkish-localized AI coding agent on top of pi-coding-agent. 7 personas, KVKK-compliant skills, Windows Terminal integration, ~70% token savings via cache + isolation + parallel async. Works with Claude/GPT/Gemini/GLM/Grok. MIT licensed.

---

## The problem

I've been using Claude Code, Cursor, Aider, and Codex CLI for months. All great tools — but for me as a **Turkish developer**, they all share blind spots:

1. **English-first everything** — system prompts, error messages, docs
2. **No localized cultural fit** — "hocam", "abi", "kanka" addressing styles don't exist
3. **No local-regulation awareness** — KVKK (Turkish GDPR equivalent) compliance? Nope
4. **Windows is second-class** — most agents are macOS/Linux-first

So I built **kanka** on top of [pi-coding-agent](https://github.com/badlogic/pi) (Mario Zechner's excellent open-source agent SDK), specifically targeting the gap.

5 weeks later, here's what I learned.

---

## What kanka does

```bash
$ npm install -g @thorrangonak/kanka
$ kanka
> Build me a NextJS + Tailwind landing page
```

Eight key features, briefly:

| # | Feature | Why it matters |
|---|---------|----------------|
| 🎭 | **Persona system** | 4 built-in styles + user-defined — dynamic system prompt injection per invocation |
| 📓 | **Project journal** | Append-only JSONL log of decisions, fixes, deployments — searchable, tag-based |
| 🔔 | **Windows Terminal integration** | Live tab title (OSC 0) + desktop notifications (OSC 9) for long-running tools |
| 🔄 | **Auto-update system** | Passive npm check + `/update` command + standalone CLI subcommand |
| 🤝 | **9 specialized subagents** | Each runs in isolated context, returns only summary to main thread |
| 🔗 | **Chain pipelines + parallel async** | `/yap` runs scout→planner→worker; tasks can run concurrently with 3x wall-clock speedup |
| 💰 | **Token optimization** | Prompt cache (~70%) + context isolation (~50%) + parallel async (~3x speed) |
| 🔌 | **10+ LLM providers** | Claude, GPT, Gemini, GLM, Grok, Llama, DeepSeek, MiniMax, Ollama, Trendyol-LLM |

But the **localization layer** is where things get interesting.

---

## What "Turkish-first" actually means

It's **not just translating strings**. It's:

### 1. Personas with cultural fit

Same question, different personality:

```
> "What is recursion?"

🤝 kanka  (default, casual-professional):
   "Let's break it down kanka. Recursion = function calling itself..."

🧑‍🏫 hoca (teaching style):
   "First, let's understand what 'recursion' means etymologically.
    Latin 'recurrere' = to run back. In computing..."

🧔 abi (senior dev, direct):
   "Function that calls itself. Needs a base case.
    Otherwise: stack overflow."

💼 patron (pragmatic, MVP-oriented):
   "For loop's not enough? Use it. Memoize for perf.
    Check stack limits before prod."
```

These aren't gimmicks — **tone changes output structure significantly**. `abi` mode → 50 lines of code. `hoca` mode → 200 lines with explanations. Choosing the right tone for the task **doubles iteration speed** for me.

7 built-in personas now (added `akademisyen`, `stajyer`, `paranoyak` in v0.5.0). Users add custom personas via `~/.kanka/personas/<name>.md` — pure markdown, no code needed.

### 2. Local regulation as first-class

This is the **killer feature** for Turkish devs. KVKK (Kişisel Verilerin Korunması Kanunu — Turkey's data protection law, similar to GDPR but with distinct rules) is mandatory for any company with Turkish users.

`/skill:kvkk-uyumlu` makes the agent KVKK-aware:

```ts
// Triggered automatically when you ask about user deletion
// The skill provides patterns like:

async function deleteUserAccount(userId: string) {
  // 1) Check legal hold (invoices = 10 yr retention)
  const hasLegalHold = await checkLegalHold(userId);

  if (hasLegalHold) {
    // Anonymize but keep auditable record
    await db.users.update({
      where: { id: userId },
      data: { email: null, tc: null, anonymized: true },
    });
  } else {
    // Real deletion (KVKK requires actual delete)
    await db.events.deleteMany({ where: { userId } });
    await db.users.delete({ where: { id: userId } });
  }

  // 2) Notify 3rd parties (Mailchimp, Segment...)
  await deleteFromMailchimp(userId);

  // 3) 72-hour KVKK breach notification handled separately
}
```

The skill covers: PII masking middleware, retention policies, data portability, cross-border transfer warnings, 72-hour breach notification flow, and a 14-point checklist.

I spent weeks last year researching KVKK compliance for a client. Now: 1 minute, agent knows what to do.

### 3. Windows-first attitude

Most Turkish enterprise devs are on Windows (Windows still dominates Turkish corporate IT). Most agents I've used feel like Windows is an afterthought.

Kanka uses OSC escape codes for native Windows Terminal integration:

```
Tab title updates live:
  kanka · hazır               (idle)
  kanka · düşünüyor…          (LLM thinking)
  kanka · komut çalıştırıyor  (bash running)
  kanka · dosya okuyor        (reading files)
```

For long tasks (30s+), it pushes a desktop toast via OSC 9:
```
🔔 kanka: cevabım hazır (32s)
```

You can be browsing or in another terminal — you'll know when it's done.

---

## Technical decisions worth discussing

### Pi-coding-agent vs. starting from scratch

I chose to build **on top of** pi-coding-agent rather than fork or rewrite. Pi gives me:

- Multi-provider LLM routing (Claude/GPT/Gemini/etc.) — already solved
- Session management, fork, tree navigation — already solved
- Tool system (bash, read, write, edit) — already solved
- Skills, prompt templates, themes — already solved
- Extension API with hot-reload — already solved

What I added on top:
- Turkish system prompt + personas (`turkce-mod.ts`)
- Turkish slash commands with ASCII aliases (`turkce-komutlar.ts`, `turkce-aliaslar.ts`)
- 9 Turkish subagents + 5 chain workflows (`subagent/index.ts`)
- Domain-specific extensions: `kisilik`, `gunluk`, `windows-terminal`, `guncelle`, `istatistik`, `easter-eggs`
- Bundled personas (markdown), skills (markdown including KVKK)
- Brand suppression (so users see kanka, not pi)
- Auto-update flow

Total kanka-specific code: ~4,000 LoC TypeScript. **Without pi, this would've been 50,000+ LoC.**

Lesson: **don't reinvent the wheel when you can layer customization on top of an excellent base.**

### Personas as system-prompt injection

Most agents have one "personality" baked in. Kanka's personas are **dynamic** — the active persona's content gets injected into the system prompt **on every turn**, via `before_agent_start` hook:

```typescript
pi.on("before_agent_start", async (event) => {
  const aktif = aktifKisilikOku();  // ~/.kanka/aktif-kisilik
  if (aktif === DEFAULT_PERSONA) return undefined;

  const persona = personalardanBul(aktif);
  return {
    systemPrompt: `${event.systemPrompt}\n\n---\n\n${persona.icerik}`,
  };
});
```

**Result**: Same conversation, switch persona mid-flight (`/kisilik abi`), all subsequent responses change tone.

**Pitfall I hit**: Initially I tried embedding all personas into one giant system prompt and using "switch persona" as a runtime instruction. **Way less reliable** than dynamic injection. The model would gradually drift back to default tone.

### KVKK skill structure

Skills in pi (and kanka) are markdown files with frontmatter:

```yaml
---
name: kvkk-uyumlu
description: Turkish KVKK (Law 6698) compliant code...
---

# KVKK content here
```

The agent **decides when to load this skill** based on the description. So `description` is **critical** — it's the trigger.

I optimized for matching phrases like:
- "PII handling"
- "veri silme"
- "KVKK uyumlu"
- "kullanıcı veri export"

Skill content is ~9 KB markdown with code samples, checklists, and 3rd-party service warnings. Loads on demand — doesn't bloat the default context.

### Token economics

For a typical 5-file refactor:

| Approach | Tokens | Cost (Sonnet 4.6) | Wall-clock |
|----------|--------|-------------------|------------|
| Raw API calls | ~180K | $1.80 | 12 min |
| **kanka** (cache + isolation + parallel) | ~54K | **$0.45** | **4 min** |
| **Savings** | **-70%** | **-75%** | **-66%** |

The big wins:

**Anthropic prompt caching** — system prompt + skills + AGENTS.md = ~6K tokens, marked as `cache_control: ephemeral`. After first turn, subsequent reads cost **1/10**.

**Subagent context isolation** — when `delege({ agent: "kasif", task: "..." })` runs, scout has its own 200K context. Main agent gets back a **500-token summary**. Without isolation, main agent's context bloats with every subagent call.

**Parallel async** — 3 independent tasks, `Promise.all`-style. Wall-clock 3x, tokens same. With **git worktrees** as an option (each task in isolated FS), no file conflicts.

For OAuth users (Claude Pro/Max), **marginal cost is zero** — token savings just translate to "less hitting your rate limit."

---

## Distribution strategy

### npm + GitHub Releases

```bash
npm install -g @thorrangonak/kanka
```

Simple. Updates via `kanka update` (built-in command — semver-aware, npm-managed).

### The update system itself

I built a **3-layer update flow**:

1. **Passive check** (24h cached) — every `kanka` startup quietly polls npm registry
2. **Header notification** — if newer version found, shows `📦 Yeni sürüm var: 0.4.1 → 0.5.0`
3. **Update command** — `/güncelle` (interactive) or `kanka update --check` (CLI)

```ts
// guncelle.ts (simplified)
async function pasifKontrol(): Promise<VersiyonCache | null> {
  const cache = cacheOku();
  if (cacheTazeMi(cache)) return cache;  // 24h fresh, skip

  const latest = await npmViewLatest();  // 5s timeout, silent fail
  cacheYaz({ ts: now(), mevcut: VERSION, latest, guncelMi: semverGe(VERSION, latest) });
}
```

**Lesson**: Don't be noisy with update prompts. Cache 24h. Make opt-out trivial (`KANKA_NO_UPDATE_CHECK=1`).

### Version sync (technical debt eliminator)

Originally I had `KANKA_VERSION = "0.4.1"` hardcoded in **4 files**. Forgot to bump one once — embarrassing.

Now:
```
package.json   ← single source of truth
       ↓
scripts/generate-version.mjs (runs on `npm run build` and `npm version` hooks)
       ↓
src/version.ts (auto-generated, gitignored from manual edits)
       ↓
All imports: `import { KANKA_VERSION } from "./version.js"`
```

```bash
npm version minor   # 0.5.0 → 0.6.0
# version.ts auto-updated
# Committed to git
# Tagged v0.6.0
# All in one command
```

**Lesson**: If you find yourself updating a constant in 3+ places, automate it **today**.

---

## Surprising things I learned

### 1. Localized personality > localized strings

Translating menus/messages is easy. **The personality of the assistant matters more**. When `abi` says "Bu kadar." (that's it) instead of "I've completed your request, please let me know if there's anything else", the **interaction model feels different**.

Future agents should think about persona as a **first-class feature**, not as bolt-on prompt engineering.

### 2. Local regulations as first-class skills

KVKK is just one. Every region has compliance gaps:
- 🇩🇪 GDPR / BDSG nuances
- 🇧🇷 LGPD specifics
- 🇰🇷 PIPA quirks
- 🇮🇳 DPDP 2023

Generic agents say "consult a lawyer." Region-specific skills give **actual code patterns** with caveats. There's a market for **localized skill packs**.

### 3. Windows-first is a real differentiator

I checked: of ~20 popular coding agents, fewer than 3 have any Windows Terminal-specific feature (most just "we work on Windows via WSL"). That's a wide-open lane.

OSC escape codes work everywhere modern (Windows Terminal, WezTerm, iTerm2) and require **zero new dependencies**. Easy win.

### 4. Markdown-first plugins beat code-first plugins

For personas and skills, **markdown is the medium**. A non-programmer marketing person can write a great persona. A junior dev with 1 week of TypeScript can write a great skill.

Code-first plugins (TypeScript extensions) have **higher ceiling** but **lower floor** for community contribution.

Kanka's persona/skill addition flow: write markdown, save to `~/.kanka/personas/<name>.md`, restart kanka. **Done**. No build, no install.

---

## What's next

**v0.6.0** (2-3 weeks):
- `/inceleme-modu` (read-only sandbox mode)
- `/onerim` (project scan + AI suggestions)
- Theme system with Turkish color palettes (`denizli`, `kapadokya`, `boğaz`)
- Test suite (vitest + 30+ tests)

**v0.7.0** (1-2 months):
- MCP (Model Context Protocol) integration
- More Turkish skills: e-invoice, payment integrators (Iyzico, Shopier), e-Government OAuth
- Pi package marketplace listing

---

## How to try it

```bash
npm install -g @thorrangonak/kanka
kanka
```

API key via `.env` or `/giris` OAuth flow. Claude Pro/Max subscribers get $0 marginal cost.

If you build something with it or want to contribute, GitHub is here:
**https://github.com/thorrangonak/kanka**

3 ready-to-take "good first issue" tasks for newcomers, all markdown-only:
- Add a new persona
- Write the IBAN validation skill
- Contribute jokes to `/şaka`

MIT licensed. Star if you find it interesting 🌟

---

## Questions I'd love to hear answers to

1. **Have you built a localized version of a developer tool?** What did you learn?
2. **What does your country's data protection law have that's underdocumented in the AI tooling space?**
3. **For non-English-speaking devs**: would you actually use an AI agent in your native language, or do you prefer English-first tools?

Drop a comment 👇 — I'd genuinely love to learn from your experience.

---

Built with ❤️ in Turkey 🇹🇷
