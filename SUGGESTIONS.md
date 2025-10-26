# 💡 Suggestions & Ideas

A backlog of potential features, new data sources, and enhancements that are not yet on the official roadmap. This is a space for brainstorming.

### New Data Sources

-   **Etymology Online (etymonline.com):** Could be scraped or accessed via an unofficial API for more narrative and detailed etymological data than DictionaryAPI provides.
-   **Google Ngram Viewer:** Integrate a chart that visualizes the historical frequency of a word in literature. This would provide a powerful cultural context.
-   **Rhyming Dictionaries (e.g., RhymeZone API):** Add a "Creative Writing" panel that shows rhymes, near rhymes, and alliterations, which would be invaluable for poets and songwriters.
-   **Pronunciation Guide:** Add a feature to play the audio pronunciation of the root word, possibly using the Web Speech API or an external API.

### New Features

-   **"Word of the Day":** `[✅ Implemented]` On initial load, feature a randomly explored word to encourage discovery.
-   **Word Associations:** `[✅ Implemented]` Use an API to find words that are commonly associated with the root word, providing another layer of semantic context.
-   **Comparison Mode:** `[✅ Implemented]` A dedicated UI to select two words and see a side-by-side comparison of their attributes, powered by Gemini.
-   **AI-Powered Conceptual Blender:** The current blender uses a simple heuristic. This could be enhanced by feeding the relations for two words to Gemini and asking it to generate more creative and coherent blend ideas.
-   **Gemini-Powered Influence Meter:** Replace the current heuristic-based `WordInfluenceMeter` with a Gemini-powered one. A user could input a word and its context, and Gemini would provide a detailed analysis of its likely impact.
-   **Gamification:** Add small challenges or "achievements" for exploring words. For example: "Lexicographer: Explore 50 words," or "Etymology Expert: Uncover the origins of 10 words."
-   **Thematic Exploration:** Allow users to explore words related to a specific theme (e.g., "space," "justice," "nature") and see how they connect.
-   **Interactive Etymology Timeline:** Instead of just text, visualize the etymology of a word on a timeline, showing its journey through different languages and time periods.

### UI/UX Enhancements

-   **Dark/Light Mode Toggle:** Allow users to switch between the default dark theme and a new light theme.
-   **Global Loading Indicator:** Instead of individual spinners, have a single, subtle loading bar at the top of the page that reflects the overall progress of all API calls.
-   **Shareable Results:** Generate a unique URL that saves the state of a search, allowing users to share their findings with others.
