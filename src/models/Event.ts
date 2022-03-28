import { ClientEvents } from 'discord.js';
import DiscordClient from './DiscordClient';

abstract class Event {
	readonly client: DiscordClient;
	readonly name: keyof ClientEvents;
	readonly once: boolean;

	constructor(client: DiscordClient, name: keyof ClientEvents, once: boolean) {
		this.client = client;
		this.name = name;
		this.once = once;
	}

	/**
   * Executes the event.
   * @param params Event parameters from [discord.js.org](https://discord.js.org/#/docs/main/stable/class/Client)
   */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	abstract execute(...params: any | undefined): Promise<void>
}

export default Event;