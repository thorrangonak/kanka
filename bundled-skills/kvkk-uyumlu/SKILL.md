---
name: kvkk-uyumlu
description: Türkiye KVKK (6698 sayılı kanun) uyumlu kod yazımı. PII handling, log temizleme, data retention, açık rıza, veri silme talebine yanıt. Türk startup'ları ve kurumsal projeler için zorunlu.
---

# KVKK Uyumlu Kod Yazımı

**KVKK** (Kişisel Verilerin Korunması Kanunu, 6698) — Türkiye'de 2016'dan beri yürürlükte. GDPR'a benzer ama **bazı farklı** kuralları var. Yazılım geliştirirken sürekli akılda tutman gereken konular.

## 🔑 Anahtar tanımlar

- **Kişisel veri**: Kimliği belirli veya belirlenebilir gerçek kişiye ait her türlü bilgi. (Ad, TC kimlik, IP, çerez ID, kullanıcı davranışı vb.)
- **Özel nitelikli kişisel veri**: Sağlık, cinsel hayat, din, ırk, siyasi görüş, biometrik veri. Daha sıkı koşullara tabi.
- **Veri sorumlusu**: Kişisel verinin işlenmesini belirleyen kişi/kurum (sen / şirketin).
- **Veri işleyen**: Veriyi sorumlu adına işleyen taraf (örn. cloud provider).
- **Açık rıza**: Belirli konuda, bilgilendirilerek, özgür iradeyle verilen onay.
- **Anonimleştirme**: Kişiye bağlanamayacak hale getirme (geri dönüşümsüz).
- **Pseudonymization (takma adlama)**: ID'yi başka bir ID ile değiştirme (geri dönüşümlü, KVKK kapsamında hâlâ kişisel veri).

## ✅ Yazılımda yapılması gerekenler

### 1. Aydınlatma metni (privacy policy)
- Kullanıcı kayıt formunda **link** olmalı
- Hangi veri toplanıyor, neden, kimle paylaşılıyor, ne kadar süre saklanıyor — **açıkça yazılı**
- Kullanıcı **kayıt öncesi** okuyabilmeli (post-hoc geçersiz)

```html
<!-- ✅ Doğru -->
<label>
  <input type="checkbox" required>
  <a href="/aydinlatma-metni" target="_blank">Aydınlatma metnini</a> okudum, onaylıyorum.
</label>

<!-- ❌ Yanlış -->
<small>Kayıt olarak şartları kabul etmiş sayılırsınız.</small>
```

### 2. Açık rıza alma — granular checkbox

Her veri işleme amacı **ayrı checkbox** olmalı:

```tsx
// ✅ Doğru
<form>
  <Checkbox name="consent_marketing">
    E-posta ile pazarlama mesajları almak istiyorum (opsiyonel)
  </Checkbox>
  <Checkbox name="consent_analytics">
    Site kullanım istatistiklerimin analizinde kullanılmasına izin veriyorum (opsiyonel)
  </Checkbox>
  <Checkbox name="consent_terms" required>
    Kullanım koşullarını ve Aydınlatma Metnini okudum, onaylıyorum (zorunlu)
  </Checkbox>
</form>

// ❌ Yanlış: tek "kabul ediyorum" checkbox
<Checkbox required>Tüm şartları kabul ediyorum</Checkbox>
```

### 3. PII (Kişisel veri) maskeleme — log'da

Production log'larında PII **asla** olmamalı. Logger katmanında otomatik mask:

```ts
// ✅ utils/logger.ts
const PII_PATTERNS = [
  /\b\d{11}\b/g,                              // TC Kimlik No (11 hane)
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,  // Email
  /\b(?:\+90|0)?\s*5\d{2}\s*\d{3}\s*\d{2}\s*\d{2}\b/g,  // Türk cep no
  /\bTR\d{2}\s*\d{4}\s*\d{4}\s*\d{4}\s*\d{4}\s*\d{4}\s*\d{2}\b/gi,  // IBAN
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,  // Kredi kartı
];

export function maskPII(msg: string): string {
  let masked = msg;
  for (const re of PII_PATTERNS) {
    masked = masked.replace(re, (m) => "*".repeat(m.length));
  }
  return masked;
}

// Kullanım
log.info(maskPII(`User ${user.email} logged in from ${user.tc}`));
// → "User ***** logged in from ***********"
```

### 4. Veri saklama süresi (retention)

KVKK Madde 7: "İşlenmesini gerektiren sebeplerin ortadan kalkması halinde silinir."

```ts
// ✅ Cron job ile eski veriyi sil
// scheduler/cleanup.ts
async function cleanupExpiredData() {
  // Marketing rızası olmayan kullanıcının pazarlama datasını sil (2 yıl)
  await db.marketingEvents.deleteMany({
    where: {
      createdAt: { lt: subYears(new Date(), 2) },
      user: { consents: { none: { type: "marketing" } } },
    },
  });

  // Inactive kullanıcı (3 yıl giriş yapmamış) → anonim'leştir
  await db.users.updateMany({
    where: { lastLoginAt: { lt: subYears(new Date(), 3) } },
    data: {
      email: null,
      tc: null,
      phone: null,
      anonimized: true,
      anonimizedAt: new Date(),
    },
  });
}
```

### 5. Veri silme talebi — KVKK Madde 11

Kullanıcı isteğine 30 gün içinde cevap zorunlu. **Soft delete yetmez**, gerçek silme:

