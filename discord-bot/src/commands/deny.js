import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("deny")
  .setDescription("deny an applicant admission into the clan")
  .addUserOption(option =>
    option
      .setName("applicant")
      .setDescription("the applicant to deny")
      .setRequired(true)
  );

export async function execute({ interaction, db }) {
  await interaction.deferReply();

  const clans = await db.clans.all();
  const leaderClans = clans.filter(c => c.value.leader == interaction.user.id);
  if (!leaderClans.length)
    return interaction.editReply(
      "You are not the leader of any clan. You must be a clan leader to use this command."
    );
  const clan = leaderClans[0];
  const applicant = interaction.options.getUser("applicant");

  if (!clan.value.applicants.includes(applicant.id))
    return interaction.editReply(
      `<@${applicant.id}> is not an applicant for ${clan.id} clan. Use \`/applicants\` to view of list of current applicants.`
    );

  clan.value.applicants = clan.value.applicants.filter(a => a !== applicant.id);
  await db.clans.set(clan.id, clan.value);
  interaction.editReply(
    `<@${applicant.id}> has been denied admission into ${clan.id} clan.`
  );
}
