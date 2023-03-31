const { devs, testServer } = require("../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.isMessageComponent()) {
    const currentPage = parseInt(interaction.customId.split('_')[1]);
    const pageCount = 5; // set the total page count here
    if (currentPage < 1 || currentPage > pageCount) return;
    await interaction.deferUpdate();
    // handle the button click event here
    // update the message with the new page
  }

  const localCommands = getLocalCommands();
  const commands = await client.application.commands.fetch();

  const commandObject = localCommands.find(
    (cmd) => cmd.name === interaction.commandName
  );

  if (!commandObject) return;

  if (commandObject.devOnly) {
    if (!devs.includes(interaction.member.id)) {
      interaction.reply({
        content: "Only developers are allowed to run this command.",
        ephemeral: true,
      });
      return;
    }
  }

  if (commandObject.testOnly) {
    if (!(interaction.guild.id === testServer)) {
      interaction.reply({
        content: "This command is in testing mode.",
        ephemeral: true,
      });
      return;
    }
  }

  if (commandObject.permissionsRequired?.length) {
    for (const permission of commandObject.permissionsRequired) {
      if (!interaction.member.permissions.has(permission)) {
        interaction.reply({
          content: "Not enough permissions.",
          ephemeral: true,
        });
        return;
      }
    }
  }

  if (commandObject.botPermissions?.length) {
    for (const permission of commandObject.botPermissions) {
      const bot = interaction.guild.members.me;

      if (!bot.permissions.has(permission)) {
        interaction.reply({
          content: "I don't have the correct permissions. Please reinvite me.",
          ephemeral: true,
        });
        return;
      }
    }
  }

  await commandObject.callback(client, interaction);
};
