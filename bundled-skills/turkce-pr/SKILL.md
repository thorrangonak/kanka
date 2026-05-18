---
name: turkce-pr
description: Türkçe PR (Pull Request) / MR (Merge Request) açma şablonu. Başlık, açıklama, checklist, screenshot bölümleri Türk dev kültürüne uygun. GitHub, GitLab, Bitbucket için aynı pattern.
---

# Türkçe PR/MR Şablonu

Türk geliştirme ekiplerinde **Conventional Commits + Türkçe açıklama** yaygın. PR mesajları da bu paterni takip eder.

## 📝 Başlık formatı

```
<type>: <kısa Türkçe açıklama> [(#issue)]
```

### Type'lar (İngilizce kalır)
- `feat` — Yeni özellik
- `fix` — Bug fix
- `docs` — Sadece dokümantasyon
- `style` — Format (kod davranışı değişmez)
- `refactor` — Davranış aynı, yapı değişti
- `perf` — Performans iyileştirme
- `test` — Test ekleme/güncelleme
- `chore` — Build, dependency, config
- `ci` — CI/CD pipeline
- `revert` — Önceki commit geri alındı

### Örnekler
- ✅ `feat: kullanıcı kayıt formu (#142)`
- ✅ `fix: login redirect döngüsü düzeltildi (#187)`
- ✅ `refactor: auth service singleton'a çevrildi`
- ❌ `Fixed bug` (type yok, İngilizce, belirsiz)
- ❌ `FEAT: Yeni feature ekledim!!!` (uppercase, ünlem, "ekledim" geçmiş zaman)

## 📋 Açıklama şablonu

```markdown
## 📌 Özet

<!-- 1-2 cümle: bu PR ne yapıyor? -->

## 🎯 Neden?

<!-- Bu değişikliğin sebebi, hangi problemi çözüyor -->

Refs: #142
Closes: #156

## 🔧 Değişiklikler

- [ ] `src/auth/login.ts` — Refresh token logic eklendi
- [ ] `src/middleware/auth.ts` — Token expiry kontrolü düzeltildi
- [ ] `tests/auth.test.ts` — 3 yeni test case
- [ ] `docs/auth.md` — Refresh akışı dokümante edildi

## 🧪 Test

### Manuel
- [ ] Login → logout → login (token geçerli)
- [ ] Token expire olunca otomatik refresh
- [ ] Refresh başarısızsa logout'a yönlendiriliyor

### Otomatik
- [ ] `npm test` ✓ tüm test'ler geçiyor
- [ ] `npm run lint` ✓ lint temiz
- [ ] `npm run typecheck` ✓ TS hatası yok

## 📸 Ekran görüntüleri / Demo

<!-- UI değişikliği varsa before/after, video/GIF -->

| Önceden | Şimdi |
|---------|-------|
| ![before](./docs/before.png) | ![after](./docs/after.png) |

## ⚠️ Breaking Change?

- [ ] Hayır
- [x] Evet — açıklama:

  Eski endpoint `/api/v1/auth/login` deprecated, yerine `/api/v2/auth/login` kullanılacak. v1 30 gün desteklenecek.

## 🔄 Migration

<!-- Breaking change varsa nasıl geçiş yapılacağı -->

```bash
# Eski kullanım:
curl POST /api/v1/auth/login -d '...'

# Yeni:
curl POST /api/v2/auth/login -d '...' -H 'X-Client-Version: 2'
```

## ✅ Kontrol listesi

- [ ] Kod conventions'a uygun (TypeScript strict, camelCase, vb.)
- [ ] Yeni public API'lara JSDoc eklendi
- [ ] Test coverage düşmedi
- [ ] Dokümantasyon güncellendi (README, API docs)
- [ ] CHANGELOG güncellendi
- [ ] Database migration script test edildi (rollback dahil)
- [ ] Security review (auth/payment akışı varsa)
- [ ] KVKK uyumluluk (PII handling varsa)
- [ ] i18n: Türkçe metinler eklendi
- [ ] Mobile responsive (frontend değişikliği varsa)

## 👀 Reviewer'a not

<!-- Reviewer'ın dikkat etmesi gereken yerler -->

Özellikle `src/auth/refresh.ts:45-78` kısmındaki race condition handling'ine bakın — alternatif yaklaşımlara açığım.
```

## 🎯 PR mesajı yazarken kurallar

### ✅ Yap
- Başlık 50 karakteri geçmesin
- Açıklama 72 karakter wrap
- "Neden?" sorusunu **mutlaka** cevapla
- Test edildiğini kanıtla (screenshot, log, command output)
- Reviewer'a yönlendirme yap (zor kısımlar nerede?)
- Breaking change varsa **çok net** belirt

### ❌ Yapma
- "Küçük fix" gibi belirsiz başlık
- "Sonra dokümante ederim" — bugün yap
- "Test'i nasıl olsa CI yapıyor" — test edilmeden PR açma
- Force push'lu PR (review history kaybolur, gerekirse `--force-with-lease` ve reviewer'a bildir)
- "WIP" başlığıyla review'a göndermek — draft mode kullan

## 🇹🇷 Türk takım kültürü ipuçları

- **"Hocam", "abi"** gibi hitaplar PR'da OK ama **profesyonel ton** koru
- Code review'da **kişiselleştirme**: "kodun saçma" → "burada şu yaklaşım daha okunabilir olur mu?"
- Senior'lardan feedback geldiğinde **defansif olma**: "haklısın, düzeltiyorum" sağlıklı
- Junior'a code review yaparken **mentor tonu**: "şunu öğrenmek isteyebilirsin..."
- Türkçe terim seçimleri **takıma sor** ("değişken" mi "variable" mı tutarlı olsun)

## 📦 Issue/PR template otomasyonu

Repo'na `.github/pull_request_template.md` ekle, GitHub otomatik dolduracak:

```bash
mkdir -p .github
cat > .github/pull_request_template.md <<'EOF'
## 📌 Özet

## 🎯 Neden?

Refs: #

## 🔧 Değişiklikler

- [ ]

## 🧪 Test

- [ ] Manuel test edildi
- [ ] `npm test` geçti

## ⚠️ Breaking Change?

- [ ] Hayır
- [ ] Evet — açıklama:

## 👀 Reviewer'a not

EOF
```

## Kullanım

Kullanıcı "PR aç", "merge request hazırla", "commit + PR" gibi şeyler söylediğinde:

1. `git status` + `git diff` ile değişiklikleri kontrol et
2. Conventional Commits formatına uygun **başlık** öner
3. Yukarıdaki şablonu doldur
4. Eksik bilgi varsa **sor** ("hangi issue'yu kapatıyor?", "breaking change var mı?")
5. `gh pr create --title "..." --body "..."` veya `git push` + GitHub link öner
