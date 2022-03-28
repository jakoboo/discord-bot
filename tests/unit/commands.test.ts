import { CommandInteraction } from 'discord.js';
import DiscordClient from '../../src/models/DiscordClient';
import PingCommand from '../../src/commands/ping';

jest.mock('discord.js');
jest.mock('../../src/models/DiscordClient');

const MockDiscordClient = DiscordClient as unknown as jest.Mock<DiscordClient>;
const MockCommandInteraction = CommandInteraction as jest.Mock<CommandInteraction>;

describe('Commands', () => {
	beforeEach(() => {
		MockDiscordClient.mockClear();
		MockCommandInteraction.mockClear();
	});

	describe('ping command', () => {
		it('should call CommandInteraction::reply with ephemeral "Pong!"', async () => {
			const payload = { content: 'Pong!', ephemeral: true };
			const discordClient = new MockDiscordClient();
			const commandInteraction = new MockCommandInteraction;
			await new PingCommand(discordClient).execute(commandInteraction);
			expect(commandInteraction.reply).toHaveBeenCalledWith(payload);
			expect(commandInteraction.reply).toHaveBeenCalledTimes(1);
		});
	});
});