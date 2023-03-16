import { AsciiTable3 } from "ascii-table3";
import { SlashCommandBuilder } from "discord.js";
import { getReadiedStatus } from "../lib/getReadiedStatus.js";
import { client } from "../index.js";
import { codeBlock, EmbedBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
  .setName("status")
  .setDescription("check the status of readied players for clan wars.");

export async function execute({ interaction, db }) {
  await interaction.deferReply();
  const clans = await getReadiedStatus(db);
  if (!clans.length)
    return interaction.editReply("No players are readied at this time.");
  const table = new AsciiTable3()
    .setHeading("Clan", "Players")
    .setStyle("unicode-single");

  //Test
  for await (const c of clans) {
    const playerNames = [];
    for await (const p of c.players) {
      const user = await client.users.fetch(p).catch(e => console.log(e));
      if (!user) playerNames.push("NotInServer");
      else playerNames.push(user.username);
    }
    table.addRow(c.name, playerNames.join(", "));
  }

  const embed = new EmbedBuilder()
    .setTitle("Current Clan War Readiness")
    .setDescription(codeBlock(table.toString()));

  interaction.editReply({ embeds: [embed] });
}
