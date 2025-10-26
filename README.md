# 🌐 Unified Word Explorer

A comprehensive dashboard for deep linguistic analysis. This tool goes beyond a simple dictionary, offering a multi-faceted exploration of words by integrating data from various lexical, semantic, and knowledge-based sources. It is heavily augmented with AI-powered insights from Google Gemini, including on-demand analysis, a conversational chatbot, a powerful "Thinking Mode" for complex queries, and a dedicated comparative analysis tool.

## ✨ Features

### Core Data Exploration
- **Word of the Day**: Greets users with a randomly selected, interesting word to encourage discovery.
- **Morphology Explorer**: Generates prefixed and suffixed variations of a root word.
- **Etymology & Origin**: Displays the historical origin of a word.
- **Lexical Relationships**: Provides synonyms, antonyms, and hypernyms (broader concepts) from multiple sources (DictionaryAPI, WordNet/Datamuse).
- **Word Associations**: Finds and displays words that are strongly associated with the root term.
- **Semantic Relationships**: Fetches and displays semantic connections (e.g., `IsA`, `UsedFor`) from ConceptNet.
- **Wikipedia Subtopics**: Pulls the table of contents from a word's Wikipedia article to provide structured knowledge.

### Visualization & Tools
- **Unified Word Tree**: An interactive, text-based visualization that aggregates all data sources into a single, hierarchical view. Nodes are clickable to reveal more details.
- **Word Influence Meter**: A heuristic-based tool to score a word's "influence" based on intensity, polarity, frequency, and persuasiveness.
- **Conceptual Blender**: A creative tool that combines semantic properties of two different concepts to spark new ideas.
- **Search History**: Keeps track of your recent explorations for quick access.
- **Data Export**: Allows users to download the complete results of an exploration as a structured `JSON` or a human-readable `Markdown` file.

### Gemini AI Integration
- **On-Demand Analysis**: Context-aware AI analysis within each data panel to summarize patterns, elaborate on etymology, and provide deeper insights.
- **Gemini Chatbot**: An integrated conversational AI to answer any related (or unrelated) questions.
- **Gemini "Thinking Mode"**: A dedicated mode for complex queries that leverages a more powerful model (`gemini-2.5-pro`) with an extended reasoning budget.
- **Comparative Analysis**: A tool to compare two words across all available metrics, with a Gemini-generated summary of their key differences and similarities.

## 🚀 Technology Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API (`@google/genai`)

## 🔗 API Dependencies

This application relies on several free, public APIs:

- **ConceptNet**: For semantic relationship data.
- **Wikipedia API**: For article subtopics.
- **DictionaryAPI.dev**: For definitions, etymology, synonyms, and antonyms.
- **Datamuse API**: For WordNet-like data and word associations.

## 🏃‍♀️ How to Run

While this app is designed for a specific web-based development environment, you can run a similar project locally:

1.  **Clone the repository.**
2.  **Install dependencies**: `npm install`
3.  **Set up environment variables**: Create a `.env` file and add your `API_KEY` for the Google Gemini API.
4.  **Run the development server**: `npm start`
