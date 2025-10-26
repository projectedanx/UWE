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

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- A Google Gemini API key

### Installation

1.  **Clone the repository.**
    ```bash
    git clone https://github.com/your-username/unified-word-explorer.git
    cd unified-word-explorer
    ```
2.  **Install dependencies.**
    ```bash
    npm install
    ```
3.  **Set up environment variables.**
    Create a `.env` file in the root of the project and add your Google Gemini API key:
    ```
    API_KEY=your_gemini_api_key
    ```
4.  **Run the development server.**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## 📂 Project Structure

- **`src/`**: The main source code directory.
  - **`components/`**: Contains all the React components.
    - **`App.tsx`**: The main application component.
    - **`Panel.tsx`**: A reusable collapsible panel component.
    - **`Chatbot.tsx`**: The Gemini-powered chatbot.
    - ...and other UI components.
  - **`services/`**: Contains the API service for fetching data from external APIs.
    - **`api.ts`**: Handles all the API requests and error handling.
  - **`types.ts`**: Contains all the TypeScript type definitions.
  - **`constants.ts`**: Contains all the constants used in the application.
  - **`index.tsx`**: The entry point of the application.
- **`public/`**: Contains all the public assets.
- **`.env`**: The environment variables file.
- **`package.json`**: The project's dependencies and scripts.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a pull request.

Please make sure to update tests as appropriate.
