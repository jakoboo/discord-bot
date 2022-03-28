"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
class PingCommand {
    data = new builders_1.SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responds with "pong"');
    async execute(interaction) {
        await interaction.reply({ content: 'Pong!', ephemeral: true });
    }
}
exports.default = new PingCommand();
