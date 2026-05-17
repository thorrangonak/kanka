---
description: Kâşif bağlamı toplar, planlayıcı uygulama planı çıkarır (uygulama YOK)
---
delege tool'unu **chain** parametresiyle kullanarak şu workflow'u çalıştır:

1. Önce **kasif** agent'ını kullan: "$@" ile ilgili tüm kodu bul
2. Sonra **planlayici** agent'ını kullan: "$@" için önceki adımdan gelen bağlamı kullanarak uygulama planı oluştur ({previous} placeholder'ı kullan)

Bu adımları **zincir** olarak çalıştır, çıktıları {previous} ile devret. **Uygulama YAPMA** — sadece planı döndür.
