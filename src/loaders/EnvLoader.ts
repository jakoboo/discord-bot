import 'dotenv/config';
import EnvError from '../errors/EnvError';

export default class EnvLoader {
	static load(): void {
		this.validate(process.env);
	}

	private static validate(env: NodeJS.ProcessEnv): void {
		if (env.DISCORD_TOKEN === '') throw new EnvError('discord token missing');
		if (env.DISCORD_CLIENT_ID === '') throw new EnvError('discord client id missing');
	}
}