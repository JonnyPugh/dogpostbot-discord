import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { createClient, attachHandlers, startBot } from '../../src/bot.js';

/** A stand-in for a discord.js Client that records handlers and logins. */
function fakeClient() {
  const handlers = {};
  return {
    handlers,
    loggedInWith: undefined,
    on(event, handler) {
      handlers[event] = handler;
      return this;
    },
    async login(token) {
      this.loggedInWith = token;
      return 'ok';
    },
  };
}

describe('createClient', () => {
  it('returns a discord.js client', () => {
    const client = createClient();
    assert.equal(typeof client.on, 'function');
  });
});

describe('attachHandlers', () => {
  it('registers a messageCreate handler and returns the client', () => {
    const client = fakeClient();
    assert.equal(attachHandlers(client), client);
    assert.equal(typeof client.handlers.messageCreate, 'function');
  });

  it('routes message events through handleMessage', async () => {
    const client = fakeClient();
    const posts = [];
    const message = {
      content: '!dog',
      channel: { async send(options) { posts.push(options); } },
    };

    attachHandlers(client, { fetchDogs: async () => ['https://example.com/a.jpg'] });
    client.handlers.messageCreate(message);

    // Handlers fire the async work without awaiting; give it a tick.
    await new Promise((resolve) => setImmediate(resolve));
    assert.deepEqual(posts, [{ files: ['https://example.com/a.jpg'] }]);
  });

  it('logs errors instead of throwing', async () => {
    const client = fakeClient();
    const errors = [];
    const message = {
      content: '!dog',
      channel: { async send() {} },
    };

    attachHandlers(client, {
      fetchDogs: async () => {
        throw new Error('boom');
      },
      logger: { error: (...args) => errors.push(args) },
    });
    client.handlers.messageCreate(message);

    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(errors.length, 1);
    assert.match(errors[0][1].message, /boom/);
  });
});

describe('startBot', () => {
  it('throws when no token is available', async () => {
    await assert.rejects(() => startBot({ token: '' }), /DISCORD_TOKEN/);
  });

  it('attaches handlers and logs in with the token', async () => {
    const client = fakeClient();
    await startBot({ token: 'secret', client });
    assert.equal(typeof client.handlers.messageCreate, 'function');
    assert.equal(client.loggedInWith, 'secret');
  });

  it('falls back to process.env.DISCORD_TOKEN', async () => {
    const client = fakeClient();
    const previous = process.env.DISCORD_TOKEN;
    process.env.DISCORD_TOKEN = 'from-env';
    try {
      await startBot({ client });
      assert.equal(client.loggedInWith, 'from-env');
    } finally {
      if (previous === undefined) {
        delete process.env.DISCORD_TOKEN;
      } else {
        process.env.DISCORD_TOKEN = previous;
      }
    }
  });
});
