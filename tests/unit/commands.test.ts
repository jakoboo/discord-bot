import { CommandInteraction } from 'discord.js';
import PingCommand from '../../src/commands/PingCommand';
import DiscordClient from '../../src/models/DiscordClient';

jest.mock('discord.js', () => {
	return {
		Client: jest.fn(),
		CommandInteraction: jest.fn().mockImplementation(() => ({
			reply: jest.fn(),
		})),
	};
});
jest.mock('../../src/models/DiscordClient');

describe('Commands test-suite', () => {
	const discordClient = new (DiscordClient as unknown as jest.Mock<DiscordClient>)();
	const commandInteraction = new (CommandInteraction as jest.Mock<CommandInteraction>);

	describe('PingCommand', () => {
		const pingCommand = new PingCommand(discordClient);
		pingCommand.execute(commandInteraction);

		describe('.execute', () => {
			test('defines a function', () => {
				expect(typeof pingCommand.execute).toBe('function');
			});

			test('should call CommandInteraction.reply with ephemeral "Pong!"', async () => {
				const replyPayload = { content: 'Pong!', ephemeral: true };
				expect(commandInteraction.reply).toHaveBeenCalledWith(replyPayload);
				expect(commandInteraction.reply).toHaveBeenCalledTimes(1);
			});
		});
	});
});