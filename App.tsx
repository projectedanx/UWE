
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { WordResult, HistoryItem, ConceptNetResponse, WikipediaResponse, SynAntResult, DictionaryApiResponse, DatamuseWord, WordNetResult } from './types';
import { PREFIXES, SUFFIXES, WORD_OF_THE_DAY_LIST } from './constants';
import { fetchConceptNet, fetchWikipediaSections, fetchDictionaryEntry, fetchDatamuseWords, ApiError } from './services/api';
import Panel from './components/Panel';
import WordInfluenceMeter from './components/WordInfluenceMeter';
import ConceptualBlender from './components/ConceptualBlender';
import UnifiedWordTree from './components/UnifiedWordTree';
import Loader, { FullScreenLoader } from './components/Loader';
import { BookOpenIcon, DnaIcon, LinkIcon, ScrollIcon, ShuffleIcon, UsersIcon, SitemapIcon, ShareIcon, ExportIcon } from './components/Icons';
import Chatbot from './components/Chatbot';
import ThinkingMode from './components/ThinkingMode';
import GeminiPanelAnalysis from './components/GeminiPanelAnalysis';
import ComparativeAnalysis from './components/ComparativeAnalysis';

// Define a type for our specific API errors
type ApiErrors = {
  conceptNet?: string;
  wikipedia?: string;
  thesaurus?: string;
  etymology?: string;
  wordNet?: string;
  associations?: string;
};

/**
 * Safely extracts an error message from a caught exception.
 * @param error The caught exception, of type `unknown`.
 * @returns A string representing the error message.
 */
function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'An unknown error occurred. Check the console for details.';
}


