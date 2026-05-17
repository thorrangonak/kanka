# Launch Materyalleri

Bu klasör kanka'nın **lansman içeriklerini** barındırır. Repo'da kalır ama paket dağıtımına dahil değildir (`.npmignore` veya `files` listesi).

## İçerik

| Dosya | Hedef platform | Dil |
|-------|----------------|-----|
| `twitter-thread-tr.md` | Twitter/X | TR |
| `medium-tr.md` | Medium | TR |
| `dev-to-en.md` | dev.to | EN |
| `hn-show.md` | Hacker News | EN |
| `demo-script.md` | Video/GIF kaydı için senaryo | TR/EN |

## Lansman Sırası (önerilen)

### Faz 1: Hazırlık (1 gün)
1. ✅ Repo + npm paket yayında (DONE)
2. ⏳ Demo GIF veya 60-90 sn video kaydı (`demo-script.md`)
3. ⏳ README'ye demo embed (GitHub'da görünür olsun)
4. ⏳ İsteğe bağlı: `kanka.dev` veya `kanka.com.tr` landing page

### Faz 2: Yumuşak çıkış (1 gün)
5. **Twitter thread'i yayınla** (TR) — `twitter-thread-tr.md`
6. Birkaç saat sonra Medium yazısını yayınla → Twitter'da link paylaş
7. Türk dev community'lerine (Discord, Telegram, Reddit r/Turkey/programming) duyur

### Faz 3: Uluslararası (1-3 gün sonra)
8. dev.to yazısını yayınla (EN) — `dev-to-en.md`
9. dev.to'da hashtags: #ai #cli #typescript #opensource #devtools
10. dev.to yazısı yayınlandıktan birkaç saat sonra HN'a "Show HN" submit et — `hn-show.md`
11. HN best practice: en iyi zaman pazartesi-perşembe sabah 9-11 ET (TR saatiyle 17-19)

### Faz 4: Takip (sürekli)
12. Geri bildirimleri Issue olarak topla
13. Erken kullanıcıları (≤50) bizzat ilgilen — Discord/Twitter DM
14. v0.3.2/0.4.0 hızlı patch'lerle ivmeyi koru

## Hashtag stratejisi

### Twitter/X
- 🇹🇷 `#TürkçeKodlama` `#YazılımcılaraSelam`
- 🌍 `#AICoding` `#OpenSource` `#OpenTerminal`
- 🛠️ `#TypeScript` `#NodeJS` `#CLI`

### dev.to
- `#opensource` (büyük topluluk)
- `#ai` (trend)
- `#typescript`
- `#devtools`
- `#showdev`

## Reklam değil, hikaye

Lansman'ın **özü**: "Pi gibi minimal, hackable bir araç üzerine kendi marka tool'umu nasıl 2 saatte kurdum?" — bu **HN/dev.to** için altın değerinde. Pure tanıtım değil, "I learned this, here's the pattern" yazısı.

Twitter ve Medium'da daha romantik: "kendi dilimde konuşan asistan istedim, yaptım" hikayesi.

## Geri bildirim takibi

- Twitter mention'ları
- GitHub Issues
- dev.to comments
- HN comments (eğer Show HN front page'e çıkarsa)
- npm install istatistikleri ([npmtrends.com](https://npmtrends.com/@thorrangonak/kanka))

İlk hafta hedef:
- ⭐ 50+ GitHub star
- 📥 200+ npm install
- 🐛 5+ issue (gerçek kullanıcılar)
- 🍴 3+ fork (community ilgi göstergesi)

İkinci hafta:
- v0.4 ile yeni özellik
- İlk topluluk PR'ı
- En az 1 contributor (sen değil)
