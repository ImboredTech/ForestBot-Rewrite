const { PermissionFlagsBits } = require('discord.js');
const TicketInfo = require('../../models/TicketInfo');

module.exports = {
    /**
     * 
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => 
    {

        await interaction.deferReply();
        const ticketInfo = await TicketInfo.findOne({ guildId: interaction.guild.id });
        if(!ticketInfo) {
            return await interaction.editReply("The guild owner hasen't set up the ticket feature. If the owner is trying to setup tickets then do /ticket-configure.");
        }
        const role = interaction.guild.roles.cache.get(ticketInfo.roleId);

        const ticketNumber = Math.floor(Math.random() * 90000) + 10000;
        const channel = await interaction.guild.channels.create({ name: `ticket-${ticketNumber}.`, 
            type: 1,
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ViewChannel],
                },
                {
                    id: role.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ViewChannel],
                }
            ],
        });

        await interaction.editReply(`Your ticket has been created in ${channel}`);
    },
    name: "ticket",
    description: "Creates an new ticket.",
};