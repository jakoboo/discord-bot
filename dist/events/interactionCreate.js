"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GuildMemberAddEvent {
    name = 'interactionCreate';
    once = false;
    async execute(interaction) {
        if (!interaction.isCommand)
            return;
        const cmdInteraction = interaction;
        const { commandName } = cmdInteraction;
        const command = interaction.client.commands.get(commandName);
        if (!command)
            return;
        try {
            await command.execute(cmdInteraction);
        }
        catch (error) {
            console.error(error);
            await cmdInteraction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}
exports.default = new GuildMemberAddEvent();
