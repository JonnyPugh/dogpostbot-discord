import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Client, GatewayIntentBits } from 'discord.js';

import { handleMessage } from '../../src/handleMessage.js';
import { fetchDogImages } from '../../src/dogService.js';

/**
 * End-to-end test against real Discord and the real dog.ceo API.
 *
 * Requires a bot token and a channel the bot can post in:
 *   DISCORD_TOKEN            - bot token (see README for how to obtain one)
 *   DISCORD_TEST_CHANNEL_ID  - ID of a throwaway channel in a test server
 *
 * Locally the test is skipped when either variable is missing, so it is safe to
 * run without secrets. In CI set E2E_STRICT=1 so a missing/misconfigured secret
 * fails the job instead of silently skipping.
 */
const token = process.env.DISCORD_TOKEN;
const channelId = process.env.DISCORD_TEST_CHANNEL_ID;
const configured = Boolean(token && channelId);
const strict = process.env.E2E_STRICT === '1';

describe('discord e2e', () => {
  if (strict && !configured) {
    it('requires DISCORD_TOKEN and DISCORD_TEST_CHANNEL_ID', () => {
      assert.fail(
        'E2E_STRICT=1 but DISCORD_TOKEN and/or DISCORD_TEST_CHANNEL_ID are not set',
      );
    });
    return;
  }

  it(
    'logs in and posts a real dog image to the test channel',
    { skip: configured ? false : 'set DISCORD_TOKEN and DISCORD_TEST_CHANNEL_ID to run e2e tests', timeout: 60_000 },
    async () => {
      const client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
        ],
      });

      await client.login(token);
      try {
        assert.ok(client.user, 'client should be logged in');

        const channel = await client.channels.fetch(channelId);
        assert.ok(channel?.isTextBased(), 'test channel should be a text channel the bot can see');

        const sent = [];
        const channelProxy = {
          async send(options) {
            const message = await channel.send(options);
            sent.push(message);
            return message;
          },
        };

        const handled = await handleMessage(
          { content: '!dog', channel: channelProxy },
          { fetchDogs: fetchDogImages },
        );

        assert.equal(handled, true);
        assert.equal(sent.length, 1, 'expected exactly one message to be posted');
        assert.ok(sent[0].attachments.size > 0, 'expected the message to have an image attachment');

        // Clean up after ourselves.
        await sent[0].delete();
      } finally {
        await client.destroy();
      }
    },
  );
});
