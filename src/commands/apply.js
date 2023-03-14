import { SlashCommandBuilder } from "discord.js";
import { getReadiedClans } from "../lib/getReadiedClans.js";

export const data = new SlashCommandBuilder()
  .setName("apply")
  .setDescription("apply to join a clan")
  .addStringOption(option =>
    option
      .setName("clanname")
      .setDescription("the name of the clan you wish to apply to")
      .setRequired(true)
  );

export async function execute({ interaction, db }) {
  await interaction.deferReply();
  const clanName = interaction.options.getString("clanname");
  const clan = await db.clans.get(clanName);
  if (!clan) return interaction.editReply(`Clan ${clanName} doesn't exist.`);
  if (
    clan.leader == interaction.user.id ||
    clan.players.includes(interaction.user.id) ||
    clan.applicants.includes(interaction.user.id)
  )
    return interaction.editReply(
      `You are already in, or have already applied, to ${clanName} clan`
    );
  clan.applicants.push(interaction.user.id);
  await db.clans.set(clanName, clan);
  interaction.editReply(
    `<@${interaction.user.id}> has applied to ${clanName} clan!`
  );
  const readiedClans = await getReadiedClans(db);
  if (readiedClans.length >= 2) {
    //startmatch
  }
}
