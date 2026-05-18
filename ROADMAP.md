# 🗺️ Kanka Yol Haritası

Bu dosya kanka'nın gelmiş geleceği ve nereye gittiğini gösterir. Aksaklık veya değişiklik olabilir, ana hatlar burada.

> **Katkı yapmak ister misin?** [CONTRIBUTING.md](CONTRIBUTING.md) → "good first issue" etiketli issue'lara bak.

---

## ✅ Yayınlandı

### v0.5.0 — Personas++, KVKK, eğlence, istatistik *(yayında)*
- 🎭 **7 persona**: kanka, hoca, abi, patron, akademisyen, stajyer, paranoyak
- 🇹🇷 **4 Türkçe skill**: turkce-commit, turkce-docs, turkce-pr, **kvkk-uyumlu**
- 🎉 Easter eggs: `/şaka`, `/atasözü`, `/kahve`, `/övgü`
- 📊 `/istatistik` lokal kullanım analizi
- 🔧 Version sync — single source of truth (`src/version.ts` auto-generate)

### v0.4.1 — README hero SVG + 8 özellik detayı
- 🎬 Animasyonlu hero SVG (48 saniyelik 8 sahnelik tanıtım)
- 📝 README detaylı 8 özellik anlatımı (token, multi-LLM dahil)

### v0.4.0 — Persona sistemi, günlük, terminal, güncelleme
- 🎭 Persona sistemi (4 kişilik, dinamik sistem prompt enjeksiyonu)
- 📓 Günlük (proje bazlı JSONL, etiket, arama)
- 🔔 Windows Terminal entegrasyonu (OSC 0 + OSC 9)
- 🔄 Güncelleme sistemi (pasif kontrol + `/güncelle` + `kanka update`)
- 🤝 9 Türkçe subagent + 5 chain workflow

---

## 🚧 Geliştirme aşamasında (v0.6.0)

**Hedef**: 2-3 hafta içinde. **Tema**: developer-experience + community.

### Yapılacaklar
- 📊 **`/inceleme-modu`** — read-only mode (write/edit/bash kapalı, sadece keşif). Yeni codebase'e güvenli bakış.
- 💡 **`/onerim`** — proje bazlı akıllı suggestion'lar. "tsconfig'de strict yok, açalım mı?" "500 satırlık dosya, bölelim mi?"
- 🎨 **Tema sistemi**: Türkçe temalar — `denizli` (mavi), `kapadokya` (toprak), `boğaz` (lacivert + altın), `karadeniz` (yeşil-mavi), `dark-istanbul` (antrasit + kırmızı)
- 📋 **`/yapilacaklar`** — proje bazlı todo tracker (`~/.kanka/yapilacaklar/<proje>.json`)
- 🌙 **`/gece-modu`** — 22:00-06:00 koruma: `git push --force`, `npm publish` öncesi ek onay
- 🔧 **Test suite** — vitest + 30+ test (`gunluk`, `kisilik`, `guncelle` semver karşılaştırma)
- 📝 **Daha iyi error mesajları** — pi'den gelen ENOENT vs. → Türkçe açıklama

### Belki (community feedback'e göre)
- 🎙️ **Voice mode** — Whisper local + mikrofon dinleme
- 📺 **Web dashboard** — `kanka --web`, localhost:7878, history/journal/persona yönetimi

---

## 🔮 Uzun vadeli (v0.7.0+)

**Hedef**: 1-2 ay. **Tema**: ekosistem genişleme.

### MCP (Model Context Protocol) entegrasyonu
- Anthropic'in standardı (filesystem, GitHub, Postgres, Slack server'ları)
- `/mcp ekle <server>` komutu
- Cursor / Claude Code / Zed kullanıcıları kanka'ya gelir

### Daha fazla Türkçe skill
- `turkce-readme` — README template (TR + EN birlikte)
- `turkce-test` — Türkçe test naming (Vitest, Jest, Pytest)
- `iban-tc-validate` — IBAN, TC kimlik, telefon, vergi no validation snippet'leri
- `fatura-pdf` — Türk fatura formatı, e-fatura entegrasyonu
- `e-devlet-oauth` — e-Devlet kapısı entegrasyonu pattern'i
- `iyzico-shopier` — Türk ödeme entegratörü kod örnekleri

### Daha fazla persona
- `memur` — Süper formal, spec'e bağlı, doc manyağı
- `rockstar` — Cesur, opinionated, "buna lazım değil microservice"
- `paranoyak-plus` — KVKK + ISO27001 + PCI-DSS triple combo

### Pi Package System ile dağıtım
- `kanka install @kanka/persona-pack-anime` (community personas)
- `kanka install @kanka/skill-flutter-tr` (TR Flutter snippets)
- `kanka install @kanka/theme-istanbul` (premium tema pack)

---

## ❌ Yapılmayacaklar (deliberate non-features)

Kasıtlı olarak ekleme **planlamıyoruz**, sorma:

- ❌ **Telemetry / analytics gönderme** — Verin sende kalır, lokal. `~/.kanka/`'daki her şey **senin**.
- ❌ **Cloud sync** — Session, persona, journal hep lokal. Cloud istersen Git'e koy.
- ❌ **Karmaşık plugin marketplace** — Pi package system zaten var, ekstra layer gereksiz.
- ❌ **Yerli LLM zorunluluğu** — Hangi LLM kullanılacağına kullanıcı karar verir. Trendyol-LLM API key'ini koyarsan otomatik çalışır, ama biz "zorla yerli" demiyoruz.
- ❌ **Sub-agent UI kapalı kutu özelliği** — Pi'nin felsefesi: extension olarak istediğini yaz. Built-in olarak bloat eklemiyoruz.

---

## 🤝 Önerin var mı?

- **Yeni feature**: [Feature request issue aç](https://github.com/thorrangonak/kanka/issues/new?template=feature_request.md)
- **Yeni persona**: [Persona request issue aç](https://github.com/thorrangonak/kanka/issues/new?template=persona_request.md)
- **Yeni skill**: [Skill önerisi açıklama](https://github.com/thorrangonak/kanka/discussions) (Discussions)
- **Bug bulduysan**: [Bug report aç](https://github.com/thorrangonak/kanka/issues/new?template=bug_report.md)
- **Sohbet etmek istiyorsan**: [GitHub Discussions](https://github.com/thorrangonak/kanka/discussions)

---

**Son güncelleme**: v0.5.0 yayını sonrası.
**Kanka'nın felsefesi**: Türkçe, minimal, hackable, kullanıcı verisi lokal.
