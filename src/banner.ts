import chalk from "chalk";

/**
 * kanka CLI banner'ı. Açılışta gösterilir.
 */
export function printBanner(version: string): void {
  const logo = [
    "  ╦╔═╔═╗╔╗╔╦╔═╔═╗ ",
    "  ╠╩╗╠═╣║║║╠╩╗╠═╣ ",
    "  ╩ ╩╩ ╩╝╚╝╩ ╩╩ ╩ ",
  ];

  console.log();
  for (const line of logo) {
    console.log(chalk.cyan(line));
  }
  console.log();
  console.log(
    chalk.bold.white("  kanka ") +
      chalk.dim(`v${version}`) +
      chalk.gray("  —  ") +
      chalk.italic.white("Kanka, şunu yapsana.")
  );
  console.log(chalk.dim("  Türkçe konuşan terminal kodlama asistanı"));
  console.log();
  console.log(
    chalk.dim("  Yardım: ") +
      chalk.cyan("/yardım") +
      chalk.dim("    Çıkış: ") +
      chalk.cyan("/çık") +
      chalk.dim(" veya ") +
      chalk.cyan("Ctrl+C")
  );
  console.log();
}

/**
 * Karşılama mesajı (rastgele).
 */
export function welcomeMessage(): string {
  const messages = [
    "Selam kanka! Ne yapalım?",
    "Hazırım kanka, söyle bakalım.",
    "Buradayım kanka. Ne lazım?",
    "Eee kanka, anlat bakalım.",
    "Selam! Hangi projeyi yapıyoruz kanka?",
  ];
  return messages[Math.floor(Math.random() * messages.length)]!;
}
