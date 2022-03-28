// Get and validate .env file
import EnvLoader from './loaders/EnvLoader';
EnvLoader.load();

import client from './loaders/client';
client.login(client.config.token);