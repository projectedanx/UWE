import { ConceptNetResponse, WikipediaResponse, DictionaryApiResponse, DatamuseWord } from '../types';

// Custom error class for API responses that can be identified by consumers
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Generic, robust fetch helper
const fetchJson = async <T>(url: string): Promise<T> => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new ApiError(`API request failed with status ${res.status}`, res.status);
    }
    const text = await res.text();
    // Handle cases where APIs return empty strings for no results
    if (!text) {
        // We can throw a specific error or return a default value.
        // For this app, an empty array is a safe default for list-based APIs.
        // We will let the specific functions handle this if needed.
        // Here we throw to be explicit that the response was unexpected.
        throw new Error('Received an empty response from the API.');
    }
    try {
      return JSON.parse(text) as T;
    } catch (e) {
      throw new Error('Failed to parse a valid JSON response from the API.');
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error; // Re-throw our custom error
    }
    // Catch network errors from fetch itself
    throw new Error('A network error occurred. Please check your connection.');
  }
};

/**
 * Fetches semantic relationship data from ConceptNet.
 */
export const fetchConceptNet = (word: string) => {
  return fetchJson<ConceptNetResponse>(`https://api.conceptnet.io/query?node=/c/en/${word.toLowerCase()}&limit=10`);
};

/**
 * Fetches the table of contents (sections) for a Wikipedia article.
 * Handles API-level errors returned in a 200 OK response.
 */
export const fetchWikipediaSections = async (word: string) => {
  const data = await fetchJson<WikipediaResponse>(`https://en.wikipedia.org/w/api.php?action=parse&page=${word}&prop=sections&format=json&origin=*`);
  // Wikipedia API can return a 200 OK with an error object if the page doesn't exist.
  if (data.error) {
    throw new Error(`Wikipedia: ${data.error.info}`);
  }
  return data;
};

/**
 * Fetches dictionary entries, including definitions, etymology, and lexical data.
 */
export const fetchDictionaryEntry = (word: string) => {
  return fetchJson<DictionaryApiResponse[]>(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
};

export type DatamuseRelation = 'rel_syn' | 'rel_ant' | 'rel_gen' | 'rel_trg';
/**
 * Fetches WordNet-like data from the Datamuse API.
 * 'rel_trg' = triggers (strongly associated words)
 */
export const fetchDatamuseWords = (word: string, relation: DatamuseRelation) => {
  return fetchJson<DatamuseWord[]>(`https://api.datamuse.com/words?${relation}=${word}&max=10`);
};