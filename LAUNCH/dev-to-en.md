# I Built a Turkish-Speaking AI Coding Agent in 2 Hours

> **TL;DR**: `npm install -g @thorrangonak/kanka`. Built on top of pi-coding-agent, ships with 9 specialized subagents and 5 chain workflows. Open source, MIT, all in Turkish.

---

## The Problem (or: Why Localization Matters)

Most terminal-based AI coding assistants (Claude Code, Aider, pi-coding-agent, OpenAI Codex CLI) are great but **monolingual in English**. As a Turkish developer, I noticed a pattern: every time I switched between writing Turkish prose and using the assistant, there was tiny cognitive friction.

`/compact` vs `/sıkıştır`. `compact` is fine, but my brain processes Turkish faster when I'm already in Turkish mode.

So I thought: what if the agent spoke my language natively? Not just as a translation layer, but with a Turkish persona, Turkish slash commands, Turkish prompts to subagents?

That's how **kanka** was born. (Kanka = "buddy" in Turkish slang, kind of like "dude" or "mate".)

## What is Kanka?

[Kanka](https://github.com/thorrangonak/kanka) is a Turkish-speaking terminal coding agent built on top of the excellent [pi-coding-agent](https://github.com/earendil-works/pi-mono) by Mario Zechner / Earendil Works.

It's not a fork — it's a **package** that depends on `@earendil-works/pi-coding-agent` and extends it with:

1. A Turkish system prompt (the agent introduces itself as "kanka", uses informal Turkish, follows TypeScript best practices by default)
2. **9 bundled subagents** (kasif/planlayici/isci/gozden-geciren/mimar/hata-avcisi/test-yazari/refactorcu/docs-yazari)
3. **5 pre-built workflow pipelines** (chain commands like `/yap`, `/plan-yap`, `/yap-ve-incele`, `/debug`, `/refactor-incele`)
4. **35+ Turkish slash command aliases** for pi's built-ins
5. A custom CLI banner, help text, and contextual help

## Architecture

This is the interesting part for the dev.to crowd. Pi-coding-agent has a beautifully designed extension API that lets you:

- Add custom tools
- Hook into lifecycle events (`before_agent_start`, `input`, `tool_call`, etc.)
- Register slash commands
- Modify the system prompt dynamically
- Override built-in tool rendering

Kanka uses all of these. Here's the structure:

```
@thorrangonak/kanka
├── src/
│   ├── cli.ts                        # Entry point (bin: kanka)
│   ├── system-prompt.ts              # Turkish persona instructions
│   ├── banner.ts                     # ASCII art + welcome
│   ├── extensions/
│   │   ├── turkce-mod.ts             # Injects Turkish persona into systemPrompt
│   │   ├── turkce-komutlar.ts        # /yardım, /çık, /selam, /bilgi
│   │   ├── turkce-aliaslar.ts        # /sıkıştır → ctx.compact()
│   │   ├── dusunce.ts                # /düşünce thinking level mgmt
│   │   └── bilgi-komutlari.ts        # /ekip, /araçlar, /bilgi
│   └── subagent/                     # Forked subagent extension
├── bundled-agents/                   # 9 Turkish agent .md files
└── bundled-prompts/                  # 5 workflow prompt templates
```

The CLI does this:

```ts
import { main } from "@earendil-works/pi-coding-agent";
import turkceModExtension from "./extensions/turkce-mod.js";
import subagentExtension from "./subagent/index.js";
// ...

await main(args, {
  extensionFactories: [
    turkceModExtension,
    turkceKomutlarExtension,
    turkceAliaslarExtension,
    dusunceExtension,
    bilgiKomutlariExtension,
    subagentExtension,
  ],
});
```

Pi's `main()` function does **all** the heavy lifting (CLI arg parsing, session management, OAuth, TUI rendering, model registry). I just inject extra extensions.

## The Subagent System

The killer feature. Each subagent runs as a **separate subprocess** with isolated context window. Communication via JSON mode.

Example workflow:

```bash
> /yap selam.ts dosyasındaki fonksiyonlar için Vitest testleri ekle
```

This triggers a chain:

1. **kasif** (haiku model, fast) explores the codebase, returns compressed findings
2. **planlayici** (sonnet model) receives the findings, plans the test strategy
3. **isci** (sonnet) executes the plan, writes actual test code

Total time: ~90 seconds. Total tokens: ~15k. Output to main conversation: 200 lines of summary.

The trick is that each subagent only sees what's relevant. `kasif` doesn't need to know about test frameworks. `isci` doesn't need to re-explore the codebase. Token efficiency = 5-10x better than a single-agent loop.

## Bug I Learned From

In v0.3.0 I tried to implement Turkish slash aliases using pi's `input` event handler:

```ts
pi.on("input", async (event) => {
  if (event.text.startsWith("/sıkıştır")) {
    return { action: "transform", text: "/compact" };
  }
});
```

The idea: intercept user input, rewrite `/sıkıştır` → `/compact`, let pi handle it normally.

**Didn't work.** Pi's built-in slash command parser runs **before** `emitInput`. So `/sıkıştır` got transformed to `/compact` but at that point pi had already decided it wasn't a built-in command.

The fix (v0.3.1): instead of text transform, register an actual extension command:

```ts
pi.registerCommand("sıkıştır", {
  description: "Compact the context",
  handler: async (args, ctx) => {
    ctx.compact({ customInstructions: args?.trim() || undefined });
  },
});
```

Now `/sıkıştır` is a real extension command that uses pi's `ctx.compact()` action API. Works perfectly.

For pi's **TUI-level** commands (`/login`, `/settings`, `/fork`) that aren't exposed in the extension API, kanka shows a helper notification telling the user to use pi's original command. Honest, working solution — and on the roadmap to fix in v1.0 with deeper TUI integration.

## Lessons Learned

1. **Build on top, don't fork.** Pi has MIT license — easy fork — but I would have inherited maintenance burden. Depending as a package gives me upstream updates for free.
2. **Read the source before designing.** I spent ~30 minutes reading pi's `examples/extensions/` before writing any kanka code. Saved hours later.
3. **Localization is more than translation.** A Turkish-speaking agent isn't just `/compact` → `/sıkıştır`. It's also: code review messages, error responses, agent personas, the way the assistant addresses the user.
4. **Ship v0.1 fast.** First version was 11 kB, 27 files, 4 hours of work. By the time I added subagents (v0.2) and the alias system (v0.3), I had real users (me!) finding real bugs.

## What's Next?

- **v0.4**: Turkish-specific skills (KVKK compliance checker, Turkish ID validator, IBAN formatter, e-invoice integration)
- **v0.5**: Custom theme with Turkish flag-inspired colors
- **v1.0**: Direct TUI integration (no more Tier 2 redirect notifications)

If this resonates with you, even if you don't speak Turkish, the pattern is reproducible. Want to build a Japanese-speaking, French-speaking, or Spanish-speaking version? The kanka source is MIT, fork it as a template.

## Try it

```bash
npm install -g @thorrangonak/kanka
kanka
> /selam        # easter egg
> /yardım       # help in Turkish
> /yap make a fastapi hello-world app
```

[GitHub](https://github.com/thorrangonak/kanka) — ⭐ welcome.

## Credits

Massive thanks to [Mario Zechner](https://x.com/badlogicgames) and [Earendil Works](https://github.com/earendil-works) for building pi-coding-agent the way they did. The extension API is one of the cleanest I've seen in any tool — kanka would have been weeks of work without it.

---

**Tags**: #ai #cli #typescript #opensource #devtools #turkish
