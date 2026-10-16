import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { handleMessage } from '../../src/handleMessage.js';

/** A stand-in for a discord.js Message that records what was sent. */
function fakeMessage(content) {
  const sent = [];
  return {
    content,
    sent,
    channel: {
      async send(options) {
        sent.push(options);
      },
    },
  };
}

describe('handleMessage', () => {
  it('ignores messages that are not dog commands', async () => {
    const message = fakeMessage('good morning');
    const fetchDogs = async () => {
      throw new Error('should not be called');
    };

    assert.equal(await handleMessage(message, { fetchDogs }), false);
    assert.deepEqual(message.sent, []);
  });

  it('posts a single dog for `!dog`', async () => {
    const message = fakeMessage('!dog');
    const fetchDogs = async (count) => {
      assert.equal(count, 1);
      return ['https://example.com/a.jpg'];
    };

    assert.equal(await handleMessage(message, { fetchDogs }), true);
    assert.deepEqual(message.sent, [{ files: ['https://example.com/a.jpg'] }]);
  });

  it('posts the requested number of dogs for `!dog N`', async () => {
    const message = fakeMessage('!dog 3');
    const fetchDogs = async (count) => {
      assert.equal(count, 3);
      return ['a', 'b', 'c'].map((name) => `https://example.com/${name}.jpg`);
    };

    await handleMessage(message, { fetchDogs });
    assert.deepEqual(message.sent, [
      { files: ['https://example.com/a.jpg'] },
      { files: ['https://example.com/b.jpg'] },
      { files: ['https://example.com/c.jpg'] },
    ]);
  });

  it('posts nothing when the API returns no images', async () => {
    const message = fakeMessage('!dog 2');
    const fetchDogs = async () => [];

    assert.equal(await handleMessage(message, { fetchDogs }), true);
    assert.deepEqual(message.sent, []);
  });
});
