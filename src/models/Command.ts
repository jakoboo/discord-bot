import { CommandInteraction } from 'discord.js';
import { ICommandData } from '../utils/interfaces';
import DiscordClient from './DiscordClient';

abstract class Command {
	readonly client: DiscordClient;
	readonly data: ICommandData;

	constructor(client: DiscordClient, data: ICommandData) {
		this.client = client;
		this.data = data;
	}

	abstract execute(interaction: CommandInteraction): Promise<void>
}

export default Command;