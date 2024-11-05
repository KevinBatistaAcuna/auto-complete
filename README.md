# AutoComplete Component

This project implements an AutoComplete component built with React and TypeScript. The component provides a user-friendly interface for searching and selecting suggestions based on user input.

## Features

- Performance-oriented design suitable for production use.
- Pure React implementation without third-party libraries.
- Asynchronous data fetching simulating a real REST API call.
- Highlights matching text in suggestions.
- Basic CSS styling for a clean UI.
- Handles edge cases for a smooth user experience.

## Technologies Used

- React
- TypeScript
- Vite
- CSS

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/autocomplete-component.git
   cd autocomplete-component

   ```

2. Install dependencies:
   npm install

3. Start the development server:
   npm run dev

4. Open your browser and navigate to http://localhost:5173/ to see the AutoComplete component in action.

## Usage

The AutoComplete component can be used as follows:

import AutoComplete from './path/to/AutoComplete';

function App() {
return (
<div>
<h1>AutoComplete Example</h1>
<AutoComplete />
</div>
);
}

## Edge Cases Handled

- The component manages input changes and only fetches suggestions if the input length is greater than or equal to 2.
- Displays a loading indicator while fetching suggestions.
- Shows a message when no results are found based on the input.

## Bonus Features

- Data can be loaded from a real API endpoint by modifying the fetch URL in the filterData function.
