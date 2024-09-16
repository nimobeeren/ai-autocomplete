// Generate suggestions with static prompt

import { useEffect, useState } from "react";
import { Search } from "./search";

function App() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  async function generateSuggestions() {
    if (
      typeof window === "undefined" ||
      (await window.ai?.assistant.capabilities())?.available !== "readily"
    ) {
      return;
    }

    const assistant = await window.ai.assistant.create();
    const result = await assistant.prompt(
      "Generate autocomplete suggestions for: fruit"
    );

    setSuggestions(result.split("\n"));
  }

  useEffect(() => {
    generateSuggestions();
  }, []);

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <Search value={value} onChange={setValue} suggestions={suggestions} />
    </main>
  );
}

export default App;
