const { Snake } = require("discord-gamecord");

const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    AttachmentBuilder,
} = require("discord.js");

module.exports = {
    name: 'snake',
    description: "Start an snake game.",

    callback: async (client, interaction) => {
        const Game = new Snake({
            message: interaction,
            isSlashGame: true,
            embed: {
                title: "Snake Game",
                overTitle: "Game Over",
                color: '#00FF00'
            },
            emojis: {
                board: '⬛',
                food: '🍎',
                up: '⬆️', 
                down: '⬇️',
                left: '⬅️',
                right: '➡️',
            },
            stopButton: 'stop',
            timeoutTime: 60000,
            snake: { head: '🟢', body: '🟩', tail: '🟢', over: '💀' },
            foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
            playerOnlyMessage: 'Only {player} can use these buttons.'
        });
        Game.startGame();
        Game.on('gameOver', result => {
            console.log(result);
        });
    }
};