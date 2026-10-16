import { Client, GatewayIntentBits } from 'discord.js';

import { handleMessage } from './handleMessage.js';
import { fetchDogImages } from './dogService.js';

/**
 * Intents the bot needs. `MessageContent` is privileged and must also be
 * enabled in the Discord developer portal:
 * https://discordjs.guide/popular-topics/intents.html
 */
export const INTENTS = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
];

/**
 * Create a discord.js client configured for the bot.
 * @param {import('discord.js').ClientOptions} [options]
 */
export function createClient(options = {}) {
  return new Client({ intents: INTENTS, ...options });
}

/**
 * Wire the bot's event handlers onto a client.
 *
 * @param {import('discord.js').Client} client
 * @param {{ fetchDogs?: (count: number) => Promise<string[]>, logger?: Pick<Console, 'error'> }} [deps]
 * @returns {import('discord.js').Client} The same client, for chaining.
 */
export function attachHandlers(client, { fetchDogs = fetchDogImages, logger = console } = {}) {
  client.on('messageCreate', (message) => {
    handleMessage(message, { fetchDogs }).catch((error) => {
      logger.error('Failed to handle message', error);
    });
  });

  return client;
}

/**
 * Create a client, attach handlers and log in.
 *
 * @param {{
 *   token?: string,
 *   client?: import('discord.js').Client,
 *   fetchDogs?: (count: number) => Promise<string[]>,
 *   logger?: Pick<Console, 'error'>,
 * }} [options]
 */
export async function startBot({
  // discord.js also reads DISCORD_TOKEN on its own when no token is passed to
  // `new Client()`; we read it explicitly so we can fail with a clear message.
  token = process.env.DISCORD_TOKEN,
  client = createClient(),
  fetchDogs,
  logger,
} = {}) {
  if (!token) {
    throw new Error('DISCORD_TOKEN environment variable is required');
  }

  attachHandlers(client, { fetchDogs, logger });
  return client.login(token);
}
