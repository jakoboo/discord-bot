import { CommandInteraction, Interaction } from 'discord.js';
import DiscordClient from '../models/DiscordClient';
import Event from '../models/Event';

class InteractionCreateEvent extends Event {
	constructor(client: DiscordClient) {
		super(client, 'interactionCreate', false);
	}

	async execute(interaction: Interaction): Promise<void> {
		if (!interaction.isCommand) return;
		const cmdInteraction = interaction as CommandInteraction;
		const { commandName } = cmdInteraction;
		const command = this.client.context.findCommand(commandName);

		if (!command) return;

		try {
			await command.execute(cmdInteraction);
		}
		catch (error) {
			this.client.context.logger.error(error);
			await cmdInteraction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
}

export default InteractionCreateEvent;