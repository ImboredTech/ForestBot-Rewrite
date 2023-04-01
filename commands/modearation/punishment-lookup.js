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

module.exports = {
    /**
     * 
     * @param {Client} client
     * @param {Interaction} interaction
     */

    callback: async (client, interaction) => {
        const punishmentID = interaction.options.get("punishment-id").value;

        await interaction.deferReply();

        const data = await punishments.findOne({
            GuildID: interaction.guild.id,
            Punishments: { $elemMatch: { PunishmentID: punishmentID } },
        }, { "Punishments.$": 1 } );

        if(data) {
            const punishment = data.Punishments[0];

            const embed = new EmbedBuilder()
                .setTitle(`Punishment Lookup`)
                .addFields({
                    name: `Punishment #${punishment.PunishmentID}`,
                    value: `Type: ${punishment.PunishType}\nModerator: ${punishment.Moderator}\nReason: ${punishment.Reason}`
                });

            await interaction.editReply({ embeds: [embed] });
        } else {
            await interaction.editReply(`Punishment ID ${punishmentID} not found.`);
        }
    },

    name: "punishment-lookup",
    description: "Looks up an punishment with the specified punishment ID.",
    options: [
        {
            name: "punishment-id",
            description: "The punishment ID of the punishment you want to lookup.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.ModerateMembers],
    botPermissions: [PermissionFlagsBits.ModerateMembers],
}