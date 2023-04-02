const { PermissionFlagsBits, ChannelType} = require('discord.js');
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
            type: ChannelType.GuildText,
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
        await channel.send(`Hello <@${interaction.member.id}>! Please explain your problem and one of our support members will be help you out soon.\n<@&${role.id}>`);
        await interaction.editReply(`Your ticket has been created in ${channel}`);
    },
    name: "ticket",
    description: "Creates an new ticket.",
};