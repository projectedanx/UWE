# ✅ TODO List

A list of actionable tasks, bug fixes, and refactoring needed for the project.

### 🚀 High Priority / Next Up

-   **Refactor:** The `App.tsx` component is managing a large amount of state. Refactor to use React Context for API results and loading states to reduce prop drilling and improve maintainability.
-   **UI/UX:** Implement a global notification system (e.g., toasts) to provide more immediate user feedback for background API errors, especially when a panel is closed.

### ✨ Medium Priority / Features & Refactoring

-   **Optimization:** In the `ComparativeAnalysis` component, reuse data from the main `rootWord` state if one of the words being compared is already loaded, avoiding redundant API calls.
-   **Performance:** Memoize components like `WordList` and the list items in the synonym/antonym panels to prevent unnecessary re-renders when other parts of the state update.

### 🎨 Low Priority / Polish & Accessibility

-   **Accessibility:** Conduct a full accessibility audit. Ensure all interactive elements are fully keyboard-navigable and have appropriate ARIA attributes for screen readers.
