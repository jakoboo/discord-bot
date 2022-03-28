import { BitFieldResolvable, Client, IntentsString } from 'discord.js';
import { IConfig } from '../utils/interfaces';
import Context from './Context';

export default class DiscordClient extends Client {
	readonly config: IConfig;
	readonly context: Context;

	constructor(intents: BitFieldResolvable<IntentsString, number>[]) {
		super({ intents });

		this.config = {
			token: process.env.DISCORD_TOKEN as string,
			clientId: process.env.DISCORD_CLIENT_ID as string,
		};

		this.context = new Context(this);
		this.context.registerAll();
	}
}