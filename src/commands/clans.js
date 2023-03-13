import { SlashCommandBuilder } from "discord.js";
import { client } from "../index.js";
import { AsciiTable3 } from "ascii-table3";
import splitArrayIntoChunks from "../lib/splitArrayIntoChunks.js";
import { codeBlock, EmbedBuilder } from "@discordjs/builders";
import { paginate } from "../lib/paginate.js";

export const data = new SlashCommandBuilder()
  .setName("clans")
  .setDescription("List out all current clans");

export async function execute({ interaction, db }) {
  await interaction.deferReply();
  const clans = await db.clans.all();
  if (!clans.length)
    return interaction.editReply("No registered clans currently.");
  const formattedClans = [];
  for await (const clan of clans) {
    const c = {};
    c.name = clan.id;
    c.playerCount = clan.value.players.length + 1;
    const leaderUser = await client.users.fetch(clan.value.leader);
    if (!leaderUser) c.leader = "Not in server";
    else c.leader = leaderUser.username;
    formattedClans.push(c);
  }
  const data = splitArrayIntoChunks(formattedClans, 10);
  const pages = data.map((d) => generatePage(d));
  paginate(interaction, pages);
}

function generatePage(data) {
  const embed = new EmbedBuilder().setTitle(`Soldat 2 Clans`);
  const table = new AsciiTable3()
    .setHeading("Clan", "Leader", "Players")
    .setStyle("unicode-single");
  for (const d of data) {
    table.addRow(d.name, d.leader, d.playerCount);
  }
  embed.setDescription(codeBlock(table.toString()));
  return embed;
}
