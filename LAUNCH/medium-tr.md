# Türkçe Konuşan AI Kodlama Asistanı: Kanka'yı Tanıyalım

> **TL;DR**: `npm install -g @thorrangonak/kanka` ile kuruluyor. Pi-coding-agent üzerine inşa edilmiş, 9 Türkçe subagent ve 5 hazır workflow pipeline'ı ile gelen, terminalden Türkçe konuşan açık kaynak AI kodlama asistanı.

---

## Neden başka bir AI kodlama asistanı?

Şu an için Claude Code, Aider, OpenAI Codex CLI, ve son zamanlarda popülerleşen [pi-coding-agent](https://github.com/earendil-works/pi-mono) gibi tonla terminal-bazlı AI asistanı var. Çoğu güzel, hepsi açık kaynak değil, hepsi tamamen İngilizce.

Bir gün şunu sordum: Türk geliştirici terminal'de `/compact` yerine `/sıkıştır` yazabilse ne olur? Asistanına "Kanka, şu auth flow'u OAuth'a çevir" diyebilse?

Cevap: Daha doğal hissedilir. Daha az **bağlamı dolaşma** olur (her seferinde İngilizce'ye geçmek zorunda kalmazsın). Ve marka olarak da kendi şeyimiz olur.

İşte bu yüzden **kanka** doğdu.

## Kanka nedir?

[Kanka](https://github.com/thorrangonak/kanka), pi-coding-agent çekirdeğini kullanan, **Türkçe konuşan** bir terminal kodlama asistanı. Tam olarak şu özelliklerle gelir:

### 1. Türkçe sistem prompt'u

Sistem prompt'u tamamen Türkçe — kanka kendisini "kanka" diye tanıtır, samimi ama profesyonel konuşur, TypeScript best practice'leri default (early return, `unknown` over `any`, conventional commits vs.).

```
$ kanka

Selam kanka! Ne yapalım?
> 
```

### 2. 9 hazır subagent

Pi'nin örneğindeki 4 agent'a (scout, planner, worker, reviewer) ek olarak 5 yenisi eklendi, hepsi Türkçe:

| Agent | Görevi |
|-------|--------|
| 🔍 **kasif** | Hızlı kod keşfi (recon) |
| 📝 **planlayici** | Uygulama planı |
| ⚙️ **isci** | Genel amaçlı implementation |
| 🔎 **gozden-geciren** | Code review |
| 🏛️ **mimar** | Sistem mimarisi tasarımı |
| 🐛 **hata-avcisi** | Bug analizi, root cause |
| 🧪 **test-yazari** | Test senaryoları + kod |
| ♻️ **refactorcu** | Davranış-koruyan refactor |
| 📖 **docs-yazari** | README, API docs, Mermaid |

Hepsi izole context window'da çalışır, sadece **özetlenmiş çıktıyı** ana konuşmaya getirir. Yani kanka 100k token'lık bir codebase'i analiz etse de ana konuşmaya sadece 1-2k token'lık özet döner.

### 3. 5 hazır workflow pipeline

```bash
/yap <görev>              # kasif → planlayici → isci (tam uygulama)
/plan-yap <görev>         # kasif → planlayici (sadece plan)
/yap-ve-incele <görev>    # isci → gozden-geciren → isci
/debug <bug>              # kasif → hata-avcisi (root cause)
/refactor-incele <hedef>  # kasif → refactorcu → gozden-geciren
```

Bunlar **chain pipeline** olarak çalışır — bir agent'ın çıktısı sonrakine **`{previous}`** placeholder'ı ile geçer.

Örnek: `/yap selam.ts dosyasındaki fonksiyonlar için Vitest testleri ekle` dediğimde gerçek senaryoda:

1. **kasif** dosyayı bulup okudu
2. **planlayici** 3 test kategorisi (happy/edge/error) planı çıkardı
3. **isci** Vitest config + test dosyası + 23 test yazdı
4. `npm test` → ✅ 23/23 passed

Toplam süre: ~90 saniye. Toplam token: ~15k. Ana konuşmaya dönen özet: 200 satır.

### 4. 35+ Türkçe slash komutu

Pi'nin tüm dahili komutları için Türkçe alias'lar:

| Türkçe | Pi orijinal |
|--------|-------------|
| `/sıkıştır`, `/özet` | `/compact` |
| `/yenile` | `/reload` |
| `/çatalla` | `/fork` |
| `/klonla` | `/clone` |
| `/devam` | `/resume` |
| `/ağaç` | `/tree` |
| `/giriş` | `/login` |
| `/çıkış` | `/logout` |
| `/ayarlar` | `/settings` |
| `/aktar` | `/export` |
| `/paylaş` | `/share` |
| ...19 tane daha | |

Ve kanka'ya özel olanlar:

- `/düşünce [kapat|min|düşük|orta|yüksek|max]` — thinking level Türkçe yönetimi
- `/ekip` — bundled subagent listesi
- `/araçlar` — aktif tool listesi
- `/bilgi` — tam durum özeti

## Nasıl yapıldı?

Bu projenin tamamı [pi-coding-agent](https://www.npmjs.com/package/@earendil-works/pi-coding-agent)'in SDK'sı üzerine **2 saatten az** sürede kuruldu. Pi'nin felsefesi tam olarak budur: "fork edip değiştirme — extension yaz, üzerine inşa et".

Kanka'nın mimarisi:

```
@thorrangonak/kanka
├── src/cli.ts              ← kanka komutu entry point
├── src/system-prompt.ts    ← Türkçe asistan kişiliği
├── src/banner.ts           ← ASCII art + karşılama
├── src/extensions/
│   ├── turkce-mod.ts       ← sistem prompt'a Türkçe katman ekler
│   ├── turkce-komutlar.ts  ← /yardım, /çık, /selam, /bilgi vs.
│   ├── turkce-aliaslar.ts  ← /sıkıştır, /çatalla, /giriş vs.
│   ├── dusunce.ts          ← /düşünce komutu
│   └── bilgi-komutlari.ts  ← /ekip, /araçlar, /bilgi
├── src/subagent/           ← Pi-mono'nun subagent extension'ı (forkladı)
├── bundled-agents/         ← 9 Türkçe agent (.md)
└── bundled-prompts/        ← 5 workflow prompt (.md)
```

`main()` fonksiyonuna `extensionFactories` parametresi ile kendi extension'larımızı geçiriyoruz. Pi'nin tüm power'ı (TUI, session yönetimi, model registry, OAuth, kompakt vb.) aynen geliyor — biz sadece Türkçe katmanı ekliyoruz.

## Kurulum

```bash
npm install -g @thorrangonak/kanka
```

API key'in varsa direkt çalışır:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
kanka
```

Veya Claude Pro/Max aboneliğin varsa OAuth ile:

```bash
kanka
> /giriş  # veya /login
```

## Açık kaynak, MIT, ücretsiz

[GitHub](https://github.com/thorrangonak/kanka) — fork'la, issue aç, PR yolla, kendi extension'ını yaz.

Pi'nin "minimal, hackable" felsefesi devam ediyor: skill ekle, theme yap, prompt template yaz — her şey extensible.

## Bundan sonra ne var?

- **v0.4**: Türkçe skill paketi (e-fatura, KVKK, TC kimlik validate, IBAN) — Türk geliştirici için yerel ihtiyaçlar
- **v0.5**: Kanka teması (renkli ANSI, açık/koyu varyant)
- **v1.0**: Pi TUI seviyesi entegrasyonu — şu anda Tier 2 alias'lar (çatalla, giriş vb.) sadece yönlendirme yapıyor; v1.0'da bunlar da gerçek action olacak

Yol haritasında ne olmasını istersin? [GitHub issue aç](https://github.com/thorrangonak/kanka/issues), konuşalım.

## Tekrar teşekkür

[@badlogicgames](https://x.com/badlogicgames) (pi-coding-agent yaratıcısı) ve [@earendil_works](https://github.com/earendil-works) ekibine, bu kadar hackable bir altyapı sundukları için minnettarım. Kanka, tamamen onların açık kaynak ürünleri sayesinde mümkün oldu.

---

**Linkler**:
- 📦 [npm](https://www.npmjs.com/package/@thorrangonak/kanka)
- 🐙 [GitHub](https://github.com/thorrangonak/kanka)
- 🤝 [pi-coding-agent](https://github.com/earendil-works/pi-mono)

"Kanka, şunu yapsana."
