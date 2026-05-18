# Twitter/X Thread — kanka v0.5.0 launch

> **Strateji**: 7 tweet thread. İlk tweet hook + GIF/SVG, kalan 6 detay + CTA.
> En iyi zaman: Salı/Çarşamba 14:00-16:00 TR saati (US sabahı + TR mesai sonu birleşimi).

---

## Tweet 1 (HOOK + media)

🇹🇷 **kanka v0.5.0** çıktı — Türkçe konuşan terminal kodlama asistanı.

✨ 7 persona (kanka, hoca, abi, patron, akademisyen, stajyer, paranoyak)
🇹🇷 KVKK uyumlu skill (PII masking, retention, veri silme)
🪟 Windows Terminal native (canlı tab title + bildirim)
💰 ~70% token tasarrufu
🔌 10+ LLM (Claude/GPT/Gemini/GLM/Grok)

```bash
npm i -g @thorrangonak/kanka
```

🧵👇

> **[GIF/Image]**: assets/hero.svg (48 saniyelik animasyon) veya hızlı 5sn ekran kaydı

---

## Tweet 2 — Persona sistemi

🎭 **Aynı soru, farklı kişilik. Anında değişir.**

```
/kisilik hoca   → "Önce 'recursion' kavramına bakalım..."
/kisilik abi    → "Kendi kendini çağıran fonksiyon. Base case'i olmalı."
/kisilik patron → "Loop yetmezse kullan. Prod'da memoize et."
```

Kendi personanı `~/.kanka/personas/<isim>.md` altına ekle. Sadece markdown.

---

## Tweet 3 — KVKK skill (KILLER FEATURE)

🇹🇷 Hiçbir agent'ta yok: **KVKK uyumlu kod yazımı**.

`/skill:kvkk-uyumlu` agent'a şunları öğretir:
• PII masking (TC, email, IBAN, telefon)
• Veri silme akışı (Madde 11)
• 72h ihlal bildirim (Madde 12)
• Yurtdışı transfer uyarıları
• 14-madde checklist

Saatler süren araştırma → 1 dakikada skill çağrısı.

---

## Tweet 4 — Token tasarrufu

💰 5 dosyalık refactor projesi:

```
Çıplak Claude API: 180K token · $1.80 · 12 dk
kanka:             54K token · $0.45 ·  4 dk
                   ────────────────────────────
Kazanç:            -70%       -75%    -66%
```

Nasıl?
✓ Anthropic prompt cache (~70%)
✓ Subagent izole context (~50%)
✓ Paralel async (3x wall-clock)

---

## Tweet 5 — Windows Terminal entegrasyonu

🔔 Çoğu agent macOS/Linux odaklı. Kanka **Windows-first**:

Tab title canlı güncellenir:
• `kanka · hazır`
• `kanka · düşünüyor…`
• `kanka · komut çalıştırıyor`

30s+ tool'lar bitince → masaüstü toast bildirim.

Sen başka pencereye bakıyorken haberin olur. ⚡

---

## Tweet 6 — Multi-LLM esnekliği

🔌 İstediğin LLM'i bağla. Tek paket:

Claude · GPT · Gemini · GLM · Grok · Llama · DeepSeek · Ollama · MiniMax · Trendyol

```bash
# .env'e koy, kanka otomatik bulur
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
GEMINI_API_KEY=...
```

Veya canlı değiştir: `/model` (Ctrl+P cycle).

Task'a göre model: ucuz keşif Gemini, derin reasoning Opus.

---

## Tweet 7 — CTA

🚀 Try it:

```bash
npm install -g @thorrangonak/kanka
kanka
```

⭐ GitHub: github.com/thorrangonak/kanka
📦 npm: npmjs.com/package/@thorrangonak/kanka
💬 Discussions: github.com/thorrangonak/kanka/discussions

MIT lisanslı. Açık kaynak. Türkçe konuşan ilk agent.

Beğendiysen ⭐ + retweet — Türk dev community'e duyuralım.

#opensource #ai #turkce #devtools #typescript

---

## Bonus tweet (varyant 1 — quote tweet için)

Kanka'nın 5 haftalık journey'i:

v0.1.0 (5 hafta önce): Minimal Türkçe wrapper
v0.3.3: Pi brand suppression, fix'ler
v0.4.0: Persona sistemi, günlük, terminal entegrasyonu
v0.4.1: Animasyonlu hero SVG, detaylı README
v0.5.0 (bugün): 7 persona, KVKK skill, easter eggs, istatistik

~4,000 satır TS, 13 extension, 7 persona, 4 skill.

Yola devam 🚀

---

## Bonus tweet (varyant 2 — engagement question)

Sana özel bir soru — Türkçe konuşan AI agent kullanmak nasıl bir his?

Açıkça:
• Tone (kanka, hoca, abi) yardımcı oluyor mu?
• KVKK skill gerçekten lazım mı?
• Windows entegrasyonu (tab title, toast) işine yarıyor mu?

Aşağıya yaz, geri bildirim altın değerinde. 🙏

---

## Engagement notları

**Mention için iyi hesaplar** (yanıt verebilir/RT yapabilir):
- @badlogicgames (Mario Zechner, pi-coding-agent geliştiricisi) — kanka onun çekirdeği üstüne
- @AnthropicAI (Claude — başta cache mekanizmasını göstermesi için)
- @TrendyolGroup (Trendyol-LLM destekçisi)
- @yazboz / @nbatmaz / Türk dev community'nin tanınmış isimleri

**Hashtags**:
- TR: `#yazılım #kodlama #yapayzeka #açıkkaynak`
- EN: `#opensource #ai #llm #devtools #typescript`

**Hashtag stratejisi**: ilk tweet'te 2-3 hashtag (görünürlük), kalan tweet'lerde 0 (algoritma cezası önle).

**Tweet boyutu**: Hepsi 280 char altında. Kontrol etmek için: https://twittercount.com
