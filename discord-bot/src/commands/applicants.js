import { EmbedBuilder } from "@discordjs/builders";
import { SlashCommandBuilder } from "discord.js";
import { client } from "../index.js";
import { paginate } from "../lib/paginate.js";
import splitArrayIntoChunks from "../lib/splitArrayIntoChunks.js";

export const data = new SlashCommandBuilder()
  .setName("applicants")
  .setDescription("Get a list of applicants for your clan");

export async function execute({ interaction, db }) {
  await interaction.deferReply();
  const clans = await db.clans.all();
  const leaderClan = clans.filter(c => c.value.leader == interaction.user.id);
  if (!leaderClan.length)
    return interaction.editReply(
      "You are not the leader of any clan. You can only view applicants for a clan you are the leader of."
    );
  const clan = leaderClan[0];
  if (!clan.value.applicants.length)
    return interaction.editReply(
      `No applicants for ${clan.id} clan currently.`
    );
  const applicants = splitArrayIntoChunks(clan.value.applicants, 10);
  const pages = [];
  for await (const a of applicants) {
    const page = await generatePage(a, clan.id);
    pages.push(page);
  }
  paginate(interaction, pages);
}

async function generatePage(data, clanName) {
  const embed = new EmbedBuilder().setTitle(`Applicants for ${clanName} clan`);
  let applicants = "";
  for await (const d of data) {
    const user = await client.users.fetch(d);
    applicants += `${user.username}\n`;
  }
  embed.setDescription(applicants);
  return embed;
}
