"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGuildCommands = exports.registerCommands = void 0;
const rest_1 = require("@discordjs/rest");
const v10_1 = require("discord-api-types/v10");
async function registerCommands(cmds, clientId, token) {
    const rest = new rest_1.REST({ version: '10' }).setToken(token);
    await rest.put(v10_1.Routes.applicationCommands(clientId), { body: cmds.map((command) => command.data.toJSON()) })
        .then(() => console.log('Successfully registered application commands'))
        .catch(console.error);
}
exports.registerCommands = registerCommands;
;
async function registerGuildCommands(cmds, clientId, guildId, token) {
    const rest = new rest_1.REST({ version: '10' }).setToken(token);
    await rest.put(v10_1.Routes.applicationGuildCommands(clientId, guildId), { body: cmds.map((command) => command.data.toJSON()) })
        .then(() => console.log('Successfully registered guild commands'))
        .catch(console.error);
}
exports.registerGuildCommands = registerGuildCommands;
