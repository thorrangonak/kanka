# Kanka Demo Senaryosu

> Hedef: 60-90 saniyelik bir GIF/video kaydı.
> Araç önerisi: [asciinema](https://asciinema.org/) + [agg](https://github.com/asciinema/agg) (asciinema → GIF), veya basit ekran kaydı.
> Terminal: Genişlik ~120, yükseklik ~30 satır. Tema: koyu (terminalin default'u).

---

## Hazırlık (kayıt başlamadan)

```bash
# Temiz bir test dizini aç
mkdir -p ~/kanka-demo && cd ~/kanka-demo

# Bir örnek dosya hazırla (kanka göstereceğimiz iş için)
cat > selam.ts << 'EOF'
export function topla(a: number, b: number): number {
  return a + b;
}

export function ciftMi(n: number): boolean {
  return n % 2 === 0;
}
EOF

# Terminal'i temizle
clear
```

---

## Kayıt başlasın

### Sahne 1 — Banner ve karşılama (5 sn)

```bash
kanka
```

**Beklenen çıktı**: ASCII KANKA banner + "Selam kanka! Ne yapalım?" benzeri karşılama.

### Sahne 2 — /yardım komutuyla wow faktörü (8 sn)

```
/yardım
```

**Beklenen**: 5 başlık altında 30+ Türkçe komut listesi. Kullanıcı "vay be çok şey var" diyecek.

### Sahne 3 — /ekip ile subagent'ları göster (8 sn)

```
/ekip
```

**Beklenen**: 9 agent + 5 workflow listesi, renkli, organize.

### Sahne 4 — Asıl gösteri: chain workflow (40 sn)

```
/yap selam.ts dosyasındaki fonksiyonlar için Vitest testleri ekle. Happy path, edge case, error case.
```

**Bu en kritik kısım.** Beklenen:
1. `delege` tool çağrılır
2. **kasif** agent çalışır → ilerleme stream'i görünür
3. **planlayici** agent çalışır → plan output'u görünür
4. **isci** agent çalışır → dosya yazıyor, package.json ekliyor
5. Final özet: "23 test yazıldı, hepsi geçiyor"

Bu kısımda model konuşurken hızlandırılmış mod faydalı olabilir. asciinema kullanıyorsan idle time'ları otomatik kısaltır.

### Sahne 5 — Sonucu göster (8 sn)

```
/çık
```

```bash
$ ls tests/
selam.test.ts

$ npm test
✓ tests/selam.test.ts (23 tests)
Test Files  1 passed (1)
     Tests  23 passed (23)
```

### Sahne 6 — Outro (3 sn)

```bash
# Ekrana basit bir text
echo "kanka — github.com/thorrangonak/kanka"
echo "npm install -g @thorrangonak/kanka"
```

---

## Kayıt sonrası

### asciinema yolu

```bash
# Kaydet
asciinema rec kanka-demo.cast --idle-time-limit 2 --title "Kanka v0.3 Demo"

# Yukarıdaki sahneleri çalıştır

# Bitir: Ctrl+D veya 'exit'

# Önizleme
asciinema play kanka-demo.cast

# GIF'e çevir (agg ile)
agg kanka-demo.cast kanka-demo.gif --speed 1.5

# README'ye ekle
# ![Demo](./docs/kanka-demo.gif)
```

### Direct ekran kaydı yolu (Windows)

- **OBS Studio** — Pencere yakalama → terminal pencere → 60fps → MP4
- **ScreenToGif** — Daha basit, doğrudan GIF üretir
- **Xbox Game Bar** (Win+G) — hızlı kayıt için

Sonra:
- ffmpeg ile speed up: `ffmpeg -i input.mp4 -vf "setpts=0.7*PTS" output.mp4`
- gifski ile GIF: `gifski --fps 15 -W 800 -o demo.gif input.mp4`

---

## Yayınlanacak yerler

| Platform | Format | Notlar |
|----------|--------|--------|
| GitHub README | GIF (max 10MB) veya YouTube embed | docs/ klasörüne koy |
| Twitter | MP4 max 2:20 dakika | 16:9 oran iyi |
| Medium | Embed (YouTube veya Cloudinary) | GIF ağır olabilir |
| dev.to | GIF veya YouTube embed | GIF max 5MB iyi |
| HN | YouTube linki | YT embed iyi çalışır |

---

## Eklenecek olası "wow" anları

Eğer 90 saniye yetiyorsa, şunlardan birini de ekle:

### Bonus 1: /düşünce ile model seviyesi değiştir

```
/düşünce yüksek
```

→ Notify: "Düşünce seviyesi: yüksek (high) ✓"

### Bonus 2: /bilgi ile durum paneli

```
/bilgi
```

→ Versiyon, model, thinking, tool sayısı, agent sayısı, context %

### Bonus 3: Hızlı bir Türkçe sorgu

```
/debug login fonksiyonu çalışıyor ama session'ı kaydetmiyor
```

→ kasif → hata-avcısı chain'i devreye girer.

---

## Sonuç

Toplam idealde: **60-90 saniyelik MP4 + 1MB altı GIF preview**

Bu video/gif olmadan launch yapma — "show, don't tell" prensibi AI tool'larında 10x önemli.
