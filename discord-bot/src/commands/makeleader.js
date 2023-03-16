import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("makeleader")
  .setDescription("Make someone else a leader in your clan. For leaders only.")
  .addUserOption(option =>
    option
      .setName("player")
      .setDescription("the player you want to make leader")
      .setRequired(true)
  );

export async function execute({ interaction, db }) {
  await interaction.deferReply();
  const clans = await db.clans.all();
  const leaderClans = clans.filter(c => c.value.leader == interaction.user.id);
  if (!leaderClans.length)
    return interaction.editReply(
      "You are not the leader of any clan. You need to be a clan leader to use this command"
    );
  const clan = leaderClans[0];

  const player = interaction.options.getUser("player");
  if (!clan.value.players.includes(player.id))
    return interaction.editReply(`<@${player.id}> is not in ${clan.id} clan`);

  clan.value.players = clan.value.players.filter(p => p !== player.id);
  clan.value.players.push(clan.value.leader);
  clan.value.leader = player.id;
  await db.clans.set(clan.id, clan.value);
  interaction.editReply(
    `<@${player.id}> has been made leader of ${clan.id} clan.`
  );
}
