const { ApplicationCommandOptionType, Client, Interaction, EmbedBuilder} = require('discord.js');

module.exports =
 {
    /**
     * 
     * @param {Client} client
     * @param {Interaction} interaction
     */
    
    callback: async(client, interaction) => {
        const mentionedUserId = interaction.options.get("target-user")?.value;
        const targetUserId = mentionedUserId || interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);
        await interaction.deferReply();

        const accountCreationDate = targetUserObj.createdAt;
        const guildJoinDate = interaction.guild.members.cache.get(targetUserId).joinedAt;
        const userName = targetUserObj.username;
        const discriminator = targetUserObj.discriminator;
        const avatar = targetUserObj.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 });
        const highestRole = interaction.guild.members.cache.get(targetUserId).roles.highest;
        
        const embed = new EmbedBuilder()
            .setTitle(`User Info: ${userName}#${discriminator}`)
            .setColor('Green')
            .setThumbnail(avatar)
            .addFields({ name: "Account Creation Date", value: `${accountCreationDate}`})
            .addFields({ name: "Guild Join Date", value: `${guildJoinDate}` })
            .addFields({ name: "Highest Role", value: `${highestRole}`});

        await interaction.editReply({ embeds: [embed] });
    },  
    name: 'userinfo',
    description: "Gets user information of you or the specified user.",
    options: [{
        name: 'target-user',
        description: "The user you want to see the information of.",
        type: ApplicationCommandOptionType.User,
        required: false,
    }]
};