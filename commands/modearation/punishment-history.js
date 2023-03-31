const {
    Client,
    Interaction,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
} = require("discord.js");
const punishments = require("../../models/ModSchema");

function createButtonRow(currentPage, maxPages) {
    const buttonRow = new ActionRowBuilder();

    const backButton = new ButtonBuilder()
        .setCustomId("back")
        .setEmoji("⬅️")
        .setStyle(1)
        .setDisabled(currentPage === 1);

    const pageNumber = new ButtonBuilder()
        .setCustomId("pageNumber")
        .setLabel(`${currentPage} / ${maxPages}`)
        .setStyle(2)
        .setDisabled(true);

    const nextButton = new ButtonBuilder()
        .setCustomId("next")
        .setEmoji("➡️")
        .setStyle(1)
        .setDisabled(currentPage === maxPages);

    buttonRow.addComponents([backButton, pageNumber, nextButton]);

    return buttonRow;
}

function createEmbed(data, currentPage) {
    const embed = new EmbedBuilder()
        .setTitle(`Punishment History for <@${data.UserID}>`)
        .setDescription(`Total Punishments: ${data.Punishments.length}`);
    
    const page = currentPage || 1;
    const startIndex = (page - 1) * 5;
    const endIndex = startIndex + 5;
    const pageData = data.Punishments.slice(startIndex, endIndex);

    if(pageData.length > 0) {
        pageData.forEach((punishment, index) => {
            const num = startIndex + index + 1;
            const { PunishType, Moderator, Reason, PunishmentID } = punishment;
            embed.addFields({
                name: `Punishment #${num}`,
                value: `Type: ${PunishType}\nModerator: ${Moderator}\nReason: ${Reason}\nPunishmentID: ${PunishmentID}`,
            });
        });
    } else {
        embed.addFields({
            name: `Punishment #${num}`,
            value: `Type ${PunishType}\nModerator: ${Moderator}\nReason: ${Reason}`,
          });
    }

    return embed;
}

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get("target-user").value;

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "You can't check the punishment history of the owner."
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You can't check the punishment history of that user because they have the same/higher role than you."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I can't check the punishment history of that user because they have the same/higher role than me."
      );
      return;
    }

    const data = await punishments.findOne({
      GuildID: interaction.guild.id,
      UserID: targetUser.id,
    });

    if (data) {
      const maxPages = Math.ceil(data.Punishments.length / 5);

      const initialEmbed = createEmbed(data);
      const initialButtonRow = createButtonRow(1, maxPages);

      const message = await interaction.editReply({
        embeds: [initialEmbed],
        components: [initialButtonRow],
      });

      const filter = (interaction) =>
        ["back", "next"].includes(interaction.customId);
      const collector = message.createMessageComponentCollector({
        filter,
        time: 30000,
      });

      let currentPage = 1;

      collector.on("collect", async (interaction) => {
        if (interaction.customId === "back" && currentPage > 1) {
          currentPage--;
        } else if (interaction.customId === "next" && currentPage < maxPages) {
          currentPage++;
        }

        const newEmbed = createEmbed(data, currentPage);
        const newButtonRow = createButtonRow(currentPage, maxPages);

        await interaction.update({
          embeds: [newEmbed],
          components: [newButtonRow],
        });
      });

      collector.on("end", () => {
        const disabledButtonRow = createButtonRow(currentPage, maxPages);
        disabledButtonRow.components.forEach((button) =>
          button.setDisabled(true)
        );
        interaction.editReply({ components: [disabledButtonRow] });
      });
    } else {
      await interaction.editReply(
        `This user doesn't have any past punishments.`
      );
    }
  },

  name: "punishment-history",
  description: "Checks the punishment history of the specified user.",
  options: [
    {
      name: "target-user",
      description: "The user you want to check the punishment history of.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],
}