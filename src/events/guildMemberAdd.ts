import { GuildMember } from 'discord.js';
import Event from '../models/Event';

class GuildMemberAddEvent implements Event {
	name = 'guildMemberAdd';
	once = false;
	async execute(member: GuildMember) {
		console.log('New Member');
	}
}

export default new GuildMemberAddEvent();