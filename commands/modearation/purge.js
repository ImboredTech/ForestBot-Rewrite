const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, } = require("discord.js");
module.exports = {
    /**
     * 
     * @param {Client} client
     * @param {Interaction} interaction
     */

    callback: async (client, interaction) => {
        const numMessages = interaction.options.get('nummessages').value;

        await interaction.deferReply();
        if(numMessages > 100) {
            return await interaction.editReply(`You cannt delete more than 100 messages at once.`);
        }
        await interaction.editReply({ content: `Deleted ${numMessages} messages.`, ephermal: true });
        await interaction.channel.bulkDelete(numMessages);
    },

    name: "purge",
    description: "Purges the specified amount of messages in the cahnnel you ran the command in.",
    options: [
        {
            name: "nummessages",
            description: "Number of messages to delete.",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.ManageMessages],
    botPermissions: [PermissionFlagsBits.ManageMessages],
}