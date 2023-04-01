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
    callback: async (client, interaction) => {
      const commands = client.application.commands.cache;
      const rows = [];
      let currentPage = 1;
      const pageSize = 5;
      let maxPages = Math.ceil(commands.size / pageSize);
  
      const embed = new EmbedBuilder()
        .setTitle("Command List")
        .setDescription(`Use \`/command\` to execute a command\nPage ${currentPage} of ${maxPages}`);
  
      let index = 0;
      for (const command of commands.values()) {
        if (index >= (currentPage - 1) * pageSize && index < currentPage * pageSize) {
          embed.addFields({ name: `/${command.name}`, value: `${command.description}`});
        }
        index++;
      }
  
      const buttonRow = createButtonRow(currentPage, maxPages);
      rows.push(buttonRow);
  
      const message = await interaction.reply({
        embeds: [embed],
        components: rows
      });
  
      const filter = i => i.user.id === interaction.user.id;
      const collector = message.createMessageComponentCollector({
        filter,
        time: 60000
      });
  
      collector.on("collect", async i => {
        if (i.customId === "back") {
          currentPage--;
        } else if (i.customId === "next") {
          currentPage++;
        }
  
        const newEmbed = new EmbedBuilder()
          .setTitle("Command List")
          .setDescription(`Use \`/command\` to execute a command\nPage ${currentPage} of ${maxPages}`);
  
        let newIndex = 0;
        for (const command of commands.values()) {
          if (newIndex >= (currentPage - 1) * pageSize && newIndex < currentPage * pageSize) {
            newEmbed.addFields({ name: `/${command.name}`, value: `${command.description}`});
          }
          newIndex++;
        }
  
        const newButtonRow = createButtonRow(currentPage, maxPages);
  
        await i.update({
          embeds: [newEmbed],
          components: [newButtonRow]
        });
      });
  
      collector.on("end", async () => {
        const newButtonRow = createButtonRow(currentPage, maxPages);
        newButtonRow.components.forEach(button => button.setDisabled(true));
  
        await interaction.editReply({
          embeds: [embed],
          components: [newButtonRow]
        });
      });
    },
    name: "help",
    description: "Displays all the commands and their description."
  };
  
  function createButtonRow(currentPage, maxPages) {
    const buttonRow = new ActionRowBuilder();
  
    const backButton = new ButtonBuilder()
      .setCustomId("back")
      .setLabel("Back")
      .setStyle("2")
      .setDisabled(currentPage === 1);
  
    const pageNumber = new ButtonBuilder()
      .setCustomId("pageNumber")
      .setLabel(`${currentPage}/${maxPages}`)
      .setStyle("3")
      .setDisabled(true);
  
    const nextButton = new ButtonBuilder()
      .setCustomId("next")
      .setLabel("Next")
      .setStyle("1")
      .setDisabled(currentPage === maxPages);
  
    buttonRow.addComponents(backButton, pageNumber, nextButton);
    return buttonRow;
  }