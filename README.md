<p align="center">
  <strong>kanka</strong>
</p>
<p align="center">
  <em>Türkçe konuşan terminal kodlama asistanı.</em><br>
  <strong>"Kanka, şunu yapsana."</strong>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@thorrangonak/kanka"><img alt="npm" src="https://img.shields.io/npm/v/@thorrangonak/kanka?style=flat-square"></a>
  <a href="LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-blue?style=flat-square"></a>
  <img alt="node" src="https://img.shields.io/badge/node-%3E%3D20.6-43853d?style=flat-square">
</p>

---

## Nedir?

**kanka**, terminalde Türkçe konuşarak kullanabileceğin bir AI kodlama asistanıdır. Claude, GPT, Gemini, GLM gibi LLM'leri arkanda kullanır; sen `kanka` yazarsın, o işi yapar.

```bash
$ kanka
> Bana NextJS + Tailwind ile minimal bir landing page yap
```

## Özellikler

- 🇹🇷 **Türkçe-first** — sistem prompt'u, slash komutları ve kişilik tamamen Türkçe.
- 🎭 **4 hazır kişilik** — `kanka` (samimi), `hoca` (öğretici), `abi` (senior dev), `patron` (MVP odaklı). `/kisilik` ile anında değiştir.
- 🤝 **9 hazır subagent** — `kasif`, `planlayici`, `isci`, `gozden-geciren`, `mimar`, `hata-avcisi`, `test-yazari`, `refactorcu`, `docs-yazari`. Hepsi Türkçe konuşur.
- 🔗 **5 hazır workflow** — `/yap`, `/plan-yap`, `/yap-ve-incele`, `/hata-ayikla`, `/refactor-incele` (chain pipeline'lar).
- 📓 **Geliştirici günlüğü** — `/gunluk yaz`, `/gunluk bugun`, `/gunluk ara`. Proje bazında `~/.kanka/gunlukler/` altında JSONL.
- 🔔 **Windows Terminal entegrasyonu** — Tab title dinamik güncellenir ("kanka · düşünüyor"), uzun tool'lar bitince OSC 9 bildirim.
- 📖 **Bundled Türkçe skill'ler** — `turkce-commit`, `turkce-docs` (çoğaltılabilir).
- 🛠️ **4 temel araç** — `read`, `write`, `edit`, `bash`. Karmaşık olmadan iş görür.
- 🧩 **Genişletilebilir** — skill, extension, prompt template, tema, persona ekleyebilirsin.
- 🔒 **MIT lisans** — açık kaynak, fork'la istediğini yap.
- ⚡ **Hızlı kurulum** — tek komutla.

## Subagent Ekibi 👷

Kanka 9 uzman agent'la birlikte gelir. Hepsi izole context'te çalışır, Türkçe rapor verir:

| Agent | Görevi |
|-------|--------|
| 🔍 **kasif** | Hızlı kod keşif, diğer agent'lara devir için sıkıştırılmış bağlam |
| 📝 **planlayici** | Uygulama planı çıkarma (hiç değişiklik yapmaz) |
| ⚙️ **isci** | Genel amaçlı uygulamacı, tam yetki |
| 🔎 **gozden-geciren** | Code review, kalite/güvenlik analizi |
| 🏛️ **mimar** | Sistem mimarisi, trade-off analizi |
| 🐛 **hata-avcisi** | Bug analizi, root cause, stack trace |
| 🧪 **test-yazari** | Test senaryoları + test kodu |
| ♻️ **refactorcu** | Davranış korunarak refactor |
| 📖 **docs-yazari** | README, API docs, JSDoc, Mermaid diyagram |

## Workflow'lar (Chain pipeline'lar) 🔗

Türkçe slash komutlarıyla hazır workflow'lar:

```bash
/yap kullanıcı kayıt sistemi ekle           # kasif → planlayici → isci
/plan-yap auth akışını OAuth'a çevir         # kasif → planlayici (sadece plan)
/yap-ve-incele input validation ekle      # isci → gozden-geciren → isci
/hata-ayikla login bozuk, neden?          # kasif → hata-avcisi (root cause)
/refactor-incele tüm fetch'leri axios'a   # kasif → refactorcu → gozden-geciren
```

Kendi agent'larını `~/.kanka/agents/` veya `.pi/agents/` altına koyabilirsin.
Kendi workflow'larını `~/.kanka/prompts/` altına koyabilirsin.

## Kurulum

```bash
npm install -g @thorrangonak/kanka
```

## Güncelleme 🔄

Kanka günde bir kere pasif olarak npm registry'ye bakar, yeni sürüm varsa header'da bildirim gösterir.

**3 yol var:**

```bash
# 1) Komut satırından (interaktif olmadan, hemen)
kanka update              # latest sürüme yükselt
kanka update --check      # sadece kontrol et

# 2) Oturum içinden (interaktif onay ile)
/güncelle                 # kontrol + onay + npm install -g
/versiyon-kontrol         # sadece kontrol et

# 3) Manuel (klasik npm)
npm install -g @thorrangonak/kanka@latest
```

**Çevre değişkenleri:**

```bash
KANKA_NO_UPDATE_CHECK=1    # Pasif kontrolu kapat (npm view çağrılmaz)
KANKA_NO_UPDATE_PROMPT=1   # Header'da "yeni sürüm var" bildirimi görünmesin
```

GitHub Actions / CI ortamlarında her iki değişkeni de set'le.

**Yetki hatası alırsan** (Linux/macOS): `sudo npm install -g @thorrangonak/kanka@latest`
**Windows'ta**: PowerShell'i yönetici olarak aç ya da nvm-windows kullan.

## Hızlı başlangıç

API anahtarınla giriş yap:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
kanka
```

Veya mevcut Claude Pro/Max aboneliğinle:

```bash
kanka
/login
```

Sonra konuş kanka'yla:

```
> sana güveniyorum kanka, şu projeyi ayağa kaldır
> hata var şurada, bul ve düzelt
> testlerimi yaz
```

## Türkçe komutlar

Oturum içinde **35+ Türkçe slash komutu** kullanabilirsin:

### 📁 Temel

| Komut | Açıklama |
|-------|----------|
| `/yardım` | Bu yardım listesi |
| `/çık` | Oturumdan çık |
| `/bilgi` | Kanka durum özeti (versiyon + model + thinking + ekip) |
| `/ekip` | Subagent ekibini listele |
| `/araçlar` | Aktif tool listesi |
| `/düşünce <seviye>` | Thinking level (kapat/min/düşük/orta/yüksek/max) |
| `/selam` | kanka'dan bir selam |

### 🔗 Workflow (chain pipeline)

| Komut | Pipeline |
|-------|----------|
| `/yap <görev>` | kasif → planlayici → isci |
| `/plan-yap <görev>` | kasif → planlayici (sadece plan) |
| `/yap-ve-incele <görev>` | isci → gozden-geciren → isci |
| `/hata-ayikla <bug>` | kasif → hata-avcisi |
| `/refactor-incele <hedef>` | kasif → refactorcu → gozden-geciren |

### 🗂️ Context yönetimi

| Türkçe | Pi orijinal | Açıklama |
|--------|-------------|----------|
| `/sıkıştır` / `/özet` | `/compact` | Context'i compact et |
| `/yenile` | `/reload` | Runtime'ı yeniden yükle |

### 💾 Oturum yönetimi

| Türkçe | Pi orijinal |
|--------|-------------|
| `/çatalla` | `/fork` |
| `/klonla` | `/clone` |
| `/devam` | `/resume` |
| `/ağaç` | `/tree` |
| `/isim` | `/name` |
| `/içeal` | `/import` |
| `/aktar` | `/export` |
| `/paylaş` | `/share` |
| `/kopyala` | `/copy` |

### 🔐 Auth & ayarlar

| Türkçe | Pi orijinal |
|--------|-------------|
| `/giriş` | `/login` |
| `/çıkış` | `/logout` |
| `/ayarlar` | `/settings` |
| `/kısayollar` | `/hotkeys` |

> Tüm Türkçe komutların **ASCII versiyonları** da var (`/sikistir`, `/cikis`, `/agac` vb.) — Cmd/PowerShell'de Türkçe karakter zor olursa kullan.
>
> Pi'nin orijinal İngilizce komutları da her zaman çalışır.

## CLI bayrakları

```bash
kanka --yardım       # Türkçe yardım
kanka --versiyon     # Versiyon
kanka "görev"        # Doğrudan görev ver
echo "iş" | kanka    # Stdin'den mesaj
```

## Kişilikler (Personas) 🎭

Kanka 4 farklı kişilikle gelir — her biri aynı işi farklı tonda yapar:

| Kişilik | Stil | Ne zaman? |
|---------|------|-----------|
| 🤝 **kanka** | Samimi, rahat, profesyonel | Varsayılan. Günlük iş. |
| 🧑‍🏫 **hoca** | Öğretici, "neden" açıklayan | Öğrenirken, junior dev iken |
| 🧔 **abi** | Senior dev, direkt, kısa | Hızlı iş, gereksiz açıklama yok |
| 💼 **patron** | Pragmatik, MVP odaklı | Deadline, demo, hızlı iterasyon |

```bash
/kisilik           # mevcut kişiliği ve listeyi gör
/kisilik hoca      # hoca moduna geç
/kisilikler        # detaylı katalog
```

Kendi kişiliğini `~/.kanka/personas/<isim>.md` altına ekleyebilirsin (frontmatter: `name`, `description`, `emoji`).

## Günlük 📓

Proje bazında geliştirme notları — karar, fix, deployment, ne öğrendin:

```bash
/gunluk yaz auth refresh token bug düzeltildi #fix #auth
/gunluk bugun                  # bugünün tüm notı
/gunluk ara auth               # "auth" geçen notı
/gunluk son 5                  # son 5 kayıt
/gunluk istatistik             # toplam, ilk/son, etiketler
```

Kayıtlar `~/.kanka/gunlukler/<proje>.jsonl` altında saklanır. `#etiket` sentaksı otomatik parse edilir.

## Windows Terminal entegrasyonu 🔔

Eğer Windows Terminal, WezTerm, iTerm2 kullanıyorsan:

- Tab title dinamik: `kanka · düşünüyor`, `kanka · komut çalıştırıyor`, `kanka · hazır`
- Uzun tool'lar (30s+) bitince masaüstü bildirim (OSC 9)
- Test komutları: `/tab-title <metin>`, `/bildir <metin>`
- Devre dışı bırakma: `KANKA_NO_TERMINAL_INTEGRATION=1`

## Felsefe

kanka, **pi-coding-agent** çekirdeğini kullanır. Pi'nin "minimal, hackable, kendi workflow'una uyarla" felsefesini paylaşır — sadece dili ve markası Türk.

- Karmaşık olmasın, anlaşılır olsun.
- "Sub-agent", "plan mode" gibi kapalı kutu özellikler **yok**. İstersen extension olarak yaz.
- Sistem prompt'u, komutlar, temalar — hepsi düzenlenebilir.

## Geliştirme

```bash
git clone https://github.com/thorrangonak/kanka.git
cd kanka
npm install
npm run build
node dist/cli.js
```

## Lisans

[MIT](LICENSE) © thorrangonak

`pi-coding-agent` (MIT) © Mario Zechner / Earendil Works üzerinde çalışır.
