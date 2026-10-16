import { parseDogCommand } from './commands.js';
import { fetchDogImages } from './dogService.js';

/**
 * Handle a single incoming Discord message: if it is a dog command, fetch the
 * requested images and post them to the channel.
 *
 * Kept free of any discord.js import so it can be unit tested with a plain
 * object standing in for the message.
 *
 * @param {{ content?: string, channel: { send: (options: { files: string[] }) => unknown } }} message
 * @param {{ fetchDogs?: (count: number) => Promise<string[]> }} [deps]
 * @returns {Promise<boolean>} Whether the message was handled as a dog command.
 */
export async function handleMessage(message, { fetchDogs = fetchDogImages } = {}) {
  const command = parseDogCommand(message?.content);
  if (!command) {
    return false;
  }

  const dogImages = await fetchDogs(command.count);
  for (const dogImage of dogImages) {
    await message.channel.send({ files: [dogImage] });
  }

  return true;
}