function App() {
  const [rootWord, setRootWord] = useState(() => WORD_OF_THE_DAY_LIST[Math.floor(Math.random() * WORD_OF_THE_DAY_LIST.length)]);
  const [morphologyResults, setMorphologyResults] = useState<WordResult[]>([]);
  const [conceptNetResults, setConceptNetResults] = useState<WordResult[]>([]);
  const [wikiSections, setWikiSections] = useState<string[]>([]);
  const [synAntResults, setSynAntResults] = useState<SynAntResult>({ synonyms: [], antonyms: [] });
  const [wordNetResults, setWordNetResults] = useState<WordNetResult>({ synonyms: [], antonyms: [], hypernyms: [] });
  const [associations, setAssociations] = useState<string[]>([]);
  const [etymology, setEtymology] = useState<string | null>(null);
  const [isEtymologyLoading, setIsEtymologyLoading] = useState(false);
  const [isWordNetLoading, setIsWordNetLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [apiErrors, setApiErrors] = useState<ApiErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  
  const exploreWord = useCallback(async (wordToExplore: string) => {
    const word = wordToExplore.trim();
    if (!word) return;
    
    setIsLoading(true);
    setGeneralError(null);
    setApiErrors({});
    setMorphologyResults([]);
    setConceptNetResults([]);
    setWikiSections([]);
    setSynAntResults({ synonyms: [], antonyms: [] });
    setWordNetResults({ synonyms: [], antonyms: [], hypernyms: [] });
    setAssociations([]);
    setEtymology(null);
    setIsEtymologyLoading(true);
    setIsWordNetLoading(true);

    try {
      // Morphology (local generation, guaranteed to succeed)
      const morphResults: WordResult[] = [];
      for (const [pre, { meaning, category }] of Object.entries(PREFIXES)) {
        morphResults.push({ word: pre + word, meaning, type: 'Prefix', category });
      }
      for (const [suf, { meaning, category }] of Object.entries(SUFFIXES)) {
        morphResults.push({ word: word + suf, meaning, type: 'Suffix', category });
      }
      setMorphologyResults(morphResults);

      // Use Promise.allSettled to handle individual API failures gracefully
      const [conceptNetRes, wikiRes, dictionaryRes, wordNetSynRes, wordNetAntRes, wordNetHypRes, associationsRes] = await Promise.allSettled([
        fetchConceptNet(word),
        fetchWikipediaSections(word),
        fetchDictionaryEntry(word),
        fetchDatamuseWords(word, 'rel_syn'),
        fetchDatamuseWords(word, 'rel_ant'),
        fetchDatamuseWords(word, 'rel_gen'),
        fetchDatamuseWords(word, 'rel_trg'),
      ]);
      
      const newApiErrors: ApiErrors = {};

      // Process ConceptNet results
      if (conceptNetRes.status === 'fulfilled') {
        const data = conceptNetRes.value as ConceptNetResponse;
        if (data.edges) {
          setConceptNetResults(data.edges.map(edge => ({
            word: `${edge.start.label} → ${edge.rel.label} → ${edge.end.label}`,
            meaning: edge.surfaceText || `A semantic relation.`,
            type: 'Semantic' as const,
            category: 'ConceptNet'
          })));
        }
      } else {
        console.error("ConceptNet Error:", conceptNetRes.reason);
        newApiErrors.conceptNet = getErrorMessage(conceptNetRes.reason);
      }
      
      // Process Wikipedia results
      if (wikiRes.status === 'fulfilled') {
        const data = wikiRes.value as WikipediaResponse;
        if (data.parse?.sections) {
          setWikiSections(data.parse.sections.map(s => s.line));
        }
      } else {
        console.error("Wikipedia Error:", wikiRes.reason);
        newApiErrors.wikipedia = getErrorMessage(wikiRes.reason);
      }
      
      // Process Dictionary API results for both etymology and synonyms/antonyms
      if (dictionaryRes.status === 'fulfilled') {
        const data = dictionaryRes.value as DictionaryApiResponse[];
        const etymologyEntry = data?.find(entry => entry.origin);
        setEtymology(etymologyEntry?.origin || null);

        const allSynonyms = new Set<string>();
        const allAntonyms = new Set<string>();
        data?.forEach(entry => {
          entry.meanings?.forEach(meaning => {
            meaning.synonyms?.forEach(syn => allSynonyms.add(syn));
            meaning.antonyms?.forEach(ant => allAntonyms.add(ant));
          });
        });
        setSynAntResults({ synonyms: Array.from(allSynonyms), antonyms: Array.from(allAntonyms) });
      } else {
        const reason = dictionaryRes.reason;
        console.error("Dictionary/Thesaurus Error:", reason);
        if (reason instanceof ApiError && reason.status === 404) {
          newApiErrors.etymology = `No dictionary entry found for "${word}".`;
          newApiErrors.thesaurus = `No dictionary entry found for "${word}".`;
        } else {
          const errorMessage = getErrorMessage(reason);
          newApiErrors.etymology = errorMessage;
          newApiErrors.thesaurus = errorMessage;
        }
      }
      setIsEtymologyLoading(false);

      // Process WordNet (Datamuse) results
      const wordNetSynonyms = wordNetSynRes.status === 'fulfilled' ? (wordNetSynRes.value as DatamuseWord[]).map(w => w.word) : [];
      const wordNetAntonyms = wordNetAntRes.status === 'fulfilled' ? (wordNetAntRes.value as DatamuseWord[]).map(w => w.word) : [];
      const wordNetHypernyms = wordNetHypRes.status === 'fulfilled' ? (wordNetHypRes.value as DatamuseWord[]).map(w => w.word) : [];
      
      const rejectedWordNetRes = [wordNetSynRes, wordNetAntRes, wordNetHypRes].find(res => res.status === 'rejected');
      if(rejectedWordNetRes && rejectedWordNetRes.status === 'rejected') {
         const wordNetErrorReason = rejectedWordNetRes.reason;
         console.error("WordNet/Datamuse Error:", wordNetErrorReason);
         newApiErrors.wordNet = getErrorMessage(wordNetErrorReason);
      }
      setWordNetResults({ synonyms: wordNetSynonyms, antonyms: wordNetAntonyms, hypernyms: wordNetHypernyms });
      setIsWordNetLoading(false);

      // Process Associations results
      if (associationsRes.status === 'fulfilled') {
          setAssociations((associationsRes.value as DatamuseWord[]).map(w => w.word));
      } else {
          console.error("Associations/Datamuse Error:", associationsRes.reason);
          newApiErrors.associations = getErrorMessage(associationsRes.reason);
      }

      setApiErrors(newApiErrors);

      // Update history
      setHistory(prev => [{ root: word, date: new Date().toISOString() }, ...prev.slice(0, 9)]);

    } catch (e) {
      console.error("A critical error occurred during the explore word process:", e);
      setGeneralError("An unexpected error occurred. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initialLoadDone = useRef(false);
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      exploreWord(rootWord).finally(() => {
        setIsInitialLoading(false);
      });
    }
  }, [exploreWord, rootWord]);
  
  const handleExport = (format: 'json' | 'markdown') => {
    const dataToExport = {
      rootWord,
      exploredAt: new Date().toISOString(),
      morphology: morphologyResults,
      conceptNet: conceptNetResults,
      wikipediaSubtopics: wikiSections,
      dictionary: synAntResults,
      wordNet: wordNetResults,
      associations,
      etymology,
    };

    let fileContent: string;
    let fileType: string;
    let fileExtension: string;

    if (format === 'json') {
      fileContent = JSON.stringify(dataToExport, null, 2);
      fileType = 'application/json';
      fileExtension = 'json';
    } else {
      let md = `# Word Exploration: "${rootWord}"\n\n`;
      md += `*Exported on: ${new Date(dataToExport.exploredAt).toLocaleString()}*\n\n`;
      
      if (dataToExport.etymology) md += `## Etymology & Origin\n${dataToExport.etymology}\n\n`;
      
      if (dataToExport.morphology.length > 0) {
        md += `## Morphology\n`;
        dataToExport.morphology.forEach(item => {
          md += `- **${item.word}** (*${item.type}*): ${item.meaning}\n`;
        });
        md += `\n`;
      }
      
      if (dataToExport.dictionary.synonyms.length > 0) {
        md += `## Synonyms (Dictionary)\n- ${dataToExport.dictionary.synonyms.join(', ')}\n\n`;
      }
       if (dataToExport.dictionary.antonyms.length > 0) {
        md += `## Antonyms (Dictionary)\n- ${dataToExport.dictionary.antonyms.join(', ')}\n\n`;
      }

      if (dataToExport.wordNet.synonyms.length > 0 || dataToExport.wordNet.antonyms.length > 0 || dataToExport.wordNet.hypernyms.length > 0) {
        md += `## WordNet Relationships\n`;
        if (dataToExport.wordNet.synonyms.length > 0) md += `- **Synonyms**: ${dataToExport.wordNet.synonyms.join(', ')}\n`;
        if (dataToExport.wordNet.antonyms.length > 0) md += `- **Antonyms**: ${dataToExport.wordNet.antonyms.join(', ')}\n`;
        if (dataToExport.wordNet.hypernyms.length > 0) md += `- **Hypernyms**: ${dataToExport.wordNet.hypernyms.join(', ')}\n`;
        md += `\n`;
      }
      
      if (dataToExport.associations.length > 0) {
        md += `## Word Associations\n- ${dataToExport.associations.join(', ')}\n\n`;
      }
      
      if (dataToExport.conceptNet.length > 0) {
        md += `## Semantic Relationships (ConceptNet)\n`;
        dataToExport.conceptNet.forEach(item => {
          md += `- \`${item.word}\`\n`;
        });
        md += `\n`;
      }

       if (dataToExport.wikipediaSubtopics.length > 0) {
        md += `## Wikipedia Subtopics\n`;
        dataToExport.wikipediaSubtopics.forEach(item => {
          md += `1. ${item}\n`;
        });
        md += `\n`;
      }

      fileContent = md;
      fileType = 'text/markdown';
      fileExtension = 'md';
    }
    
    const blob = new Blob([fileContent], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rootWord}-exploration.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  if (isInitialLoading) {
    return <FullScreenLoader text={`Exploring "${rootWord}" for you...`} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Unified Word Explorer
          </h1>
          <p className="mt-2 text-lg text-slate-400">A dashboard for deep linguistic analysis</p>
        </header>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 sticky top-4 z-10 bg-slate-900/80 backdrop-blur-sm p-4 rounded-lg border border-slate-700">
          <input
            type="text"
            value={rootWord}
            onChange={(e) => setRootWord(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && exploreWord(rootWord)}
            placeholder="Enter a root word..."
            className="flex-grow bg-slate-800 border border-slate-600 rounded-md px-4 py-3 text-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          />
          <button
            onClick={() => exploreWord(rootWord)}
            disabled={isLoading}
            className="flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-md transition duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader /> : 'Explore Word'}
          </button>
          <div className="flex gap-2">
            <button onClick={() => handleExport('json')} className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 px-4 rounded-md transition duration-300">
              <ExportIcon /> JSON
            </button>
             <button onClick={() => handleExport('markdown')} className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 px-4 rounded-md transition duration-300">
              <ExportIcon /> Markdown
            </button>
          </div>
        </div>
        
        {generalError && <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md mb-6">{generalError}</div>}

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Panel title="Unified Word Tree Visualization" defaultOpen tooltip="A visual hierarchy of all data gathered for the word.">
              <UnifiedWordTree 
                root={rootWord}
                morphologyResults={morphologyResults}
                conceptNetResults={conceptNetResults}
                wikiSections={wikiSections}
                synAntResults={synAntResults}
                wordNetResults={wordNetResults}
                associations={associations}
                etymology={etymology}
                isLoading={isLoading}
              />
            </Panel>
            <Panel title="Morphology (Prefixes & Suffixes)" icon={<DnaIcon/>} tooltip="Explore prefixes and suffixes.">
              <WordList results={morphologyResults} />
              <GeminiPanelAnalysis
                rootWord={rootWord}
                data={morphologyResults}
                promptTemplate={(data) => `Analyze the morphological patterns in the following words related to '${rootWord}':\n${data}\n\nExplain how the prefixes and suffixes change the meaning of the root word.`}
                buttonText="Analyze Patterns with Gemini"
              />
            </Panel>
            <Panel title="Semantic Relationships (ConceptNet)" icon={<LinkIcon/>} tooltip="Discover semantic relationships from the ConceptNet graph.">
              <WordList results={conceptNetResults} error={apiErrors.conceptNet} />
              <GeminiPanelAnalysis
                rootWord={rootWord}
                data={conceptNetResults}
                promptTemplate={(data) => `Analyze the following semantic relationships for the word '${rootWord}' from ConceptNet:\n\n${data}\n\nSummarize the key roles and connections this word has based on these relationships. What kind of entity or concept does it appear to be?`}
                buttonText="Analyze Semantics with Gemini"
              />
            </Panel>
          </div>
          <div className="lg:col-span-1 space-y-6">
             <Panel title="Synonyms & Antonyms (from Dictionary)" icon={<ShuffleIcon/>} tooltip="Find words with similar or opposite meanings from a dictionary.">
              {apiErrors.thesaurus ? <ErrorMessage message={apiErrors.thesaurus} /> : (
                <div>
                  <h3 className="font-bold text-lg text-cyan-300 mb-2">Synonyms</h3>
                  {synAntResults.synonyms.length > 0 ? (
                    <ul className="list-disc list-inside text-slate-300 space-y-1">
                      {synAntResults.synonyms.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  ) : <p className="text-slate-400">No synonyms found.</p>}
                  
                  <h3 className="font-bold text-lg text-purple-300 mt-4 mb-2">Antonyms</h3>
                  {synAntResults.antonyms.length > 0 ? (
                    <ul className="list-disc list-inside text-slate-300 space-y-1">
                      {synAntResults.antonyms.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                   ) : <p className="text-slate-400">No antonyms found.</p>}
                </div>
              )}
              <GeminiPanelAnalysis
                rootWord={rootWord}
                data={
                    (synAntResults.synonyms.length > 0 || synAntResults.antonyms.length > 0) 
                    ? `Synonyms: ${synAntResults.synonyms.join(', ') || 'N/A'}\nAntonyms: ${synAntResults.antonyms.join(', ') || 'N/A'}`
                    : ""
                }
                promptTemplate={(data) => `Analyze the provided synonyms and antonyms for the root word "${rootWord}":\n\n${data}\n\nDiscuss the nuances between the synonyms. Explain how the antonyms create a clear contrast. Provide insights into the word's overall lexical field.`}
                buttonText="Analyze Lexicon with Gemini"
              />
            </Panel>
             <Panel title="WordNet Relationships" icon={<SitemapIcon/>} tooltip="Explore lexical data (synonyms, antonyms, hypernyms) from WordNet.">
                {isWordNetLoading ? <div className="flex justify-center items-center h-20"><Loader /></div> : apiErrors.wordNet ? <ErrorMessage message={apiErrors.wordNet} /> : (
                  <div>
                    <h3 className="font-bold text-lg text-cyan-300 mb-2">Synonyms</h3>
                    {wordNetResults.synonyms.length > 0 ? <ul className="list-disc list-inside text-slate-300 space-y-1">{wordNetResults.synonyms.map((s, i) => <li key={i}>{s}</li>)}</ul> : <p className="text-slate-400">No synonyms found.</p>}
                    <h3 className="font-bold text-lg text-purple-300 mt-4 mb-2">Antonyms</h3>
                    {wordNetResults.antonyms.length > 0 ? <ul className="list-disc list-inside text-slate-300 space-y-1">{wordNetResults.antonyms.map((a, i) => <li key={i}>{a}</li>)}</ul> : <p className="text-slate-400">No antonyms found.</p>}
                    <h3 className="font-bold text-lg text-yellow-300 mt-4 mb-2">Hypernyms (Broader Concepts)</h3>
                    {wordNetResults.hypernyms.length > 0 ? <ul className="list-disc list-inside text-slate-300 space-y-1">{wordNetResults.hypernyms.map((h, i) => <li key={i}>{h}</li>)}</ul> : <p className="text-slate-400">No hypernyms found.</p>}
                  </div>
                )}
                 <GeminiPanelAnalysis
                    rootWord={rootWord}
                    data={
                        (wordNetResults.synonyms.length > 0 || wordNetResults.antonyms.length > 0 || wordNetResults.hypernyms.length > 0)
                        ? `Synonyms: ${wordNetResults.synonyms.join(', ') || 'N/A'}\nAntonyms: ${wordNetResults.antonyms.join(', ') || 'N/A'}\nHypernyms: ${wordNetResults.hypernyms.join(', ') || 'N/A'}`
                        : ""
                    }
                    promptTemplate={(data) => `Analyze the following WordNet relationships for '${rootWord}':\n\n${data}\n\nExplain how these words define the semantic space of the root word. What do the hypernyms tell us about its classification and abstract category?`}
                    buttonText="Analyze Relationships with Gemini"
                />
             </Panel>
             <Panel title="Word Associations" icon={<ShareIcon/>} tooltip="See words commonly used together with the root word.">
                {apiErrors.associations ? <ErrorMessage message={apiErrors.associations} /> : (
                    associations.length > 0 ? (
                        <ul className="list-disc list-inside text-slate-300 space-y-1">
                            {associations.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    ) : <p className="text-slate-400">No associations found.</p>
                )}
                <GeminiPanelAnalysis
                    rootWord={rootWord}
                    data={associations}
                    promptTemplate={(data) => `Given the root word '${rootWord}' and its common associations: ${data}, write three distinct example sentences that demonstrate the typical contexts in which '${rootWord}' is used with these associated words.`}
                    buttonText="Generate Examples with Gemini"
                />
            </Panel>
             <Panel title="Etymology & Origin" icon={<ScrollIcon/>} tooltip="Uncover the historical origin and evolution of the word.">
               {isEtymologyLoading ? (
                 <div className="flex justify-center items-center h-20">
                   <Loader />
                 </div>
               ) : apiErrors.etymology ? (
                 <ErrorMessage message={apiErrors.etymology} />
               ) : etymology ? (
                 <p className="text-slate-300 italic leading-relaxed">{etymology}</p>
               ) : (
                 <p className="text-slate-400">No etymology information found for this word.</p>
               )}
                <GeminiPanelAnalysis
                    rootWord={rootWord}
                    data={etymology}
                    promptTemplate={(data) => `Elaborate on the etymology of the word '${rootWord}'. Here is the known origin: ${data}. Provide more historical context, related words that share the same root, and explain how its meaning might have evolved over time.`}
                    buttonText="Elaborate with Gemini"
                />
            </Panel>
            <Panel title="Wikipedia Subtopics" icon={<BookOpenIcon/>} tooltip="View the table of contents from the word's Wikipedia page.">
              {apiErrors.wikipedia ? <ErrorMessage message={apiErrors.wikipedia} /> : (
                wikiSections.length > 0 ? (
                  <ul className="list-decimal list-inside text-slate-300 space-y-1">
                    {wikiSections.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                ) : <p className="text-slate-400">No subtopics found for this word.</p>
              )}
              <GeminiPanelAnalysis
                    rootWord={rootWord}
                    data={wikiSections}
                    promptTemplate={(data) => `Based on the following Wikipedia subtopics for the word '${rootWord}', provide a concise summary of what the article is likely about:\n\n${data}\n\nWhat are the key themes and areas of knowledge covered?`}
                    buttonText="Summarize with Gemini"
                />
            </Panel>
             <Panel title="Search History" icon={<UsersIcon/>} tooltip="Your recent explorations.">
              {history.length > 0 ? (
                <>
                  <ul className="space-y-1">
                    {history.map((h, i) => (
                       <li key={i}>
                         <button 
                           onClick={() => { setRootWord(h.root); exploreWord(h.root); }}
                           className="w-full text-left flex justify-between items-center text-slate-400 hover:text-cyan-400 transition rounded-md -m-1 p-1 hover:bg-slate-700/50"
                         >
                           <span>{h.root}</span>
                           <span className="text-xs text-slate-500">{new Date(h.date).toLocaleTimeString()}</span>
                         </button>
                       </li>
                    ))}
                  </ul>
                  <div className="mt-4 border-t border-slate-700 pt-2 flex justify-end">
                    <button
                      onClick={() => setHistory([])}
                      className="text-xs text-slate-500 hover:text-red-400 transition"
                    >
                      Clear History
                    </button>
                  </div>
                </>
              ) : <p className="text-slate-400">Your search history will appear here.</p>}
            </Panel>
          </div>
           <div className="lg:col-span-3">
             <ConceptualBlender />
           </div>
           <div className="lg:col-span-3">
             <WordInfluenceMeter />
           </div>
           <div className="lg:col-span-3">
             <ThinkingMode />
           </div>
           <div className="lg:col-span-3">
              <Chatbot />
           </div>
           <div className="lg:col-span-3">
              <ComparativeAnalysis />
           </div>
        </main>
      </div>
    </div>
  );
}

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-red-300 bg-red-900/30 p-3 rounded-md border border-red-700/50">
    {message}
  </div>
);

const WordList = React.memo(({ results, error }: { results: WordResult[]; error?: string | null }) => {
  if (error) {
    return <ErrorMessage message={error} />;
  }
  if (!results.length) {
    return <p className="text-slate-400">No results to display. Enter a term and click Explore.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left table-auto">
        <thead className="bg-slate-700/50 text-slate-300">
          <tr>
            <th className="p-3">Word / Relation</th>
            <th className="p-3">Type</th>
            <th className="p-3">Category</th>
            <th className="p-3">Meaning / Context</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i} className="border-b border-slate-700 hover:bg-slate-800/50">
              <td className="p-3 font-mono text-cyan-300">{r.word}</td>
              <td className="p-3">{r.type}</td>
              <td className="p-3"><span className="bg-slate-700 px-2 py-1 rounded-full text-xs">{r.category}</span></td>
              <td className="p-3 text-slate-400">{r.meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default App;
