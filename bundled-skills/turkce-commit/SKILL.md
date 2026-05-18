---
name: turkce-commit
description: Türkçe-İngilizce hibrit Conventional Commit mesajları üretir. Türk geliştirme ekiplerinin yaygın commit pattern'i — type İngilizce, açıklama Türkçe.
---

# Türkçe Commit Mesajları

Türk geliştirme ekiplerinin standart pratiği: **Conventional Commits formatı + Türkçe açıklama**.

## Format

```
<type>: <kısa Türkçe açıklama>

[opsiyonel detay paragrafı]

[opsiyonel footer: Refs #123, Breaking-Change: ...]
```

## Type'lar (İngilizce kalır)

| Type | Ne zaman |
|------|----------|
| `feat` | Yeni özellik |
| `fix` | Bug fix |
| `docs` | Sadece dokümantasyon |
| `style` | Format/whitespace (kod davranışı değişmez) |
| `refactor` | Davranış değişmez ama kod yeniden düzenlenir |
| `perf` | Performans iyileştirme |
| `test` | Test ekleme/güncelleme |
| `chore` | Build, dep update, config |
| `ci` | CI/CD pipeline değişikliği |

## Yazım kuralları

- **Başlık 50 karakteri geçmesin**
- **Türkçe açıklama küçük harfle başlasın** (İngilizce konvansiyon)
- **Sonuna nokta koyma**
- **Emir kipi kullan**: "ekle", "düzelt", "kaldır" ("ekledim", "düzelttim" değil)
- Body 72 karakter wrap

## Örnekler

✅ İyi:
```
feat: kullanıcı kayıt formu eklendi
fix: login redirect döngüsü düzeltildi
refactor: auth servisi singleton'a çevrildi
docs: kurulum adımları README'ye eklendi
chore: typescript 5.9'a yükseltildi
perf: anasayfa query sayısı 12'den 3'e düşürüldü
```

❌ Kötü:
```
fix bug                              # tip yok, açıklama yok
FEAT: Yeni Özellik.                  # uppercase + nokta
düzelttim auth'u                     # type eksik, emir kipi değil
feat: çok büyük bir refactor yaptım  # emir kipi değil, çok uzun
```

## Detaylı body (opsiyonel)

İlk satır yeterli değilse boş satırdan sonra detay ekle:

```
refactor: auth servisi singleton'a çevrildi

Önceden her component kendi AuthService instance'ını yaratıyordu.
Bu durum token refresh sırasında race condition'a yol açıyordu.
Şimdi tek instance, global state yönetiyor.

Refs #142
```

## Breaking change

API kıran değişiklik için footer:

```
feat: API v2'ye geçildi

Endpoint'ler /api/v1/* yerine /api/v2/* altında.
Eski endpoint'ler 30 gün desteklenecek.

Breaking-Change: /api/v1/users → /api/v2/users
```

## Kullanım

Kullanıcı "commit mesajı yaz", "bunu nasıl commit edeyim", "git commit" gibi şeyler söylediğinde:

1. `git diff --cached` veya `git diff` çıktısını incele
2. Hangi type'a girdiğini tespit et
3. Yukarıdaki formata uygun mesaj üret
4. Gerekirse `git commit -m "..."` komutunu öner (ama otomatik çalıştırma — kullanıcı approve etsin)
