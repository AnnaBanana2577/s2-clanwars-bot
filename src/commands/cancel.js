import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("cancel")
  .setDescription("cancel your readiness for a clan war");

export async function execute({ interaction, db }) {
  await interaction.deferReply();
  const clans = await db.clans.all();
  const inReady = clans.filter(c =>
    c.value.readyPlayers.includes(interaction.user.id)
  );
  if (!inReady.length)
    return interaction.editReply("You are not ready currently.");
  const clan = inReady[0];
  clan.value.readyPlayers = clan.value.readyPlayers.filter(
    p => p !== interaction.user.id
  );
  await db.clans.set(clan.id, clan.value);
  interaction.editReply(
    `<@${interaction.user.id}> is no longer ready for a clan war.`
  );
}
