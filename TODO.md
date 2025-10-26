# ✅ TODO List

A list of actionable tasks, bug fixes, and refactoring needed for the project.

### 🐞 High Priority / Bugs

-   `[✅]` The UI briefly flashes on initial load before the first search for "agent" completes. Implement a more graceful initial loading state for the entire app.
-   `[✅]` The `UnifiedWordTree` can become cluttered with very long relation strings from ConceptNet. Truncate long strings with an ellipsis and show the full text on hover.
-   `[✅]` In the Chatbot, submitting the form with an empty input should be disabled, but the button state doesn't always update correctly on rapid entry/deletion.

### ✨ Medium Priority / Features & Refactoring

-   `[✅]` **Refactor:** Consolidate all external API fetching logic into a dedicated `services/api.ts` file to clean up the main `App.tsx` component. Each function should handle the specific request and error parsing for its endpoint.
-   `[✅]` **Feature:** Make items in the "Search History" panel clickable to re-run a search for that word.
-   `[✅]` **UI:** Add a "Clear History" button to the Search History panel.
-   `[✅]` **UI:** Improve the loading state for the `UnifiedWordTree` to show a skeleton loader that mimics the tree structure, providing a better UX than an empty box.

###   polishing Low Priority / Polish & Accessibility

-   `[✅]` **UI:** Add tooltips to the icons in the panel headers to explain what each panel does (e.g., "Semantic Relationships from ConceptNet").
-   `[ ]` **Accessibility:** Conduct a full accessibility audit. Ensure all interactive elements are keyboard-navigable and have appropriate ARIA attributes.
-   `[ ]` **Performance:** Memoize components like `WordList` and the list items in the synonym/antonym panels to prevent unnecessary re-renders when other parts of the state update.
-   `[✅]` **UI:** Animate the opening and closing of panels for a smoother user experience.