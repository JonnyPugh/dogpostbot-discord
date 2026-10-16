import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { parseDogCommand, DEFAULT_DOGS } from '../../src/commands.js';

describe('parseDogCommand', () => {
  it('parses the bare `!dog` command as one dog', () => {
    assert.deepEqual(parseDogCommand('!dog'), { count: 1 });
  });

  it('parses an explicit in-range count', () => {
    assert.deepEqual(parseDogCommand('!dog 5'), { count: 5 });
  });

  it('accepts the range boundaries', () => {
    assert.deepEqual(parseDogCommand('!dog 1'), { count: 1 });
    assert.deepEqual(parseDogCommand('!dog 10'), { count: 10 });
  });

  it('falls back to one dog for out-of-range counts', () => {
    assert.deepEqual(parseDogCommand('!dog 0'), { count: DEFAULT_DOGS });
    assert.deepEqual(parseDogCommand('!dog 11'), { count: DEFAULT_DOGS });
    assert.deepEqual(parseDogCommand('!dog 9999'), { count: DEFAULT_DOGS });
  });

  it('treats a trailing space with no number as one dog', () => {
    assert.deepEqual(parseDogCommand('!dog '), { count: DEFAULT_DOGS });
  });

  it('returns null for non-commands and malformed input', () => {
    assert.equal(parseDogCommand('hello'), null);
    assert.equal(parseDogCommand('!dog abc'), null);
    assert.equal(parseDogCommand('!doggy'), null);
    assert.equal(parseDogCommand('!dog 5 5'), null);
    assert.equal(parseDogCommand('  !dog'), null);
    assert.equal(parseDogCommand(undefined), null);
    assert.equal(parseDogCommand(null), null);
    assert.equal(parseDogCommand(42), null);
  });
});
