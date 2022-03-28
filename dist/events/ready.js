"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReadyEvent {
    name = 'ready';
    once = true;
    async execute(client) {
        console.log('Ready!');
        client.rl.prompt();
    }
}
exports.default = new ReadyEvent();
