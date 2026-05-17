---
description: Kâşif ilgili kodu bulur, hata-avcısı root cause analizi yapar
---
delege tool'unu **chain** parametresiyle kullanarak şu workflow'u çalıştır:

1. Önce **kasif** agent'ını kullan: "$@" bug'ı ile ilgili tüm kodu, log'u, stack trace'i topla
2. Sonra **hata-avcisi** agent'ını kullan: önceki adımdan gelen bağlamı kullanarak root cause analizi yap ({previous} placeholder'ı kullan)

Bu adımları **zincir** olarak çalıştır. Çıktıda **kök sebep + düzeltme stratejisi** olsun. Uygulama yapma, sadece teşhis ver.
