# kanka v0.4.0 — Test Kılavuzu

## 🚀 Hızlı başlangıç (npm link)

```bash
cd C:\Users\usuario\projects\kanka
npm run build
npm link
kanka --versiyon
# → kanka v0.4.0  (lokal build artık global "kanka" komutu)
```

## ✅ Test checklist

### 1. Temel akış
```bash
kanka --versiyon              # → kanka v0.4.0
kanka --yardım                # → yeni KİŞİLİK, GÜNLÜK, GÜNCELLEME bölümleri görünüyor mu?
```

### 2. İnteraktif moda gir
```bash
kanka
```

### 3. Persona testi 🎭
```
/kisilik              → 4 kişilik listesi, aktif: kanka
/kisilik hoca         → "Aktif kişilik: 🧑‍🏫 hoca ✓"
sana fibonacci yazar mısın
                      → Açıklamalı, "neden böyle" diyen tonda cevap
/kisilik abi          → "Aktif kişilik: 🧔 abi ✓"
aynı şeyi yap
                      → Kısa, direkt, açıklamasız
/kisilik patron       → "Aktif kişilik: 💼 patron ✓"
auth sistemi nasıl yapalım
                      → MVP odaklı, "şu yeter, sonra refactor" tonunda
/kisilik kanka        → Varsayılana dön
/kisilikler           → Detaylı katalog, dosya yolları
```

**Beklenen**: ~/.kanka/aktif-kisilik dosyası seçili personanın adını içerir.

```bash
type C:\Users\usuario\.kanka\aktif-kisilik
# → patron (veya seçtiğin)
```

### 4. Günlük testi 📓
```
/gunluk                            → Yardım metni
/gunluk yaz ilk test kaydı #demo   → "✓ Günlüğe yazdım [#demo]"
/gunluk yaz auth bug fixed #fix #auth
/gunluk bugun                      → Bugün eklediğin 2 kayıt
/gunluk son 5                      → Son 5 kayıt
/gunluk ara auth                   → "auth" geçen kayıt
/gunluk istatistik                 → Toplam, ilk, son, etiketler
```

**Beklenen**: Dosya oluştu mu?
```bash
type C:\Users\usuario\.kanka\gunlukler\kanka.jsonl
# → Her satır bir JSON, ts/proje/metin/etiketler içeriyor
```

### 5. Windows Terminal entegrasyonu 🔔

**Önemli**: Bu testi **Windows Terminal**, **WezTerm** veya **iTerm2**'de yap. Cmd.exe veya eski conhost'ta OSC desteği eksik olabilir.

```
/tab-title kanka · test           → Tab title değişti mi? (terminal sekmesinin yazısına bak)
/bildir test bildirimi             → Sağ alt köşede Windows toast bildirimi çıktı mı?
```

**Otomatik test**: kanka'ya uzun süren bir şey yaptır (30s+):
```
ls -la c:\windows\ ve sonra her dosyanın izinlerini tek tek yaz
```
Tool 30 saniyeden uzun sürerse bittiğinde **otomatik bildirim** gelmeli.

**Tab title canlı değişimi**:
- Boştayken: `kanka · hazır`
- Düşünürken: `kanka · düşünüyor…`
- Bash çalışırken: `kanka · komut çalıştırıyor`
- Read sırasında: `kanka · dosya okuyor`

### 6. Güncelleme sistemi 🔄

**⚠️ DİKKAT**: `/güncelle` veya `kanka update` çalıştırırsan **npm link'in bozulur**. Onun yerine sahte cache ile bildirim akışını test edelim:

#### 6a. Pasif uyarı (header)
Sahte cache yaz:
```bash
mkdir -p C:\Users\usuario\.kanka
echo {"ts":"2026-05-18T20:00:00Z","mevcut":"0.4.0","latest":"99.9.0","guncelMi":false} > C:\Users\usuario\.kanka\son-versiyon-kontrol
```

Kanka'yı tekrar başlat (önce /çık, sonra `kanka`):
- Header'da kırmızı/sarı şu satırı görmelisin:
  `📦 Yeni sürüm var: 0.4.0 → 99.9.0  ·  Güncellemek için: /güncelle`

Temizle:
```bash
del C:\Users\usuario\.kanka\son-versiyon-kontrol
```

