import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("leave")
  .setDescription("leave your current clan");

export async function execute({ interaction, db }) {
  await interaction.deferReply();
  const clans = await db.clans.all();
  const inClan = clans.filter(
    c =>
      c.value.players.includes(interaction.user.id) ||
      c.value.leader == interaction.user.id
  );
  if (!inClan.length)
    return interaction.editReply("You are not in a clan currently");
  const clan = inClan[0];
  if (clan.value.leader == interaction.user.id) {
    console.log("if called");
    if (clan.value.players.length)
      return interaction.editReply(
        `You cannot leave ${clan.id} clan, as you are the leader of it. You must make someone else the leader first, using \`/makeleader <user>\``
      );
    //Delete clan
    await db.clans.delete(clan.id);
    return interaction.editReply(
      `<@${interaction.user.id}> has left ${clan.id} clan, and the clan has been dissolved.`
    );
  }
  clan.value.players = clan.value.players.filter(
    p => p !== interaction.user.id
  );
  await db.clans.set(clan.id, clan.value);
  interaction.editReply(`<@${interaction.user.id}> has left ${clan.id} clan.`);
}
