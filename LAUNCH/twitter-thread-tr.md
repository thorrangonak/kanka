# Twitter/X Thread — Türkçe

> Tek tweet'lik kısa versiyonu ve uzun thread versiyonu aşağıda.
> Yayınlamadan önce kanka.dev (veya alternatif) landing'i hazırlamak çok katkı sağlar.

---

## 🎯 Kısa versiyon (tek tweet)

```
kanka v0.3 çıktı 🇹🇷

Türkçe konuşan terminal kodlama asistanı.
Pi-coding-agent üzerine inşa edildi, 9 bundled subagent, 5 chain workflow,
35+ Türkçe slash komutu.

npm install -g @thorrangonak/kanka

github.com/thorrangonak/kanka
```

---

## 🧵 Uzun thread (8 tweet)

### 1/8
```
kanka çıktı 🇹🇷

Terminalden Türkçe konuşan bir AI kodlama asistanı.
"Kanka, şunu yapsana." diyorsun, o yapıyor.

npm install -g @thorrangonak/kanka

🧵👇
```

### 2/8
```
Neden yaptım?

Pi-coding-agent (Earendil Works'ün açık kaynak harness'ı) mükemmel
ama İngilizce. Bizim için terminal'de "/compact" yerine "/sıkıştır"
yazabilmek daha doğal. Sistem prompt'u Türkçe olunca asistan da
Türkçe konuşuyor — kişilik, jargon, her şey.
```

### 3/8
```
9 bundled subagent'la geliyor 👥

🔍 kasif       — kod keşif
📝 planlayici  — uygulama planı
⚙️ isci        — implementation
🔎 gozden-geciren — code review
🏛️ mimar       — sistem tasarımı
🐛 hata-avcisi  — root cause
🧪 test-yazari  — test üretimi
♻️ refactorcu   — davranış-koruyan refactor
📖 docs-yazari  — README, JSDoc, Mermaid
```

### 4/8
```
5 hazır workflow pipeline 🔗

/yap <görev>              kasif → planlayici → isci
/plan-yap <görev>         sadece plan (uygulama yok)
/yap-ve-incele <görev>    isci → gozden-geciren → isci
/debug <bug>              kasif → hata-avcisi
/refactor-incele <hedef>  kasif → refactorcu → gozden-geciren

Tek komutla chain pipeline.
```

### 5/8
```
35+ Türkçe slash komutu 📋

/sıkıştır → /compact
/çatalla → /fork
/giriş → /login
/ağaç → /tree
/düşünce yüksek → thinking high
...

ASCII versiyonları da var (/sikistir, /agac, /giris) — PowerShell'de
Türkçe karakter zor olursa.
```

### 6/8
```
Açık kaynak, MIT 📜

github.com/thorrangonak/kanka
npmjs.com/package/@thorrangonak/kanka

Pi'nin "minimal, hackable, kendi workflow'una uyarla" felsefesi
aynen geçerli. Skill, extension, theme — her şey eklenebilir.

⭐ Star atarsan motive olurum 😄
```

### 7/8
```
Kim için?

✓ Türkçe geliştirici (cli'ı kendi diliyle kullanmak isteyen)
✓ Claude/GPT/Gemini ile çalışıp terminal'de iş yapan
✓ "AI asistan ama abartmasın" diyenler
✓ Kendi subagent ekibi olsun isteyenler
✓ Türk dev community'sinden bir tool görmek isteyenler 🇹🇷

@earendil_works @badlogicgames teşekkürler pi için 🙏
```

### 8/8
```
Yol haritası:

🎯 v0.4 — Daha fazla bundled skill
🎯 v0.5 — Türkçe tema + güzel ASCII
🎯 v1.0 — TUI level entegrasyon (tüm slash alias gerçek)

Hedef: Türk dev'lerin günlük tool'u.

Bugün dene, geri bildirim ver:
github.com/thorrangonak/kanka/issues
```

---

## 📌 Reply zincirine eklenebilecek bonus tweet

```
İlginç teknik detay 🤓

Pi-coding-agent'ın subagent extension'ını forkladım ve "delege"
adıyla yeniden paketledim (pi-subagents global paketiyle çakışmasın
diye). Sistem prompt'una bundled agent listesi otomatik enjekte
ediyor — her turn'de tazelenir, agent ekleme/çıkarma anlık.

37.9 kB paket, 6 dependency. Pi v0.74.1 üzerine inşa.
```
