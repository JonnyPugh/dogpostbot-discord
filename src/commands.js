/**
 * Parsing for the chat commands the bot understands.
 *
 * A "dog command" is any message matching `!dog` or `!dog <number>`. Anything
 * else is not a command. Out-of-range or malformed counts fall back to a single
 * dog rather than erroring, matching the original bot's behaviour.
 */

export const DOG_COMMAND = '!dog';

export const DEFAULT_DOGS = 1;
export const MIN_DOGS = 1;
export const MAX_DOGS = 10;

/**
 * @param {unknown} content Raw message content.
 * @returns {{ count: number } | null} The parsed command, or null if the
 *   message is not a dog command.
 */
export function parseDogCommand(content) {
  if (typeof content !== 'string') {
    return null;
  }

  if (content === DOG_COMMAND) {
    return { count: DEFAULT_DOGS };
  }

  const match = /^!dog (\d*)$/.exec(content);
  if (!match) {
    return null;
  }

  // `!dog ` (trailing space, no number) behaves like `!dog`.
  const requested = match[1] === '' ? DEFAULT_DOGS : Number(match[1]);
  if (requested < MIN_DOGS || requested > MAX_DOGS) {
    return { count: DEFAULT_DOGS };
  }

  return { count: requested };
}
