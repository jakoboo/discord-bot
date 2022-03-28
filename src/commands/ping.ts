import { CommandInteraction } from 'discord.js';
import Command from '../models/Command';
import DiscordClient from '../models/DiscordClient';

class PingCommand extends Command {
	constructor(client: DiscordClient) {
		super(client, {
			name: 'ping',
			description: 'Responds with "Pong!"',
		});
	}

	async execute(interaction: CommandInteraction): Promise<void> {
		await interaction.reply({ content: 'Pong!', ephemeral: true });
	}
}

export default PingCommand;
