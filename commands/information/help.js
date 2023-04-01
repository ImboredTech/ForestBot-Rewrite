const {
    Client,
    Interaction,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
} = require("discord.js");

module.exports = {
    /**
     * 
     * @param {Client} client
     * @param {Interaction} interaction
     */

    callback: async(client, interaction) => {

        const commands = client.application.commands.cache;
        const rows = [];
        let currentPage = 1;
        const pageSize = 5;
        let maxPages = Math.ceil(commands.size / pageSize);
      
        const embed = new EmbedBuilder()
          .setTitle('Command List')
          .setDescription(`Use \`/command\` to execute a command\nPage ${currentPage} of ${maxPages}`);
      
        let index = 0;
        for (const command of commands.values()) {
          if (index >= (currentPage - 1) * pageSize && index < currentPage * pageSize) {
            embed.addFields({ name:`/${command.name}`, value:`${command.description}`});
          }
          index++;
        }
      
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('back')
                    .setLabel('Back')
                    .setEmoji('⬅️')
                    .setStyle('1')
                    .setDisabled(currentPage === 1),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setEmoji('➡️')
                    .setStyle('1')
                    .setDisabled(currentPage === maxPages),
            );
        rows.push(row);

        await interaction.reply({ embeds: [embed], components: rows });

        const filter = i => i.customId === 'back' || i.customId === 'next';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'back') {
                currentPage--;
            } else if (i.customId === 'next') {
                currentPage++;
            }
            await i.update({ embeds: [embed.setDescription(`Use \`/command\` to execute a command\nPage ${currentPage} of ${maxPages}`)], components: rows });
        });

        collector.on('end', () => {
            rows.forEach(row => {
                row.components.forEach(button => {
                    button.setDisabled(true);
                });
            });
            interaction.editReply({ components: rows });
        });
    },
    name: "help",
    description: "Displays all the commands and their description."
}