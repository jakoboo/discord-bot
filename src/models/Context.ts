import winston from 'winston';
import requireAll from 'require-all';
import { Collection } from 'discord.js';
import DiscordClient from './DiscordClient';
import Command from './Command';
import Event from './Event';
import ContextError from '../errors/ContextError';
import path from 'path';
import { isConstructor } from '../utils/functions';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';

export default class Context {
	private client: DiscordClient;

	private discordRest: REST;
	private commands: Collection<string, Command>;
	private commandPaths: string[] = [];

	private events: Collection<string, Event>;
	private eventPaths: string[] = [];

	readonly logger: winston.Logger;

	constructor(client: DiscordClient) {
		this.client = client;
		this.discordRest = new REST({ version:'9' }).setToken(this.client.config.token);
		this.commands = new Collection();
		this.events = new Collection();

		this.logger = winston.createLogger({
			level: 'info',
			format: winston.format.json(),
			transports: [
				new winston.transports.File({ filename: 'error.log', level: 'error' }),
				new winston.transports.File({ filename: 'combined.log' }),
			],
		});

		/**
     * If we're not in production then log debug messages to the `console` with the format:
     * `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
     */
		if (process.env.NODE_ENV !== 'production') {
			this.logger.add(new winston.transports.Console({
				level: 'debug',
				format: winston.format.simple(),
			}));
		}
	}

	/**
   * Finds and returns the command by a name
   * @param command A name of a command
   * @todo add alias recognition
   */
	findCommand(command: string): Command | undefined {
		return this.commands.get(command);
	}

	private registerEvent(event: Event): void {
		if (this.events.has(event.name)) throw new ContextError(`an event with the name "${event.name}" has already been registered`);

		this.events.set(event.name, event);
		if (event.once) this.client.on(event.name, event.execute.bind(event));
		else this.client.on(event.name, event.execute.bind(event));

		this.logger.verbose(`event "${event.name}" loaded`);
	}

	private registerAllEvents(): void {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const events: any[] = [];

		// Invalidate cache in order to be able to live reload events
		if (this.eventPaths.length) {
			this.eventPaths.forEach(p => {
				delete require.cache[p];
			});
		}

		requireAll({
			dirname: path.join(__dirname, '../events'),
			recursive: true,
			filter: /\w*.[tj]s/g,
			resolve: item => events.push(item),
			map: (name, filePath) => {
				if (filePath.endsWith('.ts') || filePath.endsWith('.js')) this.eventPaths.push(path.resolve(filePath));
				return name;
			},
		});

		for (let event of events) {
			const valid = isConstructor(event, Event) || isConstructor(event.default, Event) || event instanceof Event || event.default instanceof Event;
			if (!valid) continue;

			if (isConstructor(event, Event)) event = new event(this.client);
			else if (isConstructor(event.default, Event)) event = new event.default(this.client);
			if (!(event instanceof Event)) throw new ContextError(`invalid event object to register: ${event}`);

			this.registerEvent(event);
		}
	}

	private async registerCommandDefinitions(): Promise<void> {
		const commandDefinitions = this.commands.map((command, nameOrAlias) => {
			return new SlashCommandBuilder()
				.setName(nameOrAlias)
				.setDescription(command.data.description || '')
				.toJSON();
		});

		try {
			await this.discordRest.put(Routes.applicationCommands(this.client.config.clientId), { body:  commandDefinitions });
		}
		catch (error) {
			throw new ContextError(`couldn't register command definitions`, { cause: error });
		}
	}

	private registerCommand(command: Command): void {
		if (this.isCommandRegistered(command)) throw new ContextError(`a command with the name "${command.data.name}" has already been registered`);

		[command.data.name, ...(command.data.aliases || [])].forEach(name => {
			this.commands.set(name, command);
		});

		this.logger.verbose(`command "${command.data.name}" registered`);
	}

	private registerAllCommands(): void {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const commands: any[] = [];

		// Invalidate cache in order to be able to live reload commands
		if (this.commandPaths.length) {
			this.commandPaths.forEach(p => {
				delete require.cache[p];
			});
		}

		requireAll({
			dirname: path.join(__dirname, '../commands'),
			recursive: true,
			filter: /\w*.[tj]s/g,
			resolve: item => commands.push(item),
			map: (name, filePath) => {
				if (filePath.endsWith('.ts') || filePath.endsWith('.js')) this.commandPaths.push(path.resolve(filePath));
				return name;
			},
		});

		commands.forEach((command) => {
			const valid = isConstructor(command, Command) || isConstructor(command.default, Command) || command instanceof Command || command.default instanceof Command;
			if (!valid) return;

			if (isConstructor(command, Command)) command = new command(this.client);
			else if (isConstructor(command.default, Command)) command = new command.default(this.client);
			if (!(command instanceof Command)) throw new ContextError(`invalid command object to register: ${command}`);

			this.registerCommand(command);
		});

		this.registerCommandDefinitions();
	}

	/**
   * Registers all commands and events
   */
	registerAll(): void {
		this.registerAllCommands();
		this.registerAllEvents();
	}

	private isCommandRegistered(command: Command): boolean {
		return this.commands.has(command.data.name) || (command.data.aliases !== undefined && this.commands.hasAny(...command.data.aliases));
	}
}