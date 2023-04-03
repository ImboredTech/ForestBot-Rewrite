const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, } = require("discord.js");
const punishments = require("../../models/ModSchema");
const crypto = require("crypto");

const generatePunishmentID = () => {
    const characters = "ABCDEFGHIJKMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
        const targetUserId = interaction.options.get("target-user").value;
        const reason = interaction.options.get("reason")?.value || "No reason provided";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if(!targetUser) {
            await interaction.editReply("That user doesn't exist in this server.");
            return;
        }

        if(targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("You can't warn that user because they're the server owner.");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if(targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You you can't warn that user because they have the same/higher role than you.");
            return;
        }

        if(targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("I can't warn that user because they have the same/higher role than me.");
            return;
        }

        try {
            let data = await punishments.findOne({
                GuildID: interaction.guild.id,
                UserID: targetUser.id,
            });

            if(data) {
                const punishmentID = generatePunishmentID();
                if(data.Punishments.length === 2){
                    const newReason = "You have reached the max amount of warns.";
                    await targetUser.send(`You have been kicked from ${interaction.guild.name} due to you reaching 3 warnings in the guild.\nPunishmentID: ${punishmentID}`);
                    await targetUser.kick({ newReason });
                    await interaction.editReply(`User ${targetUser} was kicked due to them reaching the max amount of warns.`);
                    data.Punishments.push({
                        PunishType: "Kick",
                        Moderator: interaction.member.id,
                        Reason: reason,
                        PunishmentID: punishmentID,
                    });
                    data.save();
                } else {
                    data.Punishments.push({
                        PunishType: "Warn",
                        Moderator: interaction.member.id,
                        Reason: reason,
                        PunishmentID: punishmentID,
                    });
                    data.save();
                    await interaction.editReply(`User ${targetUser} was warned!\nReason: ${reason}`);
                }
            } else if(!data) {
                let newData = new punishments({
                    GuildID: interaction.guild.id,
                    UserID: targetUser.id,
                    Punishments: [
                        {
                            PunishType: "Warn",
                            Moderator: interaction.member.id,
                            Reason: reason,
                            PunishmentID: punishmentID,
                        },
                    ],
                });
                newData.save();
                await interaction.editReply(`User ${targetUser} was warned!\nReason: ${reason}`);
            }
        } catch (error) {
            console.log(`There was an error when warning an user in guild ${interaction.guild.name}: ${error}`);
        }
    },

    name: "warn",
    description: "Warns the specified user for the specified reason.",
    options: [
        {
            name: "target-user",
            description: "The user you want to warn.",
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: "reason",
            description: "The reason why you are warning the user.",
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.ModerateMembers],
    botPermissions: [PermissionFlagsBits.ModerateMembers],
};