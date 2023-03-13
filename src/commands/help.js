import {
  ActionRowBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
} from "@discordjs/builders";
import { ComponentType, SlashCommandBuilder } from "discord.js";
import uuid4 from "uuid4";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("view information of soldat 2 clan wars");

export async function execute({ interaction, db }) {
  await interaction.deferReply({ ephemeral: true });
  let page = "basics";

  const customId = uuid4();
  const nav = new SelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder(`Choose a category`)
    .setOptions(
      {
        label: "Basics",
        description: "Basics commands and introductory info",
        value: "basics",
      },
      {
        label: "Players",
        description: "Player commands",
        value: "players",
      },
      {
        label: "Leaders",
        description: "Clan leaders commands",
        value: "leaders",
      }
    );

  function showPage() {
    interaction.editReply({
      embeds: [pages[page]],
      components: [new ActionRowBuilder().addComponents(nav)],
    });
  }

  const collector = interaction.channel.createMessageComponentCollector({
    componentType: ComponentType.SelectMenuBuilder,
    time: 60 * 1000,
  });

  collector.on("collect", async i => {
    if (i.user.id !== interaction.user.id) return;
    page = i.values[0];
    showPage();
    i.deferUpdate();
  });

  showPage();
}

const basics = new EmbedBuilder().setTitle("Basics").setDescription("basics");
const players = new EmbedBuilder().setTitle("Basics").setDescription("players");
const leaders = new EmbedBuilder().setTitle("Basics").setDescription("leaders");
const pages = { basics, players, leaders };
