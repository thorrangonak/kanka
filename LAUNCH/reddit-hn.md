# Reddit + HackerNews — kanka v0.5.0 launch posts

Reddit ve HN için **farklı tone** kullanıyoruz. Reddit'te casual, HN'de technical.

---

## 🟧 r/Turkey — Türkçe topluluk

**Subreddit**: r/Turkey (270K+ üye) veya r/yazilim (40K+ üye, daha hedefli)

**Başlık**: `kanka v0.5.0 — Türkçe konuşan terminal kodlama asistanı yaptım, fikirlerinizi alabilir miyim?`

**Body**:

```markdown
Selam millet!

Birkaç ay önce farkettim: Türkçe konuşan, Türk dev kültürüne uyan bir AI coding agent yok. Claude Code, Cursor, Aider — hepsi süper araçlar ama İngilizce-first.

Bunun üzerine **kanka** adında bir paket yaptım. Pi-coding-agent (Mario Zechner'in açık kaynak SDK'sı) üstüne inşa ettim, ama kanka kendine has özelliklere sahip:

- 🎭 **7 hazır kişilik**: kanka (samimi), hoca (öğretici), abi (senior), patron (MVP), akademisyen (kaynaklı), stajyer (öğrenme modu), paranoyak (OWASP refleksli)
- 🇹🇷 **KVKK skill**: PII masking, veri silme, retention policy — hiçbir agent'ta yok
- 🔔 **Windows Terminal entegrasyonu**: Canlı tab title + toast bildirim
- 💰 **~70% token tasarrufu**: Cache + izole context + paralel async
- 🔌 **10+ LLM**: Claude, GPT, Gemini, GLM, Grok, Llama, Ollama, vb.

Kurulum:
```bash
npm install -g @thorrangonak/kanka
kanka
```

GitHub: https://github.com/thorrangonak/kanka
npm: https://www.npmjs.com/package/@thorrangonak/kanka

Açık kaynak, MIT lisanslı. Persona/skill katkı yapmak isteyenlere 3 "good first issue" var (sadece markdown).

**Sorularım**:
1. Türkçe konuşan AI agent kullanmak nasıl bir his sizce?
2. KVKK uyumlu kod skill'i ne kadar gerçek bir ihtiyaç?
3. Kanka'ya başka ne eklemeli? (`/şaka`, `/atasözü`, `/kahve`, `/övgü` var ama daha fazla?)

Feedback altın değerinde, sağolun!
```

---

## 🟧 r/programming — İngilizce dev community

**Subreddit**: r/programming (6M üye) veya r/coding (650K üye)

**Başlık**: `Built a Turkish-first AI coding agent on top of pi-coding-agent (open source, MIT)`

**Body**:

```markdown
Hi devs,

I've been using Claude Code, Cursor, and Aider for a while. As a Turkish developer, I noticed that none of them really fit the local cultural/regulatory context — they're all English-first.

So I built **kanka** — a Turkish-localized AI coding agent on top of [pi-coding-agent](https://github.com/badlogic/pi). 5 weeks of work, now at v0.5.0.

**What's actually different**:

1. **Persona system** — 7 built-in personalities (kanka/hoca/abi/patron/akademisyen/stajyer/paranoyak) injected dynamically into system prompt. Same question, very different output style. Users add custom personas via markdown.

2. **KVKK skill** — Turkish data protection law (similar to GDPR) compliance baked in. PII masking patterns, retention policies, breach notification flow. Saves hours of compliance research.

3. **Windows Terminal native integration** — OSC 0 for live tab titles, OSC 9 for desktop notifications on long-running tools. Most agents are macOS/Linux-first; kanka is Windows-first.

4. **Token economics** — Prompt cache (~70%) + context isolation (~50%) + parallel async (3x wall-clock). A 5-file refactor that costs $1.80 on raw API drops to $0.45 ($0 with OAuth).

5. **Multi-LLM** — Pi's provider system gets you Claude, GPT, Gemini, GLM, Grok, Llama, Ollama, etc. Task-specific model routing.

**Tech**:
- TypeScript strict mode
- 4,000 LoC kanka-specific, 50K+ behind via pi-coding-agent
- Extension API with hot-reload
- Single source of truth versioning (`npm version` auto-syncs)
- Markdown-first plugin model (personas, skills) — no code needed for community contributions

**Install**:
```bash
npm install -g @thorrangonak/kanka
```

**Links**:
- GitHub: https://github.com/thorrangonak/kanka
- npm: https://www.npmjs.com/package/@thorrangonak/kanka
- DEV.to writeup: [coming soon]

MIT licensed. Star if you find it interesting. 3 "good first issue" tasks available for contributors (all markdown-only).

**Questions I'd love to discuss**:
- How does your country's regulatory landscape affect AI tool adoption?
- Have you built a localized version of a dev tool? Lessons learned?
- For non-English-speaking devs: native language agent or English-first?

Thanks for reading!
```

