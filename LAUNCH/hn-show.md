# Show HN Posts

> Two versions: one focused on the Turkish angle, one focused on the technical pattern.
> Pick based on audience research / time of day.

---

## Version A: Localization Angle

**Title**: `Show HN: Kanka – A Turkish-speaking coding agent built on pi-coding-agent`

**URL**: `https://github.com/thorrangonak/kanka`

**Text** (optional, since URL is the main link):

```
Hi HN,

I built kanka, a terminal coding agent that speaks Turkish natively. It's
not a translation layer — the system prompt, slash commands (/sıkıştır,
/çatalla, /düşünce etc.), agent personas, and subagent reports are all
in Turkish.

It's built as a package on top of @earendil-works/pi-coding-agent (Mario
Zechner / Armin Ronacher's new coding agent harness). Pi has a really
clean extension API that lets you inject system prompts, register
commands, and add tools without forking the core. Kanka uses that to add:

- A Turkish system prompt (TypeScript best-practice defaults baked in)
- 9 bundled subagents (kasif/scout, planlayici/planner, isci/worker,
  gozden-geciren/reviewer, mimar/architect, hata-avcisi/debugger,
  test-yazari/qa, refactorcu/refactorer, docs-yazari/docs-writer)
- 5 chain workflow pipelines (/yap, /plan-yap, /yap-ve-incele,
  /debug, /refactor-incele)
- 35+ Turkish slash command aliases for pi's built-ins

The whole thing is ~150kB unpacked. Most of the value is in the bundled
agent .md files and the system-prompt — total code is <1000 lines of TS.

I wrote a longer technical postmortem here: [link to dev.to article]

MIT licensed. Feedback welcome, especially from non-English-speaking
devs — the pattern is reproducible for any language. Fork it as a
template.
```

---

## Version B: Technical Pattern Angle

**Title**: `Show HN: How to build a localized AI coding agent as an npm package`

**URL**: `https://github.com/thorrangonak/kanka` (or dev.to article URL)

**Text**:

```
I built a Turkish-speaking version of pi-coding-agent and learned some
interesting things about extension architectures along the way.

Key insight: pi exposes a `main()` function that accepts `extensionFactories`
as an option. So instead of forking the binary, you can publish your own
CLI (kanka), depend on @earendil-works/pi-coding-agent, and inject your
extensions there. Your users get pi's tool, your branding, your language.

Architecture sketch:

  // your-cli.ts
  import { main } from "@earendil-works/pi-coding-agent";
  import yourCustomExtension from "./extensions/custom.js";

  await main(args, {
    extensionFactories: [yourCustomExtension],
  });

This means:
- Pi maintainers ship updates → you get them via npm
- You ship customizations → users get them via your package
- No fork divergence

Gotcha: pi's built-in slash commands (like /compact) are parsed in the
TUI layer BEFORE the extension `input` event fires. So you can't text-
transform /sıkıştır → /compact. You have to register /sıkıştır as a real
extension command that calls ctx.compact() directly. (Took me a v0.3.1
to figure that out.)

For TUI-level commands (/login, /settings, /fork) that aren't exposed
via extension API, the honest solution is a helper notification: "use
pi's original /login command". Future v1.0 will probably need PRs
upstream to pi for proper hooks.

GitHub: https://github.com/thorrangonak/kanka
npm: @thorrangonak/kanka (MIT)

Would love to see other localized variants — French, Japanese, Spanish.
The bundled-agents/ folder is the template.
```

---

## Reply preparedness

Common HN questions to prepare for:

**Q: Why not just translate the prompts at runtime?**
A: I considered it. The issue is that translation introduces a "filter" layer — you lose nuance, and the model thinks in English first then outputs Turkish, which is slower and less natural. Native system prompt = native thought process.

**Q: How is this different from prompting Claude in Turkish?**
A: It's mostly about: (1) Turkish slash commands like `/sıkıştır`, (2) Turkish subagent reports, (3) the agent introducing itself with Turkish persona, (4) Turkish-aware coding conventions in the system prompt. You could replicate (1) with a shell alias but (2-4) need the harness.

**Q: Why bundle 9 subagents instead of letting users add their own?**
A: Both. Bundled ones are defaults. Users can override by putting .md files in ~/.kanka/agents/ or .pi/agents/.

**Q: Does this work on Windows?**
A: Yes, that's actually my primary dev env. Tested with Git Bash and PowerShell.

**Q: License of the bundled prompts?**
A: MIT, like the rest. The agent .md files are documentation + prompts, no proprietary content.

**Q: Why depend on pi instead of writing my own harness?**
A: Pi already handles 100+ things correctly (TUI, sessions, compaction, OAuth, model registry, JSON mode, RPC). Writing my own would be 6 months of work just to reach parity. Pi is open source, MIT, hackable — perfect base.
