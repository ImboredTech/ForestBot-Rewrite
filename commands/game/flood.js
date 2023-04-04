const { Flood } = require("discord-gamecord");

const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    AttachmentBuilder,
} = require("discord.js");

module.exports = {
    name: 'flood',
    description: "Start an flood game.",
    options: [
        {
            name: "difficulty",
            description: "The difficulty you want to play at. (easy, normal, hard)",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    callback: async(client, interaction) => {
        diff = interaction.options.get('difficulty')
        if(diff === "easy") {
            difficulty = 8;
        } else if(diff === "normal") {
            difficulty = 13;
        } else if(diff === "hard") {
            difficulty = 18;
        }
        const Game = new Flood({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: 'Flood',
                color: '#5865F2',
            },
            difficulty: difficulty,
            timeoutTime: 60000,
            buttonStyle: "PRIMARY",
            emojis: ['🟥', '🟦', '🟧', '🟪', '🟩'],
            winMessage: 'You won! You took **{turns}** turns.',
            loseMessage: 'You lost! You took **{turns}** turns.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            console.log(result);
        });
    }
};