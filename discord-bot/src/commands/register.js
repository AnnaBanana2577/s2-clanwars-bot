import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("register")
  .setDescription("register as a player for s2 clan wars")
  .addStringOption(option =>
    option
      .setName("playfabid")
      .setDescription("your playfabid")
      .setRequired(true)
  );

export async function execute({ interaction, db }) {
  await interaction.deferReply();
  //Check if already registered
  if (await db.players.has(interaction.user.id))
    return interaction.editReply("You are already registered.");

  //Check if playfabid is real
  const playfabId = interaction.options.getString("playfabid");

  //Check if playfabid has been registered
  const players = await db.players.all();
  const duplicatePlayer = players.filter(p => p.value.playfabId == playfabId);
  if (duplicatePlayer.length)
    return interaction.editReply(
      `That playfab ID has already been registered to <@${duplicatePlayer[0].id}>.`
    );

  //Register the player
  await db.players.set(`${interaction.user.id}`, {
    playfabId,
    isInClan: false,
  });
  interaction.editReply(`<@${interaction.user.id}> has registered!`);
}
