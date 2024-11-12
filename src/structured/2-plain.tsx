// Generate suggestions with static prompt

import { Search } from "@/components/search";
import { useEffect, useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  async function generateSuggestions() {
    if (
      typeof window === "undefined" ||
      (await window.ai?.languageModel?.capabilities())?.available !== "readily"
    ) {
      setSuggestions([]);
      return;
    }

    const session = await window.ai.languageModel.create();
    const result = await session.prompt(
      "Generate 5 autocomplete suggestions for: pizza"
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
