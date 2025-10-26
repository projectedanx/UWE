
import React, { useState } from 'react';
import { ConceptNetEdge, ConceptNetResponse } from '../types';
import Panel from './Panel';
import Loader from './Loader';

/**
 * A creative tool that combines semantic properties of two different concepts to spark new ideas.
 * It fetches data from ConceptNet for two user-provided concepts and generates blend ideas.
 * @returns {JSX.Element} The rendered conceptual blender component.
 */
const ConceptualBlender: React.FC = () => {
  const [conceptA, setConceptA] = useState("agent");
  const [conceptB, setConceptB] = useState("virus");
  const [blends, setBlends] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const fetchConceptNet = async (term: string): Promise<ConceptNetEdge[]> => {
    if(!term) return [];
    const url = `https://api.conceptnet.io/query?node=/c/en/${term.toLowerCase()}&limit=5`;
    const res = await fetch(url);
    if(!res.ok) throw new Error(`Failed to fetch data for ${term}`);
    const data = await res.json() as ConceptNetResponse;
    return data.edges || [];
  };

  const generateBlend = async () => {
    if (!conceptA || !conceptB) return;
    setIsLoading(true);
    setError(null);
    setBlends([]);
    try {
      const [edgesA, edgesB] = await Promise.all([
        fetchConceptNet(conceptA),
        fetchConceptNet(conceptB)
      ]);
      
      const newBlends: string[] = [];
      if(edgesA.length > 0 && edgesB.length > 0) {
        for(let i = 0; i < Math.min(3, edgesA.length, edgesB.length); i++) {
           const idea = `Imagine combining "${edgesA[i].end.label}" (${edgesA[i].rel.label}) with "${edgesB[i].end.label}" (${edgesB[i].rel.label}).`;
           newBlends.push(idea);
        }
      } else {
        newBlends.push(`Could not generate blend. At least one concept yielded no results.`);
      }

      setBlends(newBlends);
    } catch (e: any) {
      setError(e.message || "An error occurred while blending concepts.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Panel title="🌀 Conceptual Blender" defaultOpen>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Concept A"
          value={conceptA}
          onChange={(e) => setConceptA(e.target.value)}
          className="bg-slate-800 border border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Concept B"
          value={conceptB}
          onChange={(e) => setConceptB(e.target.value)}
          className="bg-slate-800 border border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        />
      </div>
      <button
        onClick={generateBlend}
        disabled={isLoading}
        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-md transition disabled:bg-slate-500"
      >
        {isLoading ? <Loader /> : 'Generate Blend'}
      </button>
      
      {error && <p className="mt-4 text-red-400">{error}</p>}

      {blends.length > 0 && (
        <div className="mt-4 space-y-3">
          <h3 className="font-bold">Hybrid Ideas:</h3>
          <ul className="list-disc list-inside text-slate-300 bg-slate-900/50 p-3 rounded-md">
            {blends.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  );
};

export default ConceptualBlender;
