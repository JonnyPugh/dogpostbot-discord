import axios from 'axios';

/**
 * dog.ceo's random image endpoint. `GET <base>/<n>` returns an array of image
 * URLs, while `GET <base>` returns a single URL string.
 */
export const DOG_API_BASE_URL = 'https://dog.ceo/api/breeds/image/random';

/**
 * Fetch a random set of dog image URLs.
 *
 * @param {number} count How many images to request.
 * @param {{
 *   http?: { get: (url: string) => Promise<{ data: unknown }> },
 *   baseUrl?: string,
 * }} [options] `http` defaults to axios and `baseUrl` to the real dog.ceo
 *   endpoint. Both are injectable so tests can substitute a mock server.
 * @returns {Promise<string[]>} Image URLs (always an array, possibly empty).
 */
export async function fetchDogImages(count, { http = axios, baseUrl = DOG_API_BASE_URL } = {}) {
  const { data } = await http.get(`${baseUrl}/${count}`);
  const message = data?.message;

  if (typeof message === 'string') {
    return [message];
  }

  return Array.isArray(message) ? message : [];
}
