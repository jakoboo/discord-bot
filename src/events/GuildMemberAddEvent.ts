import DiscordClient from '../models/DiscordClient';
import Event from '../models/Event';

class GuildMemberAddEvent extends Event {
	constructor(client: DiscordClient) {
		super(client, 'guildMemberAdd');
	}

	async execute(): Promise<void> {
		console.log('New Member');
	}
}

export default GuildMemberAddEvent;