---
description: İşçi uygular, gözden-geçiren inceler, işçi geri bildirimi uygular
---
delege tool'unu **chain** parametresiyle kullanarak şu workflow'u çalıştır:

1. Önce **isci** agent'ını kullan: "$@" görevini uygula
2. Sonra **gozden-geciren** agent'ını kullan: önceki adımdaki uygulamayı incele ({previous} placeholder'ı kullan)
3. Son olarak **isci** agent'ını kullan: review'dan gelen geri bildirimi uygula ({previous} placeholder'ı kullan)

Bu adımları **zincir** olarak çalıştır, çıktıları {previous} ile devret. Tüm raporlar Türkçe olsun.
