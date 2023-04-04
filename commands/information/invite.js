const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder} = require("discord.js");

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const mentionedUserId = interaction.options.get("target-user")?.value;
        const targetUserId = mentionedUserId || interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);
        await interaction.deferReply();
        let invites = await interaction.guild.invites.fetch();
        let userInv = invites.filter(u => u.inviter && u.inviter.id == targetUserObj.id);

        let i = 0;
        userInv.forEach(inv => i += inv.uses);
        
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`:white_check_mark: ${targetUserObj.user.username} has **${i}** invites.`)

    },
    name: 'invite',
    description: 'Displays the amount of invites the user entered / your invites.',
    options: [
        {
            name: "target-user",
            description: "The user you want to check the invites of.",
            type: ApplicationCommandOptionType.Mentionable,
            required: false
        },
    ],
};