const { Client, Interaction } = require("discord.js");
const os = require("os-utils");

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const cpuUsage = await getCpuUsage();

        await interaction.deferReply();

        await interaction.editReply(`Bot Uptime: ${formatTime(process.uptime())}\nCPU Usage: ${cpuUsage.toFixed(2)}%`);
    },
    name: 'uptime',
    description: 'Displays the uptime of the bot and system satistics.'
}

async function getCpuUsage() {
    return new Promise((resolve, reject) => {
        os.cpuUsage((cpuUsage) => {
            resolve(cpuUsage * 100);
        });
    });
}


function formatTime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsFormated = Math.floor(seconds % 60);

    return `${days}d ${hours}h ${minutes}m ${secondsFormated}s`;
}