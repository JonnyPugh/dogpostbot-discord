import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { fetchDogImages, DOG_API_BASE_URL } from '../../src/dogService.js';

/** A fake axios-like client that records the URL it was asked for. */
function fakeHttp(response, calls = []) {
  return {
    calls,
    async get(url) {
      calls.push(url);
      return response;
    },
  };
}

describe('fetchDogImages', () => {
  it('requests the expected URL for the given count', async () => {
    const http = fakeHttp({ data: { message: [] } });
    await fetchDogImages(3, { http });
    assert.deepEqual(http.calls, [`${DOG_API_BASE_URL}/3`]);
  });

  it('returns the array of image URLs', async () => {
    const images = ['https://example.com/a.jpg', 'https://example.com/b.jpg'];
    const http = fakeHttp({ data: { message: images } });
    assert.deepEqual(await fetchDogImages(2, { http }), images);
  });

  it('wraps a single URL string in an array', async () => {
    const http = fakeHttp({ data: { message: 'https://example.com/one.jpg' } });
    assert.deepEqual(await fetchDogImages(1, { http }), ['https://example.com/one.jpg']);
  });

  it('honours a custom base URL', async () => {
    const http = fakeHttp({ data: { message: [] } });
    await fetchDogImages(2, { http, baseUrl: 'http://localhost:1234/dogs' });
    assert.deepEqual(http.calls, ['http://localhost:1234/dogs/2']);
  });

  it('returns an empty array for unexpected payloads', async () => {
    assert.deepEqual(await fetchDogImages(1, { http: fakeHttp({ data: {} }) }), []);
    assert.deepEqual(await fetchDogImages(1, { http: fakeHttp({ data: null }) }), []);
    assert.deepEqual(await fetchDogImages(1, { http: fakeHttp({ data: { message: 5 } }) }), []);
  });
});