---

## 🟧 HackerNews "Show HN"

**Format**: Show HN posts genelde **özlü** olur. Linki + 2-3 paragraf.

**Title**: `Show HN: Kanka – A Turkish-localized AI coding agent (TypeScript, MIT)`

**URL**: `https://github.com/thorrangonak/kanka`

**Body** (text post — opsiyonel, eklenmesi önerilen):

```markdown
Hi HN,

I built kanka — a Turkish-localized AI coding agent on top of pi-coding-agent [1]. It's been a 5-week side project that hit v0.5.0 today.

Key features beyond translation:

- 7 built-in personas with dynamic system prompt injection. Same question, different output style depending on whether you've activated "hoca" (teacher), "abi" (senior dev), or "patron" (pragmatic) modes.

- KVKK compliance skill. Turkey's data protection law has specifics that GDPR doesn't (different breach notification timeline, distinct cross-border rules). The skill provides PII masking patterns, retention policies, and a 14-point checklist that I extracted from months of consulting work. No other agent has this.

- Windows Terminal first-class integration. OSC 0 for live tab titles (`kanka · düşünüyor…`), OSC 9 for desktop toasts when long tools finish. Most agents treat Windows as second-class — Turkey has heavy Windows enterprise usage.

- Token economics: 5-file refactor goes from $1.80 to $0.45 via Anthropic prompt caching + subagent context isolation + parallel async. Same patterns Mario Zechner built into pi, just exposed nicely.

- Multi-LLM: works with Claude, GPT, Gemini, GLM, Grok, Llama, Ollama, etc. via pi's provider system.

Markdown-first plugin model: personas and skills are just markdown files in `~/.kanka/personas/` or `~/.kanka/skills/`. Community can contribute without TypeScript.

`npm install -g @thorrangonak/kanka`

Three "good first issue" tasks open for contributors: adding `memur` persona, writing an IBAN validation skill, and contributing to the joke list.

Would love HN's thoughts on:
- Patterns for localization that go beyond translation
- Whether non-English-speaking devs would adopt native-language tools
- How regulatory skills should be packaged in agent ecosystems

[1] https://github.com/badlogic/pi
```

**Yorumlara hazır olun**:

- Pi-coding-agent ile farkı sorulacak → "Pi'nin gücünü Türk kültürüne adapte ediyorum, brand'ım kanka ama Pi'ye 100% credit veriyorum"
- "Türkçe konuşan agent gerçekten gerekli mi?" → "Tone of address (kanka/abi/hocam) Türkçe dev kültüründe normal; agent senin gibi konuşunca akış kesilmiyor. KVKK gibi yerel mevzuat skill'i de killer feature."
- "Why not just translate Claude Code?" → "Translation is the easy part. Personas + regional compliance skills + Windows-first OSC integration are the differentiators."

---

## 🟧 LinkedIn post

