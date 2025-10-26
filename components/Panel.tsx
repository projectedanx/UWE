import React, { useState } from 'react';

interface PanelProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
  tooltip?: string;
}

/**
 * A collapsible panel component with a title, icon, and tooltip.
 * @param {object} props - The component's props.
 * @param {string} props.title - The title of the panel.
 * @param {React.ReactNode} props.children - The content of the panel.
 * @param {boolean} [props.defaultOpen=false] - Whether the panel should be open by default.
 * @param {React.ReactNode} [props.icon] - An optional icon to display next to the title.
 * @param {string} [props.tooltip] - An optional tooltip to display on hover.
 * @returns {JSX.Element} The rendered panel component.
 */
const Panel: React.FC<PanelProps> = ({ title, children, defaultOpen = false, icon, tooltip }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg">
      <button
        title={tooltip || title}
        className="w-full flex justify-between items-center p-4 text-left font-bold text-lg bg-slate-700/30 hover:bg-slate-700/60 transition"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-3">
            {icon}
            {title}
        </span>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="p-4 border-t border-slate-700/50">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panel;