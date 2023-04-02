const { Client, Message } = require("discord.js");
const AutoMod = require("../../models/AutoMod");

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
  const guildId = message.guild.id;

  const data = await AutoMod.findOne({ guildId: guildId });

  if (!data || !data.automodEnabled) {
    console.log("Not Enabled.");
    return;
  }


  console.log("enabled");
  const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([-\w]{11})$/gi;
  const discordRegex = /(discord\.gg\/|discordapp\.com\/invite\/)/gi;
  const twitchRegex = /^(?:https?:\/\/)?(?:www\.)?(?:twitch\.tv)\/([a-zA-Z0-9_]{4,25})$/gi;
  const racialSlursRegex = /\bn[i1]gg[aeu]?r\b|\bb[i1]tch\b|\bf[aeu]gg[aeu]t\b|\bs[i1]t\b/gi;
  const messageContent = message.content.toLowerCase();

  if (youtubeRegex.test(messageContent) || discordRegex.test(messageContent) || twitchRegex.test(messageContent)) {
    await message.delete();
    await message.channel.send(`${message.author}, you can't send links here!`);
  } else if (racialSlursRegex.test(messageContent)) {
    await message.delete();
    await message.channel.send(`${message.author}, you can't say that word here.`);
  }
}