```ts
// ✅ API endpoint: DELETE /api/user/me
async function deleteUserAccount(userId: string) {
  // 1) Yasal saklama zorunluluğu varsa kontrol et (örn. fatura → 10 yıl)
  const hasLegalHold = await checkLegalHold(userId);

  if (hasLegalHold) {
    // Anonimleştir ama veri kayda kalır
    await db.users.update({
      where: { id: userId },
      data: {
        email: null, tc: null, phone: null, name: "Silindi",
        anonimized: true, anonimizedAt: new Date(),
      },
    });
    await db.legalDocuments.updateMany({
      where: { userId },
      data: { userId: null, originalUserAnonimized: true },
    });
  } else {
    // Tamamen sil
    await db.events.deleteMany({ where: { userId } });
    await db.sessions.deleteMany({ where: { userId } });
    await db.users.delete({ where: { id: userId } });
  }

  // 2) 3rd party'lere de bildir (Mailchimp, Segment, Mixpanel...)
  await deleteFromMailchimp(userId);
  await deleteFromSegment(userId);

  // 3) Backup'larda da silme planı (genelde 30 gün sonra eski backup otomatik silinir)
  log.info(`User ${userId} silindi. Audit log ID: ${auditId}`);
}
```

### 6. Veri taşıma hakkı (Madde 11/g)

Kullanıcı kendi datasını **makineye okunabilir** formatta isteyebilir:

```ts
// ✅ API endpoint: GET /api/user/me/export
async function exportUserData(userId: string) {
  const data = {
    profile: await db.users.findUnique({ where: { id: userId } }),
    orders: await db.orders.findMany({ where: { userId } }),
    addresses: await db.addresses.findMany({ where: { userId } }),
    consents: await db.consents.findMany({ where: { userId } }),
    activityLog: await db.events.findMany({
      where: { userId },
      take: 1000,
    }),
  };

  return {
    format: "json",
    exportedAt: new Date().toISOString(),
    data,
  };
}
```

### 7. Yurtdışı veri transferi

**KVKK Madde 9**: Yeterli korumaya sahip ülkelere transfer için **KVKK izni** veya **bağlayıcı kurumsal taahhüt** gerek.

```ts
// ⚠️ Bunu kullanıyorsan KVKK onayı gerekli:
import { Resend } from "resend";        // USA-based
import { Mixpanel } from "mixpanel";   // USA-based
import OpenAI from "openai";           // USA-based

// ✅ Türkiye'de bulunan alternatifler:
//   - Postmark Türkiye / İletimerkezi (mail)
//   - VeriPark Analytics (analytics)
//   - Trendyol-LLM (LLM, native TR)
```

Yurtdışı SaaS kullanıyorsan **aydınlatma metninde belirt**: "Verileriniz X firması (ABD) ile paylaşılmaktadır."

## ❌ Sıkça yapılan KVKK hataları

| Hata | Düzeltme |
|------|----------|
| Kullanıcı silme talebine "soft delete" yetmez | Gerçek silme veya anonimleştirme |
| Log'larda TC, email, telefon var | PII masking middleware |
| 3rd party'ler (Segment, Mixpanel) aydınlatma metninde yok | Hepsi listelenmiş olmalı |
| Single "Kabul ediyorum" checkbox | Her amaç için ayrı |
| Backup'lar 5+ yıl saklanıyor | Retention policy + auto-delete |
| Sosyal login (Google, Facebook) açıklanmıyor | Hangi veri Google'dan alınıyor belirt |
| Geliştirme veritabanı production data kullanıyor | Synthetic data veya anonim subset |
| `console.log(user)` production'da | `maskPII()` mecburi |

## 📌 Hızlı checklist

```markdown
- [ ] Aydınlatma metni var ve link'i her veri alma formunda görünür
- [ ] Açık rıza her amaç için ayrı checkbox (granular consent)
- [ ] PII otomatik masking logger katmanında
- [ ] Veri retention süresi tanımlı, otomatik cleanup cron job var
- [ ] DELETE /api/user/me endpoint'i gerçek silme yapıyor
- [ ] GET /api/user/me/export ile veri taşıma destekleniyor
- [ ] Yurtdışı SaaS'lar aydınlatma metninde listelendi
- [ ] Backup retention politikası dokümante
- [ ] PII production'da log'lara basılmıyor (audit)
- [ ] Sosyal login provider'lardan alınan veriler dokümante
- [ ] Cookie consent banner (analytics çerezleri opt-in)
- [ ] Şifreler bcrypt/argon2 hash'leniyor (md5/sha1 değil)
- [ ] HTTPS zorunlu (HTTP redirect'i var)
- [ ] Rate limiting auth endpoint'lerinde
```

## 🆘 İhlal durumunda

KVKK Madde 12: **72 saat içinde** KVKK'ya bildirim zorunlu. Plan:

1. Sızıntıyı tespit et, **kapsamı belirle** (kaç kullanıcı?)
2. **Hemen** sızdıran açığı kapat
3. **72 saat**: KVKK'ya VERBIS üzerinden bildirim
4. **Etkilenen kullanıcılara**: e-posta + uygulama bildirimi
5. Audit log hazırla, hukuk danışmanına git

## 📚 Kaynak

- [KVKK Resmi Sitesi](https://www.kvkk.gov.tr/)
- 6698 sayılı kanun: [mevzuat.gov.tr](https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6698.pdf)
- KVKK Kararları arşivi: [kvkk.gov.tr/kararlar](https://www.kvkk.gov.tr/Icerik/2030/Karar-Ozetleri)

## Kullanım

Kullanıcı "KVKK uyumlu yap", "PII maskele", "veri silme endpoint'i", "kullanıcı export" gibi şeyler söylediğinde:

1. Yukarıdaki checklist'e bak
2. İlgili pattern'i uygula
3. **Yurtdışı 3rd party var mı?** sor
4. Yasal saklama zorunluluğu (fatura, sözleşme) var mı kontrol et
5. Hukuk danışmanı önerisi: "Bu pattern'i KVKK uzmanına da göstermenizi öneririm — kanun yorumu değişebilir."
