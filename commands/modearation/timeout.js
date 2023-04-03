const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, } = require("discord.js");
const punishments = require("../../Models/ModSchema");
const ms = require("ms");
const crypto = require("crypto");

const generatePunishmentID = () => {
    const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for(let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

module.exports = {
    /**
     * 
     * @param {Client} client
     * @param {Interaction} interaction
     */

    callback: async (client, interaction) => {
        const mentionable = interaction.options.get("target-user").value;
        const duration = interaction.options.get("duration").value;
        const reason = interaction.options.get("reason")?.value || "No reason provided";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(mentionable);
        if(!targetUser) {
            await interaction.editReply("That user doesn't exist in this server.");
            return;
        }

        if(targetUser.user.bot) {
            await interaction.editReply("I can't timeout an bot.");
            return;
        }

        const msDuration = ms(duration);
        if(isNaN(msDuration)) {
            await interaction.editReply("Please provide a valid timeout duration.");
            return;
        }

        if(msDuration < 5000 || msDuration > 2.419e9){
            await interaction.editReply("Timeout duration cannot be less than 5 seconds or more than 28 days.");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if(targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You can't timeout that user because they have the same/higher role than you.");
            return;
        }

        if(targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("I can't timeout that user because they have the same/higher role than me.");
            return;
        }

        try {
            const { default: prettyMs } = await import("pretty-ms");

            if(targetUser.isCommunicationDisabled()) {
                await targetUser.timeout(msDuration, reason);
                await interaction.editReply(`${targetUser}'s timeout has been updated to ${prettyMs(msDuration, { verbose: true,})}\nReason: ${reason}`);
                let data = await punishments.findOne({
                    GuildID: interaction.guild.id,
                    UserID: targetUser.id,
                });
                if(data) {
                    const punishmentID = generatePunishmentID();
                    data.Punishments.push({
                        PunishType: 'Timeout',
                        Moderator: interaction.member.id,
                        Reason: reason,
                        PunishmentID: punishmentID,
                    });
                    data.save();
                    await targetUser.timeout(msDuration, reason);
                    await interaction.editReply(`${targetUser} was timed out for ${prettyMs(msDuration, {
                        verbose: true,
                    })}\nReason: ${reason}`);
                } else if(!data) {
                    const punishmentID = generatePunishmentID();
                    let newData = new punishments({
                        GuildID: interaction.guild.id,
                        UserID: targetUser.id,
                        Punishments: [
                            {
                                PunishType: "Timeout",
                                Moderator: interaction.member.id,
                                Reason: reason,
                                PunishmentID: punishmentID,
                            },
                        ],
                    });
                    newData.save();
                    await targetUser.timeout(msDuration, reason);
                    await interaction.editReply(`${targetUser} was timed out for ${prettyMs(msDuration, { verbose: true, })}\nReason: ${reason}`);
                };
            }
            return;
        }catch (error) {
            console.log(`There was an error when timing out ${error}`);
        }
    }, 
    name: "timeout",
    description: "Timeout a user.",
    options: [
        {
            name: "target-user",
            description: "The user you want to timeout.",
            type: ApplicationCommandOptionType.Mentionable,
            required: TextTrackCueList,
        },
        {
            name: "duration",
            description: "Timeout duration (30m, 1h, 1 day)",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "reason",
            description: "The reason for the timeout.",
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.ModerateMembers],
    botPermissions: [PermissionFlagsBits.ModerateMembers],
};