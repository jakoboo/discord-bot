"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_fs_1 = __importDefault(require("node:fs"));
const node_readline_1 = __importDefault(require("node:readline"));
const node_process_1 = require("node:process");
const discord_js_1 = require("discord.js");
const posix_1 = __importDefault(require("path/posix"));
const registerCommands_1 = require("./registerCommands");
const client = new discord_js_1.Client({ intents: discord_js_1.Intents.FLAGS.GUILDS });
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;
const token = process.env.DISCORD_TOKEN;
if (!(token && clientId))
    throwErr('Please setup discord id and token environmental variables!');
client.rl = node_readline_1.default.createInterface({ input: node_process_1.stdin, output: node_process_1.stdout, prompt: '>' });
client.rl.on('line', async (input) => {
    switch (input) {
        case 'registercommands':
            await (0, registerCommands_1.registerGuildCommands)(client.commands, clientId, guildId, token);
            break;
        case 'quit':
            client.rl.close();
            break;
        default:
            console.log('Available commands:');
            console.log('> registercommands');
            console.log('> quit');
    }
    client.rl.prompt();
});
client.rl.on('close', () => {
    console.log('Bye bye :c');
    process.exit();
});
// Discover and register all Discord commands
client.commands = new discord_js_1.Collection();
const commandFiles = node_fs_1.default.readdirSync(posix_1.default.join(__dirname, 'commands')).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`).default;
    client.commands.set(command.data.name, command);
}
// Discover and register all Discord events
const eventFiles = node_fs_1.default.readdirSync(posix_1.default.join(__dirname, 'events')).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`).default;
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}
client.login(token);
function throwErr(msg) {
    throw new Error(msg);
}
