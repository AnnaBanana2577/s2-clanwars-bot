import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("createclan")
  .setDescription("create a new clan")
  .addStringOption((option) =>
    option
      .setName("clanname")
      .setDescription("The name of the clan you wish to create")
      .setRequired(true)
  );

export async function execute({ interaction, db }) {
  await interaction.deferReply();
  const player = await db.players.get(interaction.user.id);

  //Check if user is a registered player
  if (!player)
    return interaction.editReply(
      "You are not registered. You must register first before you can create a clan. Use `/register to register.`"
    );

  const clanName = interaction.options.getString("clanname");

  //Check if clan name is taken
  if (await db.clans.has(clanName))
    return interaction.editReply(
      `The clan name ${clanName} has already been taken. Please try another clan name.`
    );

  //Check if player is already the leader of a clan, or in another clan
  const clans = await db.clans.all();
  const duplicateClans = clans.filter(
    (c) =>
      c.value.leader == interaction.user.id ||
      c.value.players.includes(interaction.user.id)
  );
  if (duplicateClans.length)
    return interaction.editReply(
      `You are already in the ${duplicateClans[0].id} clan. You cannot create a clan while you're still in a clan.`
    );

  //Create the clan
  await db.clans.set(clanName, {
    leader: interaction.user.id,
    players: [],
    applicants: [],
  });

  interaction.editReply(`${clanName} clan has been created!`);
}