#### 6b. /versiyon-kontrol (güvenli, install yapmaz)
```
/versiyon-kontrol
# → "✓ En son sürümdesin (0.4.0)." (npm'deki 0.3.3'ten yeni)
# VEYA "📦 Yeni sürüm var..." (npm'de 0.4.0 yayınlandıysa)
```

#### 6c. CLI subcommand (güvenli check)
Yeni terminal aç:
```bash
kanka update --check
# → npm registry kontrol eder, install yapmaz
# Beklenen: "✓ Zaten güncelsin kanka!" çünkü lokal v0.4.0, npm'deki v0.3.3
# (Aslında ters durum: lokal NPM'den ileride, "güncelsin" der)
```

#### 6d. /güncelle (npm link'i bozar — son aşamada test et)
```
/güncelle
# → Onay sorar
# → İptal edersen npm link bozulmaz
# → Onaylarsan: "npm install -g @thorrangonak/kanka@0.3.3" çalışır
#   Ve npm link'in bozulur, global'e v0.3.3 (npm'deki son) gelir
```

### 7. Bundled skill'ler 🇹🇷
```
/skill:turkce-commit              → Türkçe Conventional Commit kılavuzu agent'a yüklenir
sana bu projedeki son değişiklik için commit mesajı yazsana
                                   → "feat: ...", "fix: ..." tarzı uyumlu öneri

/skill:turkce-docs                → Türkçe doc kılavuzu
yeni eklediğim fonksiyona JSDoc yaz
                                   → Türkçe JSDoc, kurallarımıza uygun
```

### 8. /bilgi ve /ekip
```
/bilgi                            → Versiyon 0.4.0 görünmeli, aktif persona, model, tool count
/ekip                             → 9 subagent listesi
/araçlar                          → Tool listesi
/düşünce                          → Thinking level (varsayılan: off)
```

## 🧹 Test sonrası temizlik

```bash
# npm link'i kaldır, gerçek versiyona dön
cd C:\Users\usuario\projects\kanka
npm unlink -g @thorrangonak/kanka

# Gerçek npm versiyonunu geri yükle
npm install -g @thorrangonak/kanka@latest

kanka --versiyon
# → v0.3.3 (npm'deki son)

# Test artifact'lerini sil (opsiyonel)
del C:\Users\usuario\.kanka\aktif-kisilik
del C:\Users\usuario\.kanka\son-versiyon-kontrol
rmdir /s /q C:\Users\usuario\.kanka\gunlukler
```

## 🐛 Sorun çıkarsa

| Belirti | Sebep | Çözüm |
|---------|-------|-------|
| `kanka` komutu bulunamadı | `npm link` yapılmadı | `cd projects\kanka && npm link` |
| Yeni komut görünmüyor | Build edilmedi | `npm run build` |
| Header değişmemiş | Eski versiyon cache | `kanka --versiyon` ile doğrula |
| Tab title değişmiyor | Terminal OSC desteklemiyor | Windows Terminal kullan |
| Bildirim gelmiyor | OSC 9 desteği yok | Windows Terminal ayarlarında "notifications" açık mı? |
| `/güncelle` "permission" hatası | Global npm dizinine yetki yok | PowerShell'i yönetici aç veya `nvm` kullan |

## 📊 Test raporu şablonu

Test ederken aşağıdaki tabloyu doldurabilirsin:

```
[  ] kanka --versiyon → v0.4.0
[  ] /kisilik (varsayılan: kanka)
[  ] /kisilik hoca (cevap tonu değişti)
[  ] /kisilik abi (cevap tonu değişti)
[  ] /kisilik patron (cevap tonu değişti)
[  ] /gunluk yaz (dosya oluştu)
[  ] /gunluk bugun (listeleme)
[  ] /gunluk ara (arama)
[  ] /tab-title (terminal sekmesi yazısı değişti)
[  ] /bildir (toast bildirimi)
[  ] Tab title canlı değişim (düşünüyor/komut/hazır)
[  ] Header'da güncelleme bildirimi (sahte cache ile)
[  ] /versiyon-kontrol
[  ] kanka update --check
[  ] /skill:turkce-commit
[  ] /bilgi (v0.4.0 görünüyor)
```
