---
description: Tam uygulama akışı — kâşif keşfeder, planlayıcı plan yapar, işçi uygular
---
delege tool'unu **chain** parametresiyle kullanarak şu workflow'u çalıştır:

1. Önce **kasif** agent'ını kullan: "$@" ile ilgili tüm kodu bul
2. Sonra **planlayici** agent'ını kullan: "$@" için önceki adımdan gelen bağlamı kullanarak uygulama planı oluştur ({previous} placeholder'ı kullan)
3. Son olarak **isci** agent'ını kullan: önceki adımdan gelen planı uygula ({previous} placeholder'ı kullan)

Bu adımları **zincir** olarak çalıştır, çıktıları {previous} ile devret. Her adım Türkçe rapor versin.
