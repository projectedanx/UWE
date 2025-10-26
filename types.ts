
/**
 * Represents a generic word result from various sources.
 */
export interface WordResult {
  word: string;
  meaning: string;
  type: 'Prefix' | 'Suffix' | 'Semantic';
  category: string;
}

/**
 * Represents an item in the search history.
 */
export interface HistoryItem {
  root: string;
  date: string;
}

/**
 * Represents an edge in the ConceptNet graph.
 */
export interface ConceptNetEdge {
  '@id': string;
  rel: {
    '@id': string;
    label: string;
  };
  start: {
    '@id': string;
    label: string;
    language: string;
  };
  end: {
    '@id': string;
    label: string;
    language: string;
  };
  surfaceText?: string;
}

/**
 * Represents the response from the ConceptNet API.
 */
export interface ConceptNetResponse {
  edges: ConceptNetEdge[];
}

/**
 * Represents a section in a Wikipedia article.
 */
export interface WikipediaSection {
  line: string;
  level: string;
}

/**
 * Represents the parsed content of a Wikipedia article.
 */
export interface WikipediaParse {
  sections: WikipediaSection[];
}

/**
 * Represents the response from the Wikipedia API.
 */
export interface WikipediaResponse {
  parse?: WikipediaParse;
  error?: {
      code: string;
      info: string;
  }
}

/**
 * Represents the response from a thesaurus API.
 */
export interface ThesaurusResponse {
  word: string;
  synonyms: string[];
  antonyms: string[];
}

/**
 * Represents the result of a synonym/antonym lookup.
 */
export interface SynAntResult {
  synonyms: string[];
  antonyms: string[];
}

/**
 * Represents the response from the Dictionary API.
 */
export interface DictionaryApiResponse {
  word: string;
  origin?: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
    synonyms?: string[];
    antonyms?: string[];
  }[];
}

/**
 * Represents a word from the Datamuse API.
 */
export interface DatamuseWord {
    word: string;
    score: number;
}

/**
 * Represents the result of a WordNet lookup.
 */
export interface WordNetResult {
    synonyms: string[];
    antonyms: string[];
    hypernyms: string[];
}

/**
 * Represents a single todo item.
 */
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}
