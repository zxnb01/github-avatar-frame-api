import React from 'react';
// Use createRoot for modern React applications
import ReactDOM from 'react-dom/client'; 
import App from './App'; // Import your main App component

// Find the root element where the React app will be injected.
// This corresponds to the <div id="root"> in your index.html.
const rootElement = document.getElementById('root');

if (rootElement) {
    // Create a React root and render the main App component.
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    // Optional: Log an error if the root element isn't found
    console.error("Failed to find the root element with ID 'root' in the document.");
}