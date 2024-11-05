// src/App.tsx
import React from "react";
import AutoComplete from "./components/AutoComplete/AutoComplete";

const App: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>AutoComplete Component</h1>
      <AutoComplete />
    </div>
  );
};

export default App;
