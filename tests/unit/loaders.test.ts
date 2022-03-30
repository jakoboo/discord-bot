/* eslint-disable @typescript-eslint/no-explicit-any */
import { config as dotenvConfig } from 'dotenv';
import EnvLoader from '../../src/loaders/EnvLoader';
import DiscordClient from '../../src/models/DiscordClient';

jest.mock('dotenv', () => {
	const original = jest.requireActual('dotenv');
	return {
		...original,
		config: jest.fn(),
	};
});
jest.mock('../../src/models/DiscordClient');

const clientConfig = { token: 'discord_token', clientId: 'client_id' };
Object.defineProperty(DiscordClient.prototype, 'config', { value:  clientConfig });

describe('Entrypoint', () => {
	let loadSpy: jest.SpyInstance;
	let loginSpy: jest.SpyInstance;

	beforeAll(() => {
		loadSpy = jest.spyOn(EnvLoader, 'load').mockImplementation(jest.fn());
		loginSpy = jest.spyOn(DiscordClient.prototype, 'login');
		require('../../src/index');
	});

	afterAll(() => {
		loadSpy.mockRestore();
	});

	test('should load environmental variables', () => {
		expect(loadSpy).toHaveBeenCalledTimes(1);
	});

	test('should login to discord with token', () => {
		expect(loginSpy).toHaveBeenCalledTimes(1);
		expect(loginSpy).toHaveBeenCalledWith(clientConfig.token);
	});
});

describe('EnvLoader', () => {
	let validateSpy: jest.SpyInstance;

	beforeAll(() => {
		validateSpy = jest.spyOn(EnvLoader as any, 'validate');
	});

	beforeEach(() => {
		validateSpy.mockClear();
	});

	afterAll(() => {
		validateSpy.mockRestore();

		// Restore dotenv.config original implementation
		// (dotenvConfig as jest.Mock).mockImplementation(jest.requireActual('dotenv').config);
	});

	test('should import/call dotenv config', () => {
		expect(dotenvConfig).toHaveBeenCalledTimes(1);
	});

	describe('.load', () => {
		test('should call .validate with process.env', () => {
			EnvLoader.load();
			expect(validateSpy).toHaveBeenCalledTimes(1);
			expect(validateSpy).toHaveBeenCalledWith(process.env);
		});
	});

	describe('.validate', () => {
		test('should throw EnvError if no env variables are set', () => {
			expect(validateSpy).toThrow(Error);
		});

		test('should return when all required env variables are set', () => {
			const envVariables = {
				DISCORD_TOKEN: 'discord_token',
				DISCORD_CLIENT_ID: 'discord_client_id',
			};

			(EnvLoader as any).validate(envVariables);
			expect(validateSpy).toHaveReturnedTimes(1);
		});
	});
});