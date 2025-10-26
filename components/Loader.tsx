import React from 'react';

/**
 * A simple spinning loader component.
 * @returns {JSX.Element} The rendered SVG loader.
 */
const Loader: React.FC = () => {
  return (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
};

/**
 * A full-screen loader component that overlays the entire page.
 * @param {object} props - The component's props.
 * @param {string} [props.text] - Optional text to display below the loader.
 * @returns {JSX.Element} The rendered full-screen loader.
 */
export const FullScreenLoader: React.FC<{ text?: string }> = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50">
      <div className="flex items-center">
        <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p className="mt-4 text-slate-400 text-lg">{text}</p>
    </div>
  );
};


export default Loader;