import React, { useState, useEffect } from 'react';
import { WordResult, SynAntResult, WordNetResult } from '../types';

interface UnifiedWordTreeProps {
  root: string;
  morphologyResults: WordResult[];
  conceptNetResults: WordResult[];
  wikiSections: string[];
  synAntResults: SynAntResult;
  wordNetResults: WordNetResult;
  associations: string[];
  isLoading: boolean;
}

const colors = {
  root: 'text-green-400',
  morphology: 'text-blue-400',
  conceptnet: 'text-orange-400',
  wikipedia: 'text-purple-400',
  synonym: 'text-teal-400',
  antonym: 'text-red-400',
  wordnet: 'text-yellow-400',
  associations: 'text-pink-400'
};

const WordTreeSkeleton: React.FC = () => (
  <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm animate-pulse h-64">
    <div className="h-6 bg-slate-700 rounded w-1/3 mb-2"></div>
    <div className="pl-4 border-l border-slate-600 space-y-3">
      <div className="h-4 bg-slate-700 rounded w-1/4"></div>
      <div className="pl-8 space-y-2">
        <div className="h-3 bg-slate-700 rounded w-2/3"></div>
        <div className="h-3 bg-slate-700 rounded w-1/2"></div>
      </div>
      <div className="h-4 bg-slate-700 rounded w-1/5 mt-3"></div>
      <div className="pl-8 space-y-2">
        <div className="h-3 bg-slate-700 rounded w-3/4"></div>
      </div>
      <div className="h-4 bg-slate-700 rounded w-1/4 mt-3"></div>
       <div className="pl-8 space-y-2">
        <div className="h-3 bg-slate-700 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);


const UnifiedWordTree: React.FC<UnifiedWordTreeProps> = ({ root, morphologyResults, conceptNetResults, wikiSections, synAntResults, wordNetResults, associations, isLoading }) => {
  const [selected, setSelected] = useState<{ type: string; id: string } | null>(null);
  const [tooltip, setTooltip] = useState<{ content: string; top: number; left: number } | null>(null);

  // Reset selection when the root word changes
  useEffect(() => {
    setSelected(null);
    setTooltip(null);
  }, [root]);

  const handleNodeClick = (e: React.MouseEvent | React.KeyboardEvent, type: string, id: string, details: string) => {
    e.stopPropagation();
    if (selected?.id === id) {
      setSelected(null);
      setTooltip(null);
    } else {
      setSelected({ type, id });
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setTooltip({
        content: details,
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX + 20,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: string, id: string, details: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNodeClick(e, type, id, details);
    }
  }

  const handleRootClick = () => {
      setSelected(null);
      setTooltip(null);
  };
  
  const hasData = morphologyResults.length > 0 || conceptNetResults.length > 0 || wikiSections.length > 0 || synAntResults.synonyms.length > 0 || synAntResults.antonyms.length > 0 || wordNetResults.synonyms.length > 0 || wordNetResults.antonyms.length > 0 || wordNetResults.hypernyms.length > 0 || associations.length > 0;

  if (isLoading) {
    return <WordTreeSkeleton />;
  }

  if (!root || !hasData) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 bg-slate-800 rounded-lg">
        <p>No data to visualize. Explore a word to see the tree.</p>
      </div>
    );
  }

  const renderBranch = (
    title: string,
    items: any[],
    type: string,
    colorClass: string,
    labelExtractor: (item: any) => string,
    detailExtractor: (item: any) => string,
    truncate = false
  ) => {
    if (items.length === 0) return null;
    const isBranchSelected = selected?.type.startsWith(type);
    return (
      <>
        <div className={`${colorClass} mt-2 font-bold ${isBranchSelected ? 'bg-slate-700/50 rounded-r-md' : ''}`}>├── {title}</div>
        {items.map((item, i) => {
          const id = `${type}-${i}`;
          const isSelected = selected?.id === id;
          const label = labelExtractor(item);
          const truncatedLabel = truncate && label.length > 60 ? `${label.substring(0, 57)}...` : label;
          return (
            <div
              key={id}
              role="button"
              tabIndex={0}
              onClick={(e) => handleNodeClick(e, type, id, detailExtractor(item))}
              onKeyDown={(e) => handleKeyDown(e, type, id, detailExtractor(item))}
              className={`pl-8 ${colorClass} cursor-pointer hover:bg-slate-700/50 rounded-md transition-colors duration-150 ${isSelected ? 'bg-yellow-500/20' : ''}`}
              aria-label={`View details for ${label}`}
            >
              └── {truncatedLabel}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm relative" onClick={() => setTooltip(null)}>
      <div className={`${colors.root} font-bold text-lg cursor-pointer`} onClick={handleRootClick}>{root}</div>
      <div className="pl-4 border-l border-slate-600">
        {renderBranch('Morphology', morphologyResults, 'morph', colors.morphology, (r) => r.word, (r) => r.meaning)}
        {renderBranch('ConceptNet', conceptNetResults, 'concept', colors.conceptnet, (r) => r.word, (r) => r.meaning, true)}
        {renderBranch('Associations', associations, 'assoc', colors.associations, (a) => a, (a) => 'Associated word')}
        {renderBranch('Wikipedia', wikiSections, 'wiki', colors.wikipedia, (s) => s, (s) => 'Wikipedia Subtopic')}
        {renderBranch('Synonyms (Dictionary)', synAntResults.synonyms, 'syn', colors.synonym, (s) => s, (s) => 'Synonym')}
        {renderBranch('Antonyms (Dictionary)', synAntResults.antonyms, 'ant', colors.antonym, (a) => a, (a) => 'Antonym')}

        {(wordNetResults.synonyms.length > 0 || wordNetResults.antonyms.length > 0 || wordNetResults.hypernyms.length > 0) && (
            <div className={`${colors.wordnet} mt-2 font-bold ${selected?.type.startsWith('wn') ? 'bg-slate-700/50 rounded-r-md' : ''}`}>
                ├── WordNet
                <div className="pl-8 border-l border-slate-700 ml-2">
                    {renderBranch('Synonyms', wordNetResults.synonyms, 'wn-syn', colors.wordnet, s => s, s => 'WordNet Synonym')}
                    {renderBranch('Antonyms', wordNetResults.antonyms, 'wn-ant', colors.wordnet, a => a, a => 'WordNet Antonym')}
                    {renderBranch('Hypernyms', wordNetResults.hypernyms, 'wn-hyp', colors.wordnet, h => h, h => 'WordNet Hypernym')}
                </div>
            </div>
        )}
      </div>
       {tooltip && (
        <div 
          className="absolute z-10 p-2 text-xs text-slate-100 bg-slate-900 border border-slate-600 rounded-md shadow-lg max-w-xs"
          style={{ top: `${tooltip.top}px`, left: `${tooltip.left}px` }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default UnifiedWordTree;