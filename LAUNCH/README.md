# 📢 Launch Materyalleri

Kanka v0.5.0 launch için hazırlanmış post taslakları.

## 📂 Dosyalar

| Dosya | Platform | Dil | Uzunluk |
|-------|----------|-----|---------|
| [`devto-tr.md`](devto-tr.md) | DEV.to | Türkçe | ~12 KB |
| [`devto-en.md`](devto-en.md) | DEV.to | İngilizce | ~14 KB |
| [`twitter-thread.md`](twitter-thread.md) | Twitter/X | TR + EN | ~4 KB |
| [`reddit-hn.md`](reddit-hn.md) | Reddit + HN + LinkedIn | TR + EN | ~10 KB |

## 🗓️ Önerilen launch takvimi

```
Gün 1 (Pazartesi/Salı sabahı): r/Turkey + r/yazilim post
Gün 2: DEV.to TR + EN simultaneous publish (canonical_url ile)
Gün 3: r/programming + HackerNews "Show HN"
Gün 4: Twitter/X thread (Salı/Çarşamba 14:00 TR)
Gün 5: LinkedIn post (sabah 09:00) + kişisel network DM'leri
```

## 📊 Tracking metric'leri

Launch sonrası 7 gün takip et:

- **npm**: Daily downloads (npmjs.com/package/@thorrangonak/kanka)
- **GitHub**: Stars, fork, issue, PR
- **Reddit**: Upvotes, yorum sayısı, controversial flag
- **HackerNews**: Score (genelde 3-5 saat sonra zirve), yorum sayısı
- **DEV.to**: Views, reactions, follows, comments
- **Twitter**: Impressions, retweets, replies
- **LinkedIn**: Views, reactions, comments

## 🎯 Hedefler

**Hafta 1**:
- npm install: 100+
- GitHub stars: 50+
- HN frontpage 1 saat (top 30)
- 5+ issue/discussion

**Ay 1**:
- npm install: 1000+
- GitHub stars: 200+
- 3+ PR merge (community katkı)
- 1+ persona/skill PR (community)

## ⚠️ Ön kontroller (launch öncesi yap)

- [ ] README hero SVG GitHub'da animasyon olarak görünüyor mu?
- [ ] `kanka --versiyon` → v0.5.0
- [ ] `npm install -g @thorrangonak/kanka` temiz çalışıyor mu?
- [ ] `/güncelle` test edildi mi?
- [ ] CONTRIBUTING.md / ROADMAP.md linkleri çalışıyor mu?
- [ ] 3 "good first issue" açık ve etiketli mi?
- [ ] GitHub Discussions açık mı?
- [ ] Demo screenshot/GIF hazır mı?
- [ ] Anthropic OAuth flow lokal test edildi mi?

## 💬 Yanıt şablonları

**"Pi'den farkı ne?"**
> Pi-coding-agent harika bir SDK ama İngilizce-first. Kanka onun üstüne Türkçe brand, 7 hazır persona, KVKK skill, Windows Terminal entegrasyonu ve domain-spesifik extension'lar ekliyor. Pi'ye 100% credit, kanka onun "Türkçe paketi".

**"Why do we need a Turkish-specific agent?"**
> Localization isn't just translation. Persona tone changes output (abi → 50 lines, hoca → 200 lines). KVKK compliance has Turkey-specific rules that GDPR doesn't (different breach notification timeline). Windows Terminal is heavy in Turkish enterprise. These aren't gaps you can plug with a translation layer.

**"Bu open source mu?"**
> Evet, MIT lisanslı. github.com/thorrangonak/kanka. Persona ve skill katkıları için sadece markdown bilmek yeterli — TypeScript şart değil.

**"Bedava mı?"**
> Paket ücretsiz, MIT lisans. LLM kullanımı için API key/abonelik gerek. Claude Pro/Max OAuth varsa marginal cost = $0 (abonelik kapsamında).

**"Windows-only mu?"**
> Hayır, macOS/Linux'ta da çalışır. Sadece Windows Terminal entegrasyonu öne çıkıyor çünkü diğer agent'lar bu konuda zayıf. iTerm2 ve WezTerm de OSC desteklediği için onlar da çalışır.

**"How does it compare to Aider/Cursor/Claude Code?"**
> Different niches:
> - **Cursor**: GUI/IDE-first, freemium SaaS, English-only
> - **Claude Code**: Anthropic-only, English-only, terminal-first
> - **Aider**: Git-first, English-only, terminal-first
> - **kanka**: Turkish-first (personas, KVKK, Türkçe komutlar), multi-LLM, terminal-first, MIT
>
> Different goals. Kanka isn't trying to replace them, it's filling a localization gap.

## 🚀 Hadi başlayalım!

Hazır olduğunda, ilk r/Turkey post'undan başla. Sonuçları topla, ikinci güne karar ver.

İyi launch'lar kanka! 🎉
