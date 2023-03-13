import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ready")
  .setDescription("mark yourself ready for a clan war");

export async function execute({ interaction, db }) {
  await interaction.deferReply();
  const clans = await db.clans.all();
  const inClans = clans.filter(
    c =>
      c.value.players.includes(interaction.user.id) ||
      c.value.leader == interaction.user.id
  );
  if (!inClans.length)
    return interaction.editReply(
      "You are not in a clan. You have to be in a clan to ready yourself for a clan war."
    );
  const clan = inClans[0];
  if (clan.value.readyPlayers.includes(interaction.user.id))
    return interaction.editReply("You are already readied for a clan war");
  clan.value.readyPlayers.push(interaction.user.id);
  await db.clans.set(clan.id, clan.value);
  interaction.editReply(
    `<@${interaction.user.id}> is ready for a clan war! Use \`/ready\` to ready yourself.`
  );
}
