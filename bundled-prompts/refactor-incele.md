---
description: Kâşif keşfeder, refactorcu davranış koruyarak iyileştirir, gözden-geçiren onaylar
---
delege tool'unu **chain** parametresiyle kullanarak şu workflow'u çalıştır:

1. Önce **kasif** agent'ını kullan: "$@" ile ilgili tüm kodu ve test'leri bul
2. Sonra **refactorcu** agent'ını kullan: önceki adımdan gelen bağlamı kullanarak **davranış korunarak** refactor yap ({previous} placeholder'ı kullan)
3. Son olarak **gozden-geciren** agent'ını kullan: refactor'u kalite ve davranış-koruma açısından incele ({previous} placeholder'ı kullan)

Bu adımları **zincir** olarak çalıştır. Refactor'cu test'leri çalıştırarak davranış korunduğunu doğrulasın.
