export const PREFIXES: { [key: string]: { meaning: string; category: string } } = {
  bio: { meaning: "life, biological", category: "Scientific" },
  co: { meaning: "together, joint", category: "Cooperative" },
  counter: { meaning: "against, opposite", category: "Oppositional" },
  inter: { meaning: "between", category: "Relational" },
  mis: { meaning: "wrong, incorrect", category: "Error/Negative" },
  news: { meaning: "related to news", category: "Commerce" },
  re: { meaning: "again, back", category: "Scientific" },
  sub: { meaning: "under, secondary", category: "Legal/Business" },
  super: { meaning: "above, great", category: "Colloquial" },
  under: { meaning: "beneath, lower", category: "Legal/Business" },
  secret: { meaning: "hidden, covert", category: "Espionage" },
  double: { meaning: "two, dual", category: "Espionage" },
  special: { meaning: "specific, unique", category: "Law Enforcement" }
};

export const SUFFIXES: { [key: string]: { meaning: string; category: string } } = {
  cy: { meaning: "state or quality (agency)", category: "Abstract" },
  ive: { meaning: "having the nature of (agentive)", category: "Descriptive" },
  hood: { meaning: "state of being (agenthood)", category: "Abstract" }
};

export const WORD_OF_THE_DAY_LIST: string[] = [
  'ephemeral', 'sonder', 'eloquence', 'ineffable', 'petrichor',
  'serendipity', 'limerence', 'mellifluous', 'hiraeth', 'nefarious',
  'solitude', 'aurora', 'syzygy', 'phosphene', 'oblivion',
  'ethereal', 'iridescent', 'denouement', 'lagniappe', 'nadir'
];