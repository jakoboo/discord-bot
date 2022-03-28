"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GuildMemberAddEvent {
    name = 'guildMemberAdd';
    once = false;
    async execute(member) {
        console.log('New Member');
    }
}
exports.default = new GuildMemberAddEvent();
