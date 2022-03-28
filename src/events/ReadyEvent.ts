import DiscordClient from '../models/DiscordClient';
import Event from '../models/Event';

class ReadyEvent extends Event {
	constructor(client: DiscordClient) {
		super(client, 'ready', true);
	}

	async execute(): Promise<void> {
		this.client.context.logger.info(`Ready! Bot logged in as: ${this.client.user?.tag}`);
	}
}

export default ReadyEvent;