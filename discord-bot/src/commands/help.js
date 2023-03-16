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

const basics = new EmbedBuilder().setTitle("Basic Commands")
  .setDescription(`\`/register <playfab id>\` to register\n
\`/apply <clan name>\` to apply for a clan\n
\`/clans\` to see a list of all clans\n
\`/createclan <clan name>\` to create your own clan\n`);

const players = new EmbedBuilder().setTitle("Player Commands")
  .setDescription(`\`/ready\` to ready yourself for a clan war\n
  \`/cancel\` to cancel your readiness for a clan war\n
  \`/status\` to view a list of all ready players for a clan war\n
  \`/leave\` to leave your clan`);

const leaders = new EmbedBuilder().setTitle("Clan Leader Commands")
  .setDescription(`\`/applicants\` to view a list of applicants who've applied for the clan\n
  \`/accept <applicant>\` to accept an applicant into the clan\n
  \`/deny\` to deny the applicant admission into the clan\n
  \`/makeleader <clan member>\` to make someone else in the clan the leader`);

const pages = { basics, players, leaders };
