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
- 🤝 **9 hazır subagent** — `kasif`, `planlayici`, `isci`, `gozden-geciren`, `mimar`, `hata-avcisi`, `test-yazari`, `refactorcu`, `docs-yazari`. Hepsi Türkçe konuşur.
- 🔗 **5 hazır workflow** — `/yap`, `/plan-yap`, `/yap-ve-incele`, `/debug`, `/refactor-incele` (chain pipeline'lar).
- 🛠️ **4 temel araç** — `read`, `write`, `edit`, `bash`. Karmaşık olmadan iş görür.
- 🧩 **Genişletilebilir** — skill, extension, prompt template, tema ekleyebilirsin.
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
/debug login bozuk, neden?                # kasif → hata-avcisi (root cause)
/refactor-incele tüm fetch'leri axios'a   # kasif → refactorcu → gozden-geciren
```

Kendi agent'larını `~/.kanka/agents/` veya `.pi/agents/` altına koyabilirsin.
Kendi workflow'larını `~/.kanka/prompts/` altına koyabilirsin.

## Kurulum

```bash
npm install -g @thorrangonak/kanka
```

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

Oturum içinde slash komutları:

### Sistem komutları

| Türkçe | İngilizce alias | Açıklama |
|--------|----------------|----------|
| `/yardım` | `/help` | Komut listesi |
| `/çık` | `/exit` | Oturumdan çık |
| `/temizle` | `/clear` | Ekranı temizle |
| `/durum` | `/status` | Oturum durumu |
| `/oturum` | `/sessions` | Oturumları listele |
| `/yeni` | `/new` | Yeni oturum başlat |
| `/selam` | — | kanka'dan bir selam |

### Workflow komutları (chain pipeline)

| Komut | Pipeline |
|-------|----------|
| `/yap` | kasif → planlayici → isci |
| `/plan-yap` | kasif → planlayici |
| `/yap-ve-incele` | isci → gozden-geciren → isci |
| `/debug` | kasif → hata-avcisi |
| `/refactor-incele` | kasif → refactorcu → gozden-geciren |

Pi'nin orijinal İngilizce komutları da çalışır.

## CLI bayrakları

```bash
kanka --yardım       # Türkçe yardım
kanka --versiyon     # Versiyon
kanka "görev"        # Doğrudan görev ver
echo "iş" | kanka    # Stdin'den mesaj
```

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
