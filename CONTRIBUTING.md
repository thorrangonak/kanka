# 🤝 Kanka'ya Katkı Rehberi

Selam kanka, kanka'ya katkı yapmak istemen süper. Bu rehber sana yol gösterir.

## 🎯 Hızlı bakış

Ne yapmak istiyorsun?

| İstek | Nereye? |
|-------|---------|
| Bug buldum | [Bug report issue](https://github.com/thorrangonak/kanka/issues/new?template=bug_report.md) |
| Yeni feature istiyorum | [Feature request](https://github.com/thorrangonak/kanka/issues/new?template=feature_request.md) |
| Yeni persona önerim var | [Persona request](https://github.com/thorrangonak/kanka/issues/new?template=persona_request.md) |
| Yeni skill yazmak istiyorum | [Discussions](https://github.com/thorrangonak/kanka/discussions) — önce tartışalım |
| Dokümantasyon eksik/yanlış | PR aç, küçük olsa bile |
| Kod katkısı | Aşağıya bak ↓ |
| Sohbet etmek istiyorum | [Discussions](https://github.com/thorrangonak/kanka/discussions) |

---

## 🚀 İlk katkı için

İlk katkıyı yapacaksan **"good first issue"** etiketli issue'lara bak — bunlar küçük ve net görevler:

🔗 https://github.com/thorrangonak/kanka/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22

İyi başlangıç tipleri:
- 📝 Typo düzeltme (README, comment)
- 📚 Yeni persona ekleme (sadece markdown)
- 🇹🇷 Yeni skill yazma (sadece markdown)
- 🎉 Easter egg eklemek (`/şaka`, `/atasözü` listesi genişletme)
- 🌐 İngilizce README çevirisi (varsa onun güncellemesi)

---

## 🛠️ Geliştirme ortamı kurulumu

```bash
# Repo'yu fork'la, sonra:
git clone https://github.com/<senin-username>/kanka.git
cd kanka

# Dependencies
npm install

# Build (TypeScript → dist/)
npm run build

# Lokal test (global kanka yerine senin build'in)
npm link
kanka --versiyon   # → senin build versiyonun

# Bittikten sonra link'i kaldır
npm unlink -g @thorrangonak/kanka
```

**Gereksinimler**:
- Node.js >= 20.6
- npm >= 10
- Git
- (Opsiyonel) Windows Terminal / WezTerm / iTerm2 — terminal entegrasyonu test'i için

---

## 📋 Katkı tipleri ve nasıl yapılır

### 1. 🎭 Yeni persona ekleme

En kolay katkı tipi! Sadece markdown.

**Adım 1**: `bundled-personas/` altına `<isim>.md` aç:

```yaml
---
name: <isim>
description: Kısa açıklama (1-2 cümle) — ne zaman kullanılır?
emoji: 🎯
---

## Kişiliğin
- Türkçe konuşur, [stil özelliği]
- [Diğer özellikler...]

## Üslup örnekleri
- ✅ "...örnek doğru ifade..."
- ❌ "...yapılmaması gereken..."

## Çalışma tarzı
- [Detay 1]
- [Detay 2]

## Ne zaman ideal?
- [Senaryo 1]
- [Senaryo 2]
```

**Adım 2**: Test et:

```bash
npm run build
node dist/cli.js
# Sonra: /kisilik <senin-persona-adın>
```

**Adım 3**: PR aç. Başlık: `feat: <isim> personası eklendi`

**Örnek katkılar**:
- `memur` — Süper formal
- `rockstar` — Cesur, opinionated
- `coach` — Motivasyon odaklı

---

### 2. 🇹🇷 Yeni Türkçe skill ekleme

**Adım 1**: `bundled-skills/<skill-adı>/SKILL.md` oluştur:

```yaml
---
name: <skill-adı>
description: Bu skill ne yapar? Ne zaman çağrılmalı? (Agent bu metni okuyarak skill'i seçer)
---

# <Skill Adı>

[Detaylı açıklama, kod örnekleri, pattern'ler]

## Kullanım

Kullanıcı "X", "Y", "Z" gibi şeyler söylediğinde:
1. [Adım 1]
2. [Adım 2]
...
```

**Önemli**: `description` ne kadar net olursa, LLM o kadar doğru zamanda skill'i çağırır.

**Önerilen skill fikirleri**:
- `turkce-readme` — README template
- `turkce-test` — Vitest/Jest Türkçe test isimleri
- `iban-validate` — TC IBAN validation snippets
- `e-fatura` — Türk e-fatura formatı
- `iyzico-shopier` — Türk ödeme entegratörleri
- `vergi-tc-validate` — TC kimlik no checksum algoritması

**PR başlığı**: `feat: <skill-adı> skill eklendi`

---

### 3. 🔧 Yeni extension yazma (TypeScript)

Daha kompleks ama esnek katkı tipi.

**Adım 1**: `src/extensions/<isim>.ts` oluştur:

```typescript
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function myExtension(pi: ExtensionAPI) {
  pi.registerCommand("benim-komutum", {
    description: "Bu komut ne yapar (Türkçe)",
    handler: async (args, ctx) => {
      ctx.ui.notify("Selam kanka!", "info");
    },
  });
}
```

**Adım 2**: `src/cli.ts`'e import + factory'lere ekle:

```typescript
import myExtension from "./extensions/<isim>.js";

// ... main() çağrısının extensionFactories listesine ekle:
extensionFactories: [
  // ...
  myExtension,
]
```

**Adım 3**: Test et:

```bash
npm run build
node dist/cli.js
> /benim-komutum
```

**Extension yazımı için referans**:
- Mevcut basit örnekler: `src/extensions/dusunce.ts`, `src/extensions/gunluk.ts`
- Pi extension docs: `node_modules/@earendil-works/pi-coding-agent/docs/extensions.md`
- ExtensionAPI methods: `pi.registerCommand`, `pi.registerTool`, `pi.on(event)`, vb.

---

### 4. 🐛 Bug fix

1. **Issue aç** (varsa skip) — duplicate önler
2. Branch aç: `git checkout -b fix/<kısa-açıklama>`
3. Düzelt, test et
4. Conventional Commit: `git commit -m "fix: ..."`
5. PR aç, issue'yu link'le: "Closes #N"

---

### 5. 📖 Dokümantasyon

README, ROADMAP, CONTRIBUTING, persona açıklamaları, skill içerikleri — hepsi katkıya açık.

**Türkçe/İngilizce karışım kuralları** (`bundled-skills/turkce-docs` skill'ine bak):
- Teknik terim: İngilizce kalır (callback, hook, prop, state, build)
- Genel terim: Türkçe (değişken, fonksiyon, sınıf, dosya, döngü)
- Tutarlılık: Bir dokümanda "fonksiyon" diyorsan, sonra "function" deme

---

## 📝 Commit mesajı kuralları

Conventional Commits + Türkçe açıklama:

```
<type>: <kısa Türkçe açıklama> [(#issue)]

[opsiyonel detay paragrafı]

[opsiyonel footer]
```

**Type'lar**:
- `feat` — Yeni özellik
- `fix` — Bug fix
- `docs` — Sadece dokümantasyon
- `style` — Format (kod davranışı değişmez)
- `refactor` — Davranış aynı, yapı değişti
- `perf` — Performans iyileştirme
- `test` — Test ekleme/güncelleme
- `chore` — Build, dependency, config
- `ci` — CI/CD pipeline

**Örnekler**:
- ✅ `feat: memur personası eklendi (#42)`
- ✅ `fix: /gunluk istatistik komutu boş projeyi handle etmiyordu`
- ✅ `docs: KVKK skill'inde retention örnekleri eklendi`
- ❌ `Fixed bug` (type yok, İngilizce, belirsiz)
- ❌ `FEAT: Yeni feature ekledim!!!` (uppercase, ünlem, geçmiş zaman)

Detay için: [turkce-commit skill](bundled-skills/turkce-commit/SKILL.md)

---

## 🔄 PR süreci

1. **Fork** + **clone**
2. **Branch** aç: `feat/...`, `fix/...`, `docs/...`
3. Değişikliği yap, **test et**
4. **Build** geçiyor mu kontrol et: `npm run build`
5. **Commit** (Conventional)
6. **Push** + **PR aç**

**PR açıklaması**:
- Ne yaptın? (1-2 cümle)
- Neden? (issue link)
- Test ettin mi? Nasıl?
- Breaking change var mı?

Detaylı şablon: [bundled-skills/turkce-pr](bundled-skills/turkce-pr/SKILL.md)

---

## ✅ Code review beklentileri

Sen PR açtın, maintainer (şu an: [@thorrangonak](https://github.com/thorrangonak)) review yapacak. Süreç:

1. **Otomatik**: GitHub Actions CI çalışacak (build + lint kontrolü)
2. **Manuel**: Kod incelemesi, gerekirse yorum
3. **Feedback**: Değişiklik istenebilir — defansif olma, "haklısın" sağlıklı 😄
4. **Merge**: Maintainer onayı + CI yeşil = squash merge

**Review süresi**: Genelde 1-3 gün. Acil bir şeyse `@thorrangonak` mention'la.

---

## 🎯 Code style

TypeScript strict mode. Kuralları `CONVENTIONS.md` (root) ve `bundled-skills/turkce-docs/SKILL.md`'de detaylı:

- `any` yerine `unknown`
- Erken return pattern
- Fonksiyonlar tek sorumluluk (~40 satır max)
- `catch (e: unknown)` (typed error)
- `async/await` (callback yerine)
- Magic number yerine sabit (`UPPER_SNAKE_CASE`)
- Boolean: `is`, `has`, `can`, `should` öneki
- Dosyalar: `kebab-case.ts`
- Komut isimleri: Türkçe (`/güncelle`, `/kişilik`) + ASCII alias (`/guncelle`, `/kisilik`)

---

## 🇹🇷 Türkçe konvansiyonlar

- Hitap: **"sen"** (kanka'nın felsefesi: samimi)
- Komut: Türkçe karakterli **+** ASCII alias (Windows cmd'de Türkçe karakter sorunu yaşamayasın)
- Hata mesajı: Türkçe ve **eylem önerili** ("Dosya bulunamadı kanka. Yol doğru mu?")
- Yorum satırı: Türkçe OK, ama API kullanıcısı için de düşün — `/** Public API JSDoc */` İngilizce daha doğru olabilir

---

## 🚫 Davranış kuralları

Kanka topluluğunda **herkes saygılı** olmalı:

- ❌ Kişisel saldırı, küfür, ayrımcılık → **anında ban**
- ❌ Spam, alakasız self-promotion
- ❌ Tartışmayı "kazanmak" için kişiselleştirmek
- ✅ Yapıcı eleştiri
- ✅ Başka bir yaklaşımı önermek
- ✅ "Anlamadım, açıklar mısın?" demekten çekinmemek
- ✅ Senior'a soru sormaktan utanmamak, junior'a sabırlı olmak

İhlal görürsen: **maintainer'a DM** veya `report@kanka.dev` (henüz yok ama olacak).

---

## 🎉 Katkı yapanlar

Tüm katkı yapanlar README'de + Release notes'ta listelenir.

İlk PR'ın merge edildiğinde **kanka topluluğunun bir parçası olursun** 🤝

---

## 📞 İletişim

- **Tartışma**: [GitHub Discussions](https://github.com/thorrangonak/kanka/discussions)
- **Bug/Feature**: [Issues](https://github.com/thorrangonak/kanka/issues)
- **Sohbet/DM**: GitHub @thorrangonak

---

**Hadi başlayalım kanka!** 🚀
