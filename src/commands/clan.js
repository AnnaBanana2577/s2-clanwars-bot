import { EmbedBuilder } from "@discordjs/builders";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("clan")
  .setDescription("View detains on a clan")
  .addStringOption(option =>
    option
      .setName("clanname")
      .setDescription("the name of the clan you wish to view")
      .setRequired(true)
  );

export async function execute({ interaction, db }) {
  await interaction.deferReply();
  const clanName = interaction.options.getString("clanname");
  const clan = await db.clans.get(clanName);
  if (!clan) return interaction.deferReply(`${clanName} clan does not exist`);

  let playersString = "";
  clan.players.forEach(p => {
    playersString += `<@${p}>\n`;
  });
  if (!clan.players.length) playersString = "No players";

  const embed = new EmbedBuilder()
    .setTitle(`${clanName} Clan`)
    .addFields(
      { name: `Leader`, value: `<@${clan.leader}>` },
      { name: `Players`, value: playersString }
    );
  interaction.editReply({ embeds: [embed] });
}
