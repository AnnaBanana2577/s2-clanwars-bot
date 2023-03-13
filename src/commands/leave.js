import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("leave")
  .setDescription("leave your current clan");

export async function execute({ interaction, db }) {
  await interaction.deferReply();
}
