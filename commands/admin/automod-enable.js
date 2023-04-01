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
            await interaction.editReply("I have enabled auto moderation for this server.");
        } else if(!data.automodEnabled) {
            data.set({
                guildId: interaction.guild.id,
                automodEnabled: true,
            });
            data.save();
            await interaction.editReply("I have enabled auto moderator for this server.");
        }
    }
};