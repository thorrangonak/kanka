---
title: "kanka v0.5.0 — Türkçe konuşan terminal kodlama asistanı (Claude/GPT/Gemini destekli)"
published: false
description: "Pi-coding-agent üstüne inşa edilmiş, Türkçe geliştirici kültürüne özel bir AI coding agent. 7 persona, 4 KVKK/Türkçe skill, multi-LLM, %70 token tasarrufu."
tags: turkish, ai, llm, opensource, cli, typescript, claude, openai
cover_image: https://raw.githubusercontent.com/thorrangonak/kanka/main/assets/hero.svg
canonical_url: https://github.com/thorrangonak/kanka
---

# kanka v0.5.0 — Türk geliştiriciler için terminal kodlama asistanı

> **TL;DR**: `npm install -g @thorrangonak/kanka` → `kanka` yaz, Türkçe konuş, kod yazsın.
> 7 persona, KVKK skill, Windows Terminal entegrasyonu, %70 token tasarrufu, **Claude/GPT/Gemini/GLM/Grok** destekli.

---

## Hikaye

Birkaç ay önce farkettim: Türkçe geliştirici topluluğu için **özel bir AI coding agent yoktu**.

Claude Code, Cursor, Aider, Codex CLI — hepsi süper araçlar, ama:

- 📝 Tümü **İngilizce-first** — sistem promptu, hata mesajları, dokümantasyon
- 🇹🇷 Türkçe kullanım deneyimi (kişilik, slash komutlar, kültürel referans) **yok**
- ⚖️ **KVKK** gibi yerel mevzuat için skill yok
- 🪟 Windows kullanıcısı çoğu zaman "ikinci sınıf vatandaş" (macOS/Linux odaklı)

