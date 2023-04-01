const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
} = require("discord.js");
const punishments = require("../../models/ModSchema");
const crypto = require("crypto");

const generatePunishmentID = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
        const reasosn = interaction.options.get("reason")?.value || "No reason provided.";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if(!targetUser) {
            await interaction.editReply("That user doesn't exist in this server.");
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("You can't kick that user because they are the owner of this guild.");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You can't kick that user because they have the same/higher role than you.");
            return;
        }

        if(targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("I can't kick that user because they have the same/higher role than me.");
            return;
        }

        try {
            let data = await punishments.findOne({
                GuildID: interaction.guild.id,
                UserID: targetUser.id,
            });

            if(data) {
                const punishmentID = generatePunishmentID();
                data.Punishments.push({
                    PunishType: "Kick",
                    Moderator: interaction.member.id,
                    Reason: reason,
                    PunishmentID: punishmentID,
                });
                data.save();
                await targetUser.send(`You have been kicked from ${interaction.guild.name} for the reason ${reason} by <@${interaction.member.id}\nPunishment ID: ${punishmentID}`);
                await targetUser.kick({ reason });
                await interaction.editReply(`User ${targetUser} has been kicked!\nReason: ${reason}\nPunishment ID: ${punishmentID}`);
            } else if(!data) {
                const punishmentID = generatePunishmentID();
                let newData = new punishments({
                    GuildID: interaction.guild.id,
                    UserID: targetUser.id,
                    Punishments: [
                        {
                            PunishType: "Kick",
                            Moderator: interaction.member.id,
                            Reason: reason,
                            PunishmentID: punishmentID,
                        },
                    ],
                });
                newData.save();
                await targetUser.send(`You have been kicked from ${interaction.guild.name} for the reason ${reason} by <@${interaction.member.id}\nPunishment ID: ${punishmentID}`);
                await targetUser.kick({ reason });
                await interaction.editReply(`User ${targetUser} has been kicked!\nReason: ${reason}\nPunishment ID: ${punishmentID}`);
            }
        } catch (error) {
            console.log(`There was an error when kicking an user in an guild.\nGuildName: ${interaction.guild.name}\nGuildID: ${interaction.guild.id}\nError:\n${error}`);
        }
    },
    name: "kick",
    description: "Kicks an specified member for the specified reason from the guild.",
    options: [
        {
            name: "target-user",
            description: "Mention the user you want to ban.",
            type: ApplicationCommandOptionType.Mentionable,
            required: true
        },
        {
            name: "reason",
            description: "The reason why you are kicking the user.",
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ]
}