const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("admin")
        .setDescription("Access to all the admin commands")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add")
                .setDescription("Add money to a users balance")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user you want to add money to")
                        .setRequired(true)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("amount")
                        .setDescription("the amount of money to add")
                        .setRequired(true)
                        .setMinValue(1)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("subtract")
                .setDescription("Subtract money from a users balance")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user you want to subtract money from")
                        .setRequired(true)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("amount")
                        .setDescription("the amount of money to subtract")
                        .setRequired(true)
                        .setMinValue(1)
                )
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const adminSubcommand = interaction.options.getSubcommand();

        if (adminSubcommand === "add") {
            const user = interaction.options.getUser("user");
            const amount = interaction.options.getInteger("amount");

            await profileModel.findOneAndUpdate({
                userId: user.id,
            },
                {
                    $inc: {
                        balance: amount,
                    },
                });

            await interaction.editReply(`Added ${amount} dollars to ${user.username}'s balance.`);
        }
        if (adminSubcommand === "subtract") {
            const user = interaction.options.getUser("user");
            const amount = interaction.options.getInteger("amount");

            await profileModel.findOneAndUpdate({
                userId: user.id,
            },
                {
                    $inc: {
                        balance: -amount,
                    },
                });

            await interaction.editReply(`Subtracted ${amount} dollars from ${user.username}'s balance.`);
        }
    },
};