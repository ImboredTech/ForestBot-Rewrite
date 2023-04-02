const {
    Client,
    Interaction,
} = require("discord.js");
const AutoMod = require("../../models/AutoMod");

module.exports = {
    name: 'automod-enable',
    description: "Enables the bots auto moderation feature.",

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const data = await AutoMod.findOne({ guildId: interaction.guild.id });
        if(!data) {
            let newData = new AutoMod({
                guildId: interaction.guild.id,
                automodEnabled: true,
            });
            newData.save();
            await interaction.editReply("I have enabled auto moderation for this server. To disable it run the /automod-disable command.");
        } else if(!data.automodEnabled) {
            data.set({
                guildId: interaction.guild.id,
                automodEnabled: true,
            });
            data.save();
            await interaction.editReply("I have enabled auto moderation for this server. To disable it run the /automod-disable command.");
        } else if(data || data.automodEnabled) {
            await interaction.editReply("Automod has already been enabled. If you are trying to disable automod do /automod-disable to disable the automod.");
        }
    }
};