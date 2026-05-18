---
name: turkce-docs
description: Türkçe teknik dokümantasyon üretir. README, API docs, JSDoc — Türk geliştirici kültürüne uygun ton ve terminoloji.
---

# Türkçe Dokümantasyon Yazımı

Türk geliştirici ekosistemine uygun teknik yazım kılavuzu.

## Genel ilkeler

- **Teknik terim İngilizce kalır**: callback, hook, prop, state, build, deploy, runtime, async, promise
- **Türkçe terim varsa o tercih edilir**: "değişken" (variable), "fonksiyon" (function), "sınıf" (class), "dosya" (file), "döngü" (loop)
- **Karışık değil tutarlı**: Bir doc içinde "fonksiyon" diyorsan, sonra "function" deme.
- **Sen-siz değil**: "Yapabilirsiniz" yerine "yapabilirsin" (geliştirici-developer arası samimi ton). Kurumsal doc'ta sen-siz farklı.

## README yapısı

```markdown
# <Proje Adı>

> Tek cümlelik açıklama. "Ne işe yarar?"

## Özellikler

- Madde 1
- Madde 2

## Kurulum

\`\`\`bash
npm install <paket>
\`\`\`

## Hızlı başlangıç

\`\`\`ts
import { foo } from "<paket>";
foo();
\`\`\`

## Dokümantasyon

[Tam doküman →](docs/index.md)

## Katkı

[CONTRIBUTING.md](CONTRIBUTING.md)

## Lisans

[MIT](LICENSE)
```

## JSDoc Türkçe

İç dokümantasyon (kod yorumu) için:

```ts
/**
 * Kullanıcının email adresini doğrular.
 *
 * RFC 5322'nin basitleştirilmiş hâlini uygular. Tam doğrulama için
 * MX kayıt kontrolü gerekir (bu fonksiyon kapsamı dışı).
 *
 * @param email - Doğrulanacak email adresi
 * @returns Format uygunsa `true`, değilse `false`
 *
 * @example
 * isValidEmail("ahmet@example.com") // true
 * isValidEmail("ahmet@")            // false
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

Public API için Türkçe yorum kabul edilir; **açık kaynak proje** İngilizce olmalı.

## Tablo tercihleri

| ❌ Kaçın | ✅ Tercih |
|---------|----------|
| "Buton'a tıklayınız" | "Butona tıkla" |
| "Aşağıdaki kodu çalıştırınız" | "Şu kodu çalıştır:" |
| "Lütfen dikkat ediniz" | "Dikkat:" |
| "asenkron fonksiyon" | "async fonksiyon" (yaygın) |
| "geri çağırma" | "callback" |
| "olay" / "event" (karışık) | Tutarlı tek seçim |

## Markdown disiplini

- Başlık seviyeleri atlanmaz (H2'den sonra H4 değil, H3)
- Kod bloklarında dil belirt: ` ```ts `, ` ```bash `
- Liste içinde paragraf girintisi 4 boşluk
- Link metni açıklayıcı olsun: ✅ "[kurulum adımları](#kurulum)" / ❌ "[burada](...)"

## Kullanım

Kullanıcı "README yaz", "doküman ekle", "JSDoc ekle", "şuna açıklama yaz" derse:

1. Mevcut dokümantasyon tarzına bak (proje zaten varsa)
2. Yukarıdaki kurallara uy
3. Public API için: parametreler, dönüş değeri, en az 1 örnek
4. README için: kurulum + hızlı başlangıç + link mutlaka olsun
