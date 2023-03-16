import uuid4 from "uuid4";
import { ButtonBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonStyle, ComponentType } from "discord.js";

export async function paginate(interaction, pages) {
  let currentPage = 0;
  let totalPages = pages.length - 1;

  const nextButtonId = uuid4();
  const prevButtonId = uuid4();

  function sendCurrentPage() {
    const prevButton = new ButtonBuilder()
      .setLabel("<")
      .setStyle(ButtonStyle.Danger)
      .setCustomId(prevButtonId)
      .setDisabled(currentPage == 0);

    const nextButton = new ButtonBuilder()
      .setLabel(">")
      .setStyle(ButtonStyle.Primary)
      .setCustomId(nextButtonId)
      .setDisabled(currentPage == totalPages);

    const middleButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
      .setCustomId("5555555555")
      .setLabel(`${currentPage + 1}/${totalPages + 1}`);

    interaction.editReply({
      embeds: [pages[currentPage]],
      components: [
        new ActionRowBuilder().addComponents(
          prevButton,
          middleButton,
          nextButton
        ),
      ],
    });
  }

  const collector = interaction.channel.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 60 * 1000,
  });

  collector.on("collect", i => {
    if (i.user.id !== interaction.user.id) return;
    if (i.customId == nextButtonId) {
      if (currentPage == totalPages) return;
      currentPage++;
      return sendCurrentPage();
    }
    if (i.customId == prevButtonId) {
      if (currentPage == 0) return;
      currentPage--;
      return sendCurrentPage();
    }
  });

  sendCurrentPage();
}
