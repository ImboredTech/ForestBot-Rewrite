const { ApplicationCommandOptionType, Client, Interaction} = require('discord.js');
const TicketInfo = require('../../models/TicketInfo');

module.exports = {
    /**
     * 
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => 
    {

        const roleId = interaction.options.get("roleId").value;
        await interaction.deferReply();
        const ticketInfo = await TicketInfo.findOne({ guildId: interaction.guild.id });
        if(ticketInfo) {
            ticketInfo.set({
                guildId: interaction.guild.id,
                roleId: roleId
            });
            await interaction.editReply(`I have changed the support role to be the specified support role. If you want to disable Tickets then do /ticket-disable`);
            ticketInfo.save();
        } else if(!ticketInfo) {
            const newTicketInfo = new TicketInfo({
                guildId: interaction.guild.id,
                roleId: roleId
            });
            newTicketInfo.save();
            await interaction.editReply(`Tickets have been configured! If you want to disable them then do /ticket-disable`);
        }
    },
    name: "ticket-configure",
    description: "Creates an new ticket.",
    options: [{
        name: "roleId",
        description: "Mention your support role.",
        type: ApplicationCommandOptionType.Role,
        required: true
    }]
};