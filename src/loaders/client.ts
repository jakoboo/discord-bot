import { Intents } from 'discord.js';
import DiscordClient from '../models/DiscordClient';
const client = new DiscordClient([Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]);
export default client;