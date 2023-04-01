const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({ language: 'en', commandOptionName: 'target-user' });
const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    AttachmentBuilder,
} = require("discord.js");

module.exports = {
    name: 'tictactoe',
    description: "Start an tictactoe game with and the bot/someone else.",
    options: [
        {
            name: 'target-user',
            description: "The user who you want to play tictactoe with.",
            type: ApplicationCommandOptionType.Mentionable,
            required: false,
        },
    ],

    callback: async (client, Interaction) => {
        game.handleInteraction(interaction);
    }
}