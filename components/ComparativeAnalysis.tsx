
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import Panel from './Panel';
import Loader from './Loader';
import { CompareIcon } from './Icons';
import { fetchConceptNet, fetchDictionaryEntry, fetchDatamuseWords, ApiError } from '../services/api';
import { PREFIXES, SUFFIXES } from '../constants';
import { WordResult, SynAntResult, ConceptNetResponse, DictionaryApiResponse, DatamuseWord } from '../types';

interface ComparativeAnalysisProps {}

type WordData = {
  morphology: WordResult[];
  synonyms: string[];
  antonyms: string[];
  conceptNet: WordResult[];
  etymology: string | null;
};

// Helper to safely get error message from unknown
function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'An unknown error occurred. Check console.';
}

const ComparativeAnalysis: React.FC<ComparativeAnalysisProps> = () => {
  const [wordA, setWordA] = useState('');
  const [wordB, setWordB] = useState('');
  const [comparisonAnalysis, setComparisonAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWordData = async (word: string): Promise<WordData | null> => {
    if (!word) return null;

    const morphology: WordResult[] = [];
    for (const [pre, { meaning, category }] of Object.entries(PREFIXES)) {
      morphology.push({ word: pre + word, meaning, type: 'Prefix', category });
    }
    for (const [suf, { meaning, category }] of Object.entries(SUFFIXES)) {
      morphology.push({ word: word + suf, meaning, type: 'Suffix', category });
    }

    const [conceptNetRes, dictionaryRes, synRes, antRes] = await Promise.allSettled([
      fetchConceptNet(word),
      fetchDictionaryEntry(word),
      fetchDatamuseWords(word, 'rel_syn'),
      fetchDatamuseWords(word, 'rel_ant'),
    ]);

    let conceptNetResults: WordResult[] = [];
    if (conceptNetRes.status === 'fulfilled') {
      const data = conceptNetRes.value as ConceptNetResponse;
      conceptNetResults = data.edges?.map(edge => ({
        word: `${edge.start.label} → ${edge.rel.label} → ${edge.end.label}`,
        meaning: edge.surfaceText || `A semantic relation.`,
        type: 'Semantic' as const,
        category: 'ConceptNet'
      })) || [];
    }

    let synonyms: string[] = [];
    let antonyms: string[] = [];
    let etymology: string | null = null;

    if (dictionaryRes.status === 'fulfilled') {
      const data = dictionaryRes.value as DictionaryApiResponse[];
      etymology = data?.[0]?.origin || null;
      data?.forEach(entry => {
        entry.meanings?.forEach(meaning => {
          meaning.synonyms?.forEach(syn => synonyms.push(syn));
          meaning.antonyms?.forEach(ant => antonyms.push(ant));
        });
      });
    }

    if (synRes.status === 'fulfilled') {
      synonyms = [...new Set([...synonyms, ...(synRes.value as DatamuseWord[]).map(w => w.word)])];
    }
    if (antRes.status === 'fulfilled') {
      antonyms = [...new Set([...antonyms, ...(antRes.value as DatamuseWord[]).map(w => w.word)])];
    }

    return {
      morphology,
      synonyms,
      antonyms,
      conceptNet: conceptNetResults,
      etymology,
    };
  };

  const handleCompare = async () => {
    if (!wordA.trim() || !wordB.trim()) {
      setError('Please enter both words to compare.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setComparisonAnalysis(null);

    try {
      const [dataA, dataB] = await Promise.all([
        fetchWordData(wordA),
        fetchWordData(wordB)
      ]);

      if (!dataA || !dataB) {
        setError('Could not retrieve sufficient data for one or both words.');
        return;
      }

      const formatWordData = (wordName: string, data: WordData) => {
        let formatted = `\n### Data for "${wordName}"\n`;
        formatted += `**Etymology:** ${data.etymology || 'N/A'}\n`;
        formatted += `**Morphology:** ${data.morphology.map(m => m.word).join(', ') || 'N/A'}\n`;
        formatted += `**Synonyms:** ${data.synonyms.join(', ') || 'N/A'}\n`;
        formatted += `**Antonyms:** ${data.antonyms.join(', ') || 'N/A'}\n`;
        formatted += `**ConceptNet Relations:**\n`;
        if (data.conceptNet.length > 0) {
          formatted += data.conceptNet.map(cn => `- ${cn.word}`).join('\n');
        } else {
          formatted += 'N/A';
        }
        return formatted;
      };

      const prompt = `Perform a comprehensive comparative analysis of the two words: "${wordA}" and "${wordB}".
      
${formatWordData(wordA, dataA)}

${formatWordData(wordB, dataB)}

Based on the provided data, highlight the key similarities and differences in their:
1.  **Etymology/Origin** (if available)
2.  **Morphological patterns** (common prefixes/suffixes)
3.  **Lexical field** (synonyms, antonyms)
4.  **Semantic relationships** (ConceptNet entries)

Conclude with an overall statement on their relationship or distinct uses. Ensure your analysis is detailed and well-reasoned.`;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro', // Using a more powerful model for comparative analysis
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 16384 }, // A reasonable budget for complex comparison
        },
      });

      setComparisonAnalysis(response.text);

    } catch (err: unknown) {
      console.error("Comparative Analysis Error:", err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Panel title="⚖️ Comparative Analysis (Gemini Powered)" defaultOpen icon={<CompareIcon />} tooltip="Compare two words side-by-side using Gemini to find similarities and differences.">
      <p className="text-slate-400 mb-4 text-sm">
        Enter two words to get a Gemini-powered comparative analysis of their morphology, lexical fields, semantic relationships, and etymology.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Enter Word A"
          value={wordA}
          onChange={(e) => setWordA(e.target.value)}
          className="bg-slate-800 border border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          disabled={isLoading}
        />
        <input
          type="text"
          placeholder="Enter Word B"
          value={wordB}
          onChange={(e) => setWordB(e.target.value)}
          className="bg-slate-800 border border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          disabled={isLoading}
        />
      </div>
      <button
        onClick={handleCompare}
        disabled={isLoading || !wordA.trim() || !wordB.trim()}
        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader />
            <span>Comparing...</span>
          </>
        ) : 'Compare Words with Gemini'}
      </button>

      {error && <p className="mt-4 text-red-400">{error}</p>}

      {comparisonAnalysis && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2 text-orange-300">Gemini's Comparative Analysis:</h3>
          <div className="bg-slate-900/50 p-4 rounded-md border border-slate-700">
            <pre className="text-slate-200 whitespace-pre-wrap font-sans">{comparisonAnalysis}</pre>
          </div>
        </div>
      )}
    </Panel>
  );
};

export default ComparativeAnalysis;