**Format**: Personal post, daha story-driven. Türkçe + İngilizce ayrı veya bilingual.

**Türkçe versiyon**:

```markdown
🚀 5 hafta önce küçük bir side project başlattım. Bugün **v0.5.0** çıktı.

**kanka** — Türkçe konuşan terminal kodlama asistanı.

Hikaye basit: Claude Code, Cursor, Aider — hepsi süper araçlar. Ama Türk geliştirici olarak bir gap fark ettim:

❌ Hepsi İngilizce-first (sistem promptu, hata mesajları)
❌ Yerel kültürel adapte yok ("hocam", "abi", "kanka" konuşma tarzı)
❌ KVKK gibi mevzuat skill'i yok
❌ Windows kullanıcısı çoğu zaman ikinci sınıf

Pi-coding-agent (mükemmel açık kaynak agent SDK) üstüne kanka'yı inşa ettim. 5 hafta sonra elimde:

🎭 7 hazır kişilik (kanka/hoca/abi/patron/akademisyen/stajyer/paranoyak)
🇹🇷 KVKK skill — PII masking, veri silme, 72h ihlal bildirim
🔔 Windows Terminal entegrasyonu — canlı tab title + toast bildirim
💰 ~70% token tasarrufu — cache + izolasyon + paralel async
🔌 10+ LLM provider — Claude, GPT, Gemini, GLM, Grok, Llama, Ollama
📓 Lokal geliştirici günlüğü — proje bazlı, etiketli, aranabilir
🤝 9 Türkçe subagent + 5 chain workflow

~4,000 satır TypeScript, 13 extension, MIT lisans.

```bash
npm install -g @thorrangonak/kanka
```

**Öğrendiğim 3 şey**:

1️⃣ **Lokalizasyon = sadece çeviri değil**. Kişilik (persona) tonu output yapısını değiştiriyor. `abi` modu 50 satır, `hoca` modu 200 satır.

2️⃣ **Yerel regulasyon = killer feature**. KVKK uyumluluğu için ay'lar süren araştırma → 1 dakikalık skill çağrısı.

3️⃣ **Markdown-first plugin model > kod-first**. Persona/skill katkı yapmak için TypeScript bilmek gerek değil — sadece markdown.

🔗 GitHub: github.com/thorrangonak/kanka
📦 npm: @thorrangonak/kanka

Türk dev community'sinde duyurmama yardımcı olur musunuz? Beğeni/RT çok değerli. Geri bildirim daha da değerli — yorum bırakın 👇

#opensource #ai #yapayzeka #yazılım #typescript #kodlama
```

**Hashtag**: Lock'ed kalsın — TR + EN karışık, hem Türk hem global LinkedIn algoritmasında görünür.

**En iyi zaman**: Salı/Çarşamba 09:00-11:00 TR saati (LinkedIn morning peak).

---

## 📅 Launch timeline

```
Gün 0 (bugün): Hazırlık — bu dosya
Gün 1 (yarın sabah): r/Turkey + r/yazilim post
Gün 2: DEV.to (TR + EN simultaneous publish)
Gün 3: r/programming + HackerNews Show HN
Gün 4: Twitter/X thread
Gün 5: LinkedIn post + DM'ler (kişisel network)
Gün 7: Sonuçları topla, v0.5.1 patches if needed
```

**Tracking**:
- npm download count (npmjs.com/package/@thorrangonak/kanka)
- GitHub stars
- Reddit upvotes / yorumlar
- HN puanı (genelde 3-5 saat sonra zirve)
- DEV.to view + reactions

**Sonra ne yapacağız** (gün 7+):
- Yeni issue/feedback'leri prioritize et
- v0.5.1 patches (varsa)
- v0.6.0 başlat (`/inceleme-modu`, `/onerim`, tema sistemi)
- "1 hafta sonra" Twitter thread: "kanka'nın launch sonrası 1 haftası — neler öğrendim"
