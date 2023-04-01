const { Client, Message } = require("discord.js");
const AutoMod = require("../../models/AutoMod");

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
    const guildId = message.guild.id;

    const data = await AutoMod.findOne({ guildId: guildId});

    if(!data || !data.autoModEnabled) return;

    if(data || data.autoModEnabled) {
        const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/gi;
        const discordRegex = /(discord\.gg\/|discordapp\.com\/invite\/)/gi;
        const twitchRegex = /(?:https?:\/\/)?(?:www\.)?(?:twitch\.tv)\/(.+)/gi;
        const racialSlursRegex = /(?:n[\*\^]{1,}g{1,}a{0,1}|b[\*\^]{1,}tch|f[\*\^]{1,}g{1,}|s[\*\^]{1,}t)/gi;
        const messageContent = message.content.toLowerCase();
    
        if(youtubeRegex.test(messageContent) || discordRegex.test(messageContent) || twitchRegex.test(messageContent)) {
            await message.delete();
    
           await message.channel.send(`${message.author}, you can't sned links here!`);
        } else if(racialSlursRegex.test(messageContent)) {
            await message.delete();
    
           await message.channel.send(`${message.author}, you can't say that word here.`);
        }
    }
};