Bunun üzerine [pi-coding-agent](https://github.com/badlogic/pi) (Mario Zechner'in mükemmel açık kaynak agent SDK'sı) üstüne **kanka**'yı inşa ettim — _"Türkçe ambalajda Pi'nin tüm gücü, Türk dev kültürüne özel ek özellikler."_

```bash
$ kanka
> Bana NextJS + Tailwind ile minimal bir landing page yap
```

Bu post'ta size **v0.5.0**'ı tanıtacağım — 5 hafta öncesi `0.1.0`'dan 5.000+ satır kod ve 13 extension'a uzanan yolculuk.

---

## 8 ana özellik

### 1. 🎭 Persona sistemi

Aynı soru, **4 farklı kişilikte cevap**. Sistem prompt'a dinamik enjeksiyon, her cevapta etkili olur.

```
/kisilik hoca
> Recursive nedir?
🧑‍🏫 hoca: "Önce 'recursion' kavramına bakalım. Fonksiyon kendi kendini çağırırsa..."

/kisilik abi
> Recursive nedir?
🧔 abi: "Kendi kendini çağıran fonksiyon. Base case'i olmalı, yoksa stack overflow."

/kisilik patron
> Recursive nedir?
💼 patron: "Loop yetmediği yerde. Performans için memoize'le, prod'a giderken stack limit kontrol et."
```

7 hazır persona: **kanka** (varsayılan, samimi), **hoca** (öğretici), **abi** (senior dev), **patron** (MVP odaklı), **akademisyen** (kaynaklı), **stajyer** (öğrenme modu), **paranoyak** (OWASP refleksli güvenlik).

Kendi personanı `~/.kanka/personas/<isim>.md` altına ekleyebilirsin.

### 2. 📓 Geliştirme günlüğü

Proje bazlı **append-only günlük** — kararlar, fix'ler, deployment notları. Tag desteği, anında arama.

```bash
/gunluk yaz auth refresh token bug düzeltildi #fix #auth
/gunluk bugun                       # bugünün notları
/gunluk ara auth                    # "auth" geçen kayıtlar
/gunluk istatistik                  # ASCII bar grafik
```

Dosya: `~/.kanka/gunlukler/<proje>.jsonl`. **Telemetri yok**, verin lokal.

### 3. 🔔 Windows Terminal entegrasyonu

Tab title **canlı güncellenir** (OSC 0):
- Boşta: `kanka · hazır`
- Düşünürken: `kanka · düşünüyor…`
- Bash çalışırken: `kanka · komut çalıştırıyor`

30 saniyeden uzun süren tool'lar bitince **masaüstü bildirim** (OSC 9):
```
🔔 kanka: cevabım hazır (32s)
```

Multi-tasking için ideal. WezTerm, iTerm2 da destekler.

### 4. 🔄 Otomatik güncelleme

Günde 1 kez npm registry'ye bakar, yeni sürüm varsa **header'da bildirim**:
```
📦 Yeni sürüm var: 0.4.1 → 0.5.0  ·  Güncellemek için: /güncelle
```

3 yol:
```bash
kanka update           # CLI'dan
/güncelle              # Oturum içinden, onay ile
npm install -g @thorrangonak/kanka@latest  # Manuel
```

### 5. 🤝 9 uzman Türkçe subagent

Her biri **izole context**'te çalışır:

| Agent | Görevi |
|-------|--------|
| 🔍 **kasif** | Hızlı kod keşif |
| 📋 **planlayici** | Uygulama planı |
| ⚙️ **isci** | Genel amaçlı uygulamacı |
| 🔎 **gozden-geciren** | Code review + güvenlik |
| 🏛️ **mimar** | Sistem mimarisi |
| 🐛 **hata-avcisi** | Bug + root cause |
| 🧪 **test-yazari** | Test senaryo + kod |
| ♻️ **refactorcu** | Davranış koruyarak refactor |
| 📖 **docs-yazari** | README + JSDoc + Mermaid |

### 6. 🔗 Chain pipeline + paralel async

**Sequential chain** — tek komutla pipeline:
```bash
/yap kullanıcı kayıt formu ekle, validation + test
# → kasif → planlayici → isci
```

**Paralel async** — 3 agent **aynı anda**:
```ts
await delege({
  tasks: [
    { agent: "kasif",          task: "frontend keşif" },
    { agent: "test-yazari",    task: "backend test'leri" },
    { agent: "gozden-geciren", task: "PR review" },
  ],
  concurrency: 3,
});
```

Wall-clock **3x hız**, toplam token aynı.

### 7. 💰 Token tasarrufu (~70%)

3 katmanlı optimizasyon:

| Katman | Tasarruf | Mekanizma |
|--------|---------|-----------|
| 💾 Prompt Cache | ~70% | Anthropic cache hit (sistem prompt + skill) |
| 🔒 İzole Context | ~50% | Subagent kendi context'inde, ana sohbet şişmiyor |
| ⚡ Paralel Async | ~3x hız | Wall-clock 1/3, token aynı |

5 dosyalık refactor projesi:

| | Çıplak Claude | **kanka** | Kazanç |
|--|---------------|-----------|--------|
| Token | 180,000 | **54,000** | **-70%** |
| Maliyet | $1.80 | **$0.45** | **-75%** |
| Süre | 12 dk | **4 dk** | **-66%** |

**Bonus**: Claude Pro/Max OAuth ile **$0 marginal cost** — abonelik kapsamında.

### 8. 🔌 10+ LLM provider

Tek paket, **istediğin LLM**:

```
Claude · GPT · Gemini · GLM · Grok · Llama · DeepSeek · Trendyol · MiniMax · Ollama
```

`.env` koy, otomatik bulunur:
```bash
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-proj-...
GEMINI_API_KEY=AIza...
```

Veya canlı değiştir: `/model` (Ctrl+P ile cycle).

**Hibrit kullanım** — task'a göre model:
```ts
await delege({ agent: "kasif", task: "...", model: "google/gemini-2.5-flash" });   // hızlı + ucuz keşif
await delege({ agent: "isci",  task: "...", model: "anthropic/claude-opus-4-7" }); // derin reasoning
```

---

## 🇹🇷 Türkçe-spesifik özellikler

### KVKK Skill — başka hiçbir agent'ta yok

`/skill:kvkk-uyumlu` — **6698 sayılı kanun** ile uyumlu kod yazımı:

- PII masking middleware (TC, email, IBAN, kredi kartı, telefon pattern)
- Veri saklama (retention) policy + cron cleanup örnekleri
- Veri silme talebine yanıt (Madde 11)
- Veri taşıma (export) hakkı
- Yurtdışı transfer uyarıları (Mailchimp/Mixpanel)
- İhlal durumunda 72 saatlik KVKK bildirim akışı
- Sıkça yapılan KVKK hataları + düzeltme tablosu
- Hızlı checklist (14 madde)

```ts
// PII masking middleware örneği (skill'den)
export function maskPII(msg: string): string {
  const PII_PATTERNS = [
    /\b\d{11}\b/g,                                      // TC Kimlik
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,  // Email
    /\b(?:\+90|0)?\s*5\d{2}\s*\d{3}\s*\d{2}\s*\d{2}\b/g,    // Türk cep no
    /\bTR\d{2}\s*(?:\d{4}\s*){5}\d{2}\b/gi,                 // IBAN
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,          // Kredi kartı
  ];
  let masked = msg;
  for (const re of PII_PATTERNS) {
    masked = masked.replace(re, (m) => "*".repeat(m.length));
  }
  return masked;
}
```

### Conventional Commits + Türkçe açıklama

`/skill:turkce-commit` ve `/skill:turkce-pr` ile:
- ✅ `feat: kullanıcı kayıt formu (#142)` — type İngilizce, açıklama Türkçe
- ✅ `fix: login redirect döngüsü düzeltildi`
- ❌ `Fixed bug` (type yok, belirsiz)
- ❌ `FEAT: Yeni feature ekledim!!!` (uppercase, geçmiş zaman)

### Türkçe komutlar

35+ slash komutu, hepsi Türkçe + ASCII alias:

```
/yardım /çık /bilgi /ekip /araçlar /düşünce
/kisilik /kisilikler
/gunluk yaz|bugun|son|ara|istatistik
/yap /plan-yap /yap-ve-incele /hata-ayikla /refactor-incele
/güncelle /versiyon-kontrol
/şaka /atasözü /kahve /övgü
/istatistik
```

Türkçe karakter zor gelirse `/cikis`, `/sikistir` gibi ASCII versiyonlar da çalışır.

---

## Mimarinin teknik tarafı

Kanka **pi-coding-agent SDK** üstüne inşa edilmiş bir paket:

```
@thorrangonak/kanka
├── src/
│   ├── cli.ts                       # Entry point + kanka brand suppression
│   ├── system-prompt.ts             # Türkçe kişilik
│   ├── version.ts                   # AUTO-GENERATED from package.json
│   ├── extensions/                  # 13 extension
│   │   ├── kisilik.ts               # 7 persona sistemi
│   │   ├── gunluk.ts                # Günlük (JSONL)
│   │   ├── windows-terminal.ts      # OSC 0/9
│   │   ├── guncelle.ts              # Update sistemi
│   │   ├── istatistik.ts            # Kullanım analizi
│   │   ├── easter-eggs.ts           # /şaka, /atasözü, /kahve, /övgü
│   │   ├── turkce-komutlar.ts       # Türkçe slash komutlar
│   │   ├── kanka-header.ts          # ASCII logo + update notice
│   │   └── ...
│   └── subagent/                    # 9 Türkçe agent + 5 chain workflow
├── bundled-personas/                # 7 markdown persona
├── bundled-skills/                  # 4 Türkçe skill (KVKK dahil)
├── bundled-agents/                  # 9 Türkçe subagent
└── bundled-prompts/                 # 5 chain workflow template
```

Pi'nin **extension API**'si ile birlikte hot-pluggable: kullanıcı kendi extension/persona/skill yazabilir, `~/.kanka/` altına koyabilir, otomatik discover.

**TypeScript strict mode** + **CSS animation SVG** (44 KB animasyonlu README hero) + **tek source of truth versioning** (build sırasında `version.ts` otomatik generate).

---

## Neden Türkçe-first matter eder?

İngilizce-first agent'larla 6 ay çalıştıktan sonra şunu farkettim:

1. **Düşünme dili → kod dili**: Türkçe düşünüyorsam, agent'a "auth refresh tokenını mutate eden race condition'a karşı dirençli yap" diyebilmek **çok daha hızlı**. İngilizceye çevirme cognitive load değerli.

2. **Kişilik etkisi gerçek**: `abi` modunda "şu kodu refactor et" → 50 satırlık temiz sonuç. `hoca` modunda aynı şey → 200 satırlık açıklamalı tutorial. Bağlama göre seçmek **iş hızını 2x artırıyor**.

3. **Yerel mevzuat skill'leri kritik**: KVKK uyumluluğu gerçek bir gerekliliktir, ama hiçbir agent skill'ine sahip değildir. Türk freelancer/startup için **birkaç saatlik manuel araştırma → 1 dakikalık skill çağırma**.

4. **Geliştirici kültürü**: "Hocam", "abi", "kanka" gibi samimi hitap çoğu Türk dev'in **gerçek konuşma şekli**. Agent senin gibi konuşunca, **akış kesilmiyor**.

---

## Kurulum (5 saniye)

```bash
npm install -g @thorrangonak/kanka

# Claude Pro/Max varsa
kanka
/giriş

# Veya API key
export ANTHROPIC_API_KEY=sk-ant-...
kanka

# Direkt komut
kanka "Bana bir Express app yaz"
```

---

## Open source + katkı

Kanka **MIT lisanslı**, GitHub'da: https://github.com/thorrangonak/kanka

3 hazır "good first issue" var katkı yapmak isteyenler için:

- 🎭 [#1 `memur` personası eklensin](https://github.com/thorrangonak/kanka/issues/1)
- 🇹🇷 [#2 `iban-validate` skill yazılsın](https://github.com/thorrangonak/kanka/issues/2)
- 🎉 [#3 `/şaka` listesine 5 yeni şaka](https://github.com/thorrangonak/kanka/issues/3)

[CONTRIBUTING.md](https://github.com/thorrangonak/kanka/blob/main/CONTRIBUTING.md)'de detaylı rehber var. Persona / skill eklemek **sadece markdown** — TypeScript bilmene gerek yok.

---

## Yol haritası

- **v0.6.0** (2-3 hafta): `/inceleme-modu` (read-only), `/onerim` (proje scan), tema sistemi (denizli, kapadokya, boğaz), test suite, daha iyi error mesajları
- **v0.7.0** (1-2 ay): MCP entegrasyonu, daha fazla Türkçe skill (e-fatura, iyzico, e-Devlet OAuth), Pi package system ile community marketplace

---

## Sonuç

Türkçe geliştirici topluluğu **gerçekten** kullanışlı bir AI coding agent'ı hak ediyor. Kanka, _sadece çeviri değil_ — kişilik, mevzuat skill'leri, yerel kültür ve Windows-first Windows desteği ile **özelleştirilmiş bir deneyim**.

`npm install -g @thorrangonak/kanka` çalıştır, dene, geri bildirim ver.

**Hadi kanka, başlayalım!** 🚀

---

**GitHub**: [thorrangonak/kanka](https://github.com/thorrangonak/kanka)
**npm**: [@thorrangonak/kanka](https://www.npmjs.com/package/@thorrangonak/kanka)
**Discussions**: [GitHub Discussions](https://github.com/thorrangonak/kanka/discussions)

Beğendiysen ⭐ yıldız koy, feedback için issue aç. **MIT lisanslı**, fork etmek serbest.

Soruları aşağıda yorum olarak da yazabilirsin, Türkçe veya İngilizce. 👇
