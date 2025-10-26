
export interface WordResult {
  word: string;
  meaning: string;
  type: 'Prefix' | 'Suffix' | 'Semantic';
  category: string;
}

export interface HistoryItem {
  root: string;
  date: string;
}

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

export interface ConceptNetResponse {
  edges: ConceptNetEdge[];
}

export interface WikipediaSection {
  line: string;
  level: string;
}

export interface WikipediaParse {
  sections: WikipediaSection[];
}

export interface WikipediaResponse {
  parse?: WikipediaParse;
  error?: {
      code: string;
      info: string;
  }
}

export interface ThesaurusResponse {
  word: string;
  synonyms: string[];
  antonyms: string[];
}

export interface SynAntResult {
  synonyms: string[];
  antonyms: string[];
}

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

export interface DatamuseWord {
    word: string;
    score: number;
}

export interface WordNetResult {
    synonyms: string[];
    antonyms: string[];
    hypernyms: string[];
}
