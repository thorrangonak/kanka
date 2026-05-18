/**
 * Easter Eggs Extension
 *
 * Eğlenceli ek komutlar — kanka'nın insan-yanlısı tarafı:
 *   /şaka       — Yazılım/dev şakası
 *   /atasözü    — Türk atasözleri (dev versionu)
 *   /kahve      — Kahve molası önerisi + ASCII art
 *   /övgü       — Motivasyon mesajı
 *   /selam      — Tekrar selam (varolan komutu güçlendiriyoruz)
 *
 * Hepsi lokal data — internet yok, LLM çağrısı yok, anında cevap.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const SAKALAR = [
	"Bir programcı eşine markete gönderildi: 'Bir somun ekmek al, yumurta varsa 6 tane al.' demiş eşi. Programcı 6 somun ekmekle dönmüş.",
	"99 küçük bug var kodda, 99 küçük bug. Birini düzelt, ondan sevkle commit at... 127 küçük bug var kodda.",
	"Production'da bug yok, sadece undocumented features.",
	"Kaç developer lambayı değiştirir? Hiçbiri, donanım sorunu.",
	"\"Çalışıyor mu?\" diye sorma. \"Hangi tanıma göre?\" sor.",
	"Senior dev = aynı hatayı 1000 farklı şekilde yapmış olan junior dev.",
	"En zor 2 şey: cache invalidation, isim verme, ve off-by-one error.",
	"git push --force = İmza atmadan kontrat yırtmak.",
	"Yazılımcı 1: 'Bu kod neden çalışıyor?' Yazılımcı 2: 'Sorma, eli ayağına dolanır.'",
	"3 saatte yapılır dedim, 3 hafta sonra hâlâ debug ediyorum. Estimation hard.",
	"Eski kod = Bir yerde işe yaramıştır, dokunma.",
	"Stack Overflow olmasaydı dev'ler kahve içemezdi, ekran karşısında ağlardı.",
	"Müşteri: 'Basit bir feature, 5 dakika sürer değil mi?' Yazılımcı: 'Tabii hocam, 5 dakikada söylersin sen, 5 ayda yaparım ben.'",
	"Backend dev: 'Frontend'in işi kolay.' Frontend dev: 'Bir login butonunu ortala lütfen.' Backend dev: *3 gün sonra* 'Çok karmaşık.'",
	"TypeScript: 'Ben 'any' demem.' Aynı dev 2 saat sonra: ': any = ...'",
];

const ATASOZLERI = [
	"Acele commit'le merge'a hata varır. (Acele işe şeytan karışır)",
	"Damlaya damlaya legacy code oldu. (Damlaya damlaya göl olur)",
	"Bir koyundan iki bug çıkmaz. (Bir koyundan iki post çıkmaz)",
	"Bug bug üstünde kurulur, yazılım da pull request üstünde. (Devlet emek üstüne kurulur)",
	"Söyleme commit message'ını, kabaca mı diff'ini açtın? (Söyleme dert söyletme dert)",
	"İşi olmayan reviewer comment'i çok yapar. (İşi olmayan adam sakal yolar)",
	"Test yazmayan production'a güvenmesin. (Tedbirini almayanın ekmeği tatlı olmaz)",
	"Önce push, sonra konuş. (Önce düşün, sonra konuş — tam tersi: PR önce, hata sonra)",
	"Refactor edenin gönlü zengindir. (Veren elin alan elden üstün olur)",
	"Code review'da kişiyi değil kodu eleştir. (Kişiyi değil, fiili eleştir)",
	"Test'in kefili kendi assert'üdür. (Adamın kefili kendi sözüdür)",
	"İki PR bir araya gelse, conflict çıkar. (İki iyilik birleşse merhamet doğurur — burada çatışma)",
	"Lint warning'i merge'ün düşmanıdır. (Tembellik fakirliğin annesidir)",
	"Hot-fix'in kalıcısı olmaz. (Acemi nalbant Karagözle eğitilir — geçici çözüm uzun ömürlüdür)",
];

const KAHVE_MESAJLARI = [
	"Kahve molası zamanı kanka ☕\n   30 dakikadır kod yazıyorsun, gözünü dinlendir.",
	"Compile süresi 2 dakika, kahve süresi 5 dakika.\n   Matematiksel olarak mantıklı.",
	"Bu bug çözülmüyorsa, kahve molası verilir.\n   Geri döndüğünde çözüm gelir (genelde).",
	"Türk kahvesi:\n   1 fincan = 1 PR review.\n   1 cezve  = 1 feature sprint.",
	"Espresso aldın? Süper, şimdi merge yapabilirsin.\n   (Decaf alma — production'a deploy'da yanlış buton'a basarsın.)",
];

const KAHVE_ASCII = `
       )  (
      (   ) )
       ) ( (
     _______)_
  .-'---------|
 ( c|/\\/\\/\\/\\|
  '-./\\/\\/\\/\\|
    '_________'
     '-------'
`;

const OVGULER = [
	"Sen yazılım dünyasının görünmeyen kahramanısın kanka. Hadi bakalım, bir adım daha.",
	"Bugün yazdığın kod, gelecekteki seni daha mutlu edecek (umarım).",
	"Her bug, bir öğrenme fırsatı. Bu bug'ı da sen halledersin.",
	"Kod yazmak zor, ama sen ondan da zorsun. Devam.",
	"Stack Overflow'un en iyi cevabı sensin kanka. Kendine güven.",
	"Yazdığın her satır, milyonlarca elektron'un dansı. Hafif şair tarafın olsun.",
	"Bu senin 100. commit'in olabilir, ama her seferinde ilk gibi heyecanlan.",
	"Production'a deploy ettiğinde dünyanın bir parçasını değiştiriyorsun.",
	"Sabah yazdığın koda akşam küfretmek normal — büyüyorsun demektir.",
	"Refactor yapmak, geçmiş seninle barışmaktır. Cesursun.",
];

const SELAMLAR = [
	"Selam kanka! Ne yapıyoruz bugün? ⚡",
	"Hoşgeldin abi, ne işle uğraşıyorduk? 🤝",
	"Selam selam, hazırım. Sen söyle, ben yapayım.",
	"Eyvallah kanka! Bugün hangi feature'ı bitiriyoruz?",
	"Selam — kod yazmaya hazır, kahveyi içmiş, parmaklar oynatılmış. Hadi.",
	"Kanka selam, hadi şu bug'ı halledelim.",
	"Geldin, iyi ettin. Bu codebase'i birlikte uyandıralım.",
];

function rastgele<T>(dizi: T[]): T {
	return dizi[Math.floor(Math.random() * dizi.length)];
}

export default function easterEggsExtension(pi: ExtensionAPI) {
	// /şaka — Yazılım şakası
	const sakaHandler = async (
		_args: string | undefined,
		ctx: { ui: { notify: (msg: string, kind?: "info" | "warning" | "error") => void } },
	): Promise<void> => {
		const saka = rastgele(SAKALAR);
		ctx.ui.notify(`😄 ${saka}`, "info");
	};
	pi.registerCommand("şaka", { description: "Yazılım dünyasından bir şaka", handler: sakaHandler });
	pi.registerCommand("saka", { description: "Yazılım şakası (ASCII alias)", handler: sakaHandler });

	// /atasözü — Türk atasözleri (dev versionu)
	const atasozuHandler = async (
		_args: string | undefined,
		ctx: { ui: { notify: (msg: string, kind?: "info" | "warning" | "error") => void } },
	): Promise<void> => {
		const a = rastgele(ATASOZLERI);
		ctx.ui.notify(`📜 ${a}`, "info");
	};
	pi.registerCommand("atasözü", { description: "Türk atasözü (dev versiyonu)", handler: atasozuHandler });
	pi.registerCommand("atasozu", { description: "Türk atasözü (ASCII alias)", handler: atasozuHandler });

	// /kahve — Kahve molası
	pi.registerCommand("kahve", {
		description: "Kahve molası — ASCII art + öneri",
		handler: async (_args, ctx) => {
			const mesaj = rastgele(KAHVE_MESAJLARI);
			ctx.ui.notify(`${KAHVE_ASCII}\n${mesaj}`, "info");
		},
	});

	// /övgü — Motivasyon
	const ovguHandler = async (
		_args: string | undefined,
		ctx: { ui: { notify: (msg: string, kind?: "info" | "warning" | "error") => void } },
	): Promise<void> => {
		const o = rastgele(OVGULER);
		ctx.ui.notify(`✨ ${o}`, "info");
	};
	pi.registerCommand("övgü", { description: "Motivasyon mesajı (sana iyi gelir)", handler: ovguHandler });
	pi.registerCommand("ovgu", { description: "Motivasyon mesajı (ASCII alias)", handler: ovguHandler });

	// /selam — Selam dön (turkce-komutlar.ts'te zaten var, ama daha çeşitli yapalım)
	// Note: turkce-komutlar'da kayıtlıysa duplicate olur, override etmeyeyim — sadece yeni komutlar.
	// Bu komutu sadece /selam-bana adıyla register edelim ki çakışmasın.
	pi.registerCommand("selam-bana", {
		description: "Rastgele Türkçe selam (kanka'dan)",
		handler: async (_args, ctx) => {
			ctx.ui.notify(rastgele(SELAMLAR), "info");
		},
	});

	// /eğlence — tüm easter eggs listesi
	pi.registerCommand("eğlence", {
		description: "Kanka'nın eğlenceli komutlarını listele",
		handler: async (_args, ctx) => {
			const satirlar = [
				"",
				"🎉 kanka eğlence komutları",
				"─".repeat(60),
				"  /şaka            Yazılım/dev şakası",
				"  /atasözü         Dev versiyonu Türk atasözü",
				"  /kahve           Kahve molası önerisi (ASCII art)",
				"  /övgü            Motivasyon mesajı",
				"  /selam-bana      Rastgele Türkçe selam",
				"",
				"ASCII alias'lar: /saka, /atasozu, /ovgu",
				"",
			];
			ctx.ui.notify(satirlar.join("\n"), "info");
		},
	});
	pi.registerCommand("eglence", {
		description: "Eğlence komutları (ASCII alias)",
		handler: async (_args, ctx) => {
			const satirlar = [
				"",
				"kanka eglence komutlari",
				"─".repeat(50),
				"  /saka       Yazilim sakasi",
				"  /atasozu    Dev versiyonu atasozu",
				"  /kahve      Kahve molasi",
				"  /ovgu       Motivasyon",
				"",
			];
			ctx.ui.notify(satirlar.join("\n"), "info");
		},
	});
}
