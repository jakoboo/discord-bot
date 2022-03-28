import { PermissionString } from 'discord.js';

export interface IConfig {
  token: string;
  clientId: string;
}

export interface ICommandData {
  name: string
  aliases?: string[]
  examples?: string[]
  description?: string
  enabled?: boolean;

  /**
   * Time between uses (seconds)
   *
   * Developers are not affected
   */
  cooldown?: number;

  /**
   * Restricts command to nsfw channels
   *
   * Developers are not affected
   */
  isNsfw?: boolean;

  // Requirements of the command
  requirements?: ICommandRequirements;
}

export interface ICommandRequirements {
  // Does command require developer permission to run
  developer?: boolean;

  /**
   * Command requires permission flags to run
   *
   * Developers are not affected
   */
  permissions?: PermissionString[];
}