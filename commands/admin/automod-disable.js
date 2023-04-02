const {
    Client,
    Interaction,
} = require("discord.js");
const AutoMod = require("../../models/AutoMod");

module.exports = {
    name: 'automod-disable',
    description: "Disbles the bots auto moderation feature.",

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const data = await AutoMod.findOne({ guildId: interaction.guild.id });
        if(!data || !data.automodEnabled) {
            await interaction.editReply("Automod is already disabled in this server. If you want to enable it do /automod-enable");
        } else if(data) {
            data.set({
                guildId: interaction.guild.id,
                automodEnabled: false,
            });
            data.save();
            await interaction.editReply("Automod has been disabled. To renable it run the command /automod-enable.");
        }
    }
};