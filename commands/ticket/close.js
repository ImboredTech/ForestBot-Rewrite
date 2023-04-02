const { ApplicationCommandOptionType, Client, Interaction} = require('discord.js');

module.exports =
 {
    /**
     * 
     * @param {Client} client
     * @param {Interaction} interaction
     */
    
    callback: async(client, interaction) => {
        const channelName = interaction.channel.name;
        await interaction.deferReply();
        if(!channelName.startsWith("ticket-")){
            return await interaction.editReply("This command can only be run in ticket channels.")
        }
        await interaction.channel.delete();
        await interaction.member.send("I have closed that ticket for you!");
    },
    name: 'close',
    description: "Closes the ticket channel that the command was ran in.",
};