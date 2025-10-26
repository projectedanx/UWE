
import React, { useMemo, useState } from 'react';
import Panel from './Panel';

const POWER_ADJECTIVES = new Set(["transformative", "groundbreaking", "revolutionary", "toxic", "brilliant", "remarkable", "extraordinary", "catastrophic", "devastating", "phenomenal", "stunning", "compelling"]);
const POSITIVE_WORDS = new Set(["brilliant", "excellent", "remarkable", "beautiful", "beneficial", "transformative", "innovative", "robust", "effective", "pleasant"]);
const NEGATIVE_WORDS = new Set(["toxic", "catastrophic", "devastating", "awful", "terrible", "harmful", "weak", "poor", "defective", "dangerous"]);

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/**
 * A component that displays a labeled progress bar.
 * @param {object} props - The component's props.
 * @param {string} props.label - The label for the bar.
 * @param {number} props.value - The current value of the bar.
 * @param {number} [props.max=5] - The maximum value of the bar.
 * @param {string} [props.color="bg-cyan-500"] - The color of the bar.
 * @returns {JSX.Element} The rendered bar component.
 */
const Bar: React.FC<{ label: string; value: number; max?: number; color?: string }> = ({ label, value, max = 5, color = "bg-cyan-500" }) => {
  const pct = (value / max) * 100;
  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm text-slate-300">
        <strong>{label}</strong>
        <span>{value}/{max}</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full">
        <div style={{ width: `${pct}%` }} className={`h-2 ${color} rounded-full`} />
      </div>
    </div>
  );
};

/**
 * A heuristic-based tool to score a word's "influence" based on intensity, polarity, frequency, and persuasiveness.
 * @returns {JSX.Element} The rendered word influence meter component.
 */
const WordInfluenceMeter: React.FC = () => {
  const [word, setWord] = useState("");

  const auto = useMemo(() => {
    const w = word.toLowerCase().trim();
    if (!w) return { intensity: 0, polarity: 0, frequency: 0, persuasiveness: 0 };
    let intensity = clamp(Math.ceil(w.length / 3), 0, 5);
    if (POWER_ADJECTIVES.has(w)) intensity = clamp(intensity + 2, 0, 5);
    let polarity = 0;
    if (POSITIVE_WORDS.has(w)) polarity = 4;
    if (NEGATIVE_WORDS.has(w)) polarity = -4;
    let frequency = 3;
    if (w.length <= 4) frequency = 5;
    else if (w.length <= 6) frequency = 4;
    else frequency = 2;
    let persuasiveness = clamp(Math.round(intensity + Math.abs(polarity) / 2 - (6 - frequency) / 3), 0, 5);
    return { intensity, polarity, frequency, persuasiveness };
  }, [word]);

  const influenceScore = useMemo(() => {
    return auto.intensity + Math.abs(auto.polarity) + auto.persuasiveness;
  }, [auto]);

  return (
    <Panel title="⚖️ Word Influence Meter" defaultOpen>
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
        <input
          type="text"
          placeholder="Enter an adjective..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="flex-grow w-full sm:w-auto bg-slate-800 border border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        />
        <div className="text-center sm:text-right bg-slate-700/50 p-3 rounded-lg">
          <div className="text-sm font-bold text-slate-400">Influence Score</div>
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{influenceScore}</div>
          <div className="text-xs text-slate-500">Scale: 0–15</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Bar label="Intensity" value={auto.intensity} color="bg-red-500" />
        <Bar label={`Polarity (${auto.polarity >= 0 ? 'pos' : 'neg'})`} value={Math.abs(auto.polarity)} color={auto.polarity >= 0 ? "bg-green-500" : "bg-yellow-500"} />
        <Bar label="Frequency" value={auto.frequency} color="bg-slate-500" />
        <Bar label="Persuasiveness" value={auto.persuasiveness} color="bg-purple-500" />
      </div>
       <p className="mt-4 text-xs text-slate-500">Note: This meter uses simple heuristics (word length, inclusion in predefined lists) for a basic analysis.</p>
    </Panel>
  );
};

export default WordInfluenceMeter;
