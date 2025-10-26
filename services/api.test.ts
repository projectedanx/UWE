
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { fetchConceptNet, fetchWikipediaSections, fetchDictionaryEntry, fetchDatamuseWords, ApiError } from './api';
import type { ConceptNetResponse, WikipediaResponse, DictionaryApiResponse, DatamuseWord } from '../types';

global.fetch = vi.fn();

const createFetchResponse = (data: any, ok = true, status = 200) => {
  return {
    ok,
    status,
    json: () => new Promise((resolve) => resolve(data)),
    text: () => new Promise((resolve) => resolve(JSON.stringify(data))),
  } as unknown as Response;
};

const createFetchError = (ok = false, status = 500) => {
    return {
      ok,
      status,
      json: () => new Promise((_, reject) => reject(new Error('API error'))),
      text: () => new Promise((_, reject) => reject(new Error('API error'))),
    } as unknown as Response;
  };

describe('API Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchJson', () => {
    it('should return JSON data on successful fetch', async () => {
      const mockData = { message: 'Success' };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(createFetchResponse(mockData));

      const data = await fetchConceptNet('test');
      expect(data).toEqual(mockData);
    });

    it('should throw ApiError for non-OK responses', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(createFetchError(false, 404));

      await expect(fetchConceptNet('test')).rejects.toThrow(ApiError);
      await expect(fetchConceptNet('test')).rejects.toMatchObject({ status: 404 });
    });

    it('should throw an error for empty responses', async () => {
        (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
            ok: true,
            status: 200,
            text: () => Promise.resolve(''),
          } as Response);

        await expect(fetchConceptNet('test')).rejects.toThrow('Received an empty response from the API.');
      });

    it('should throw an error for invalid JSON', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve('invalid json'),
      } as Response);

      await expect(fetchConceptNet('test')).rejects.toThrow('Failed to parse a valid JSON response from the API.');
    });

    it('should throw an error for network failures', async () => {
      (fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      await expect(fetchConceptNet('test')).rejects.toThrow('A network error occurred. Please check your connection.');
    });
  });

  describe('fetchWikipediaSections', () => {
    it('should throw an error if the Wikipedia API returns an error object', async () => {
      const mockErrorResponse: WikipediaResponse = {
        error: { code: 'missingtitle', info: 'The page you specified doesn\'t exist.' },
        parse: {
            title: '',
            pageid: 0,
            sections: []
        }
      };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(createFetchResponse(mockErrorResponse));

      await expect(fetchWikipediaSections('nonexistentpage')).rejects.toThrow('Wikipedia: The page you specified doesn\'t exist.');
    });
  });
});
