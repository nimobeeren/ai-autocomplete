// Generate suggestions based on value

import { useState } from "react";
import { Search } from "./search";

function App() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  async function generateSuggestions(value: string) {
    if (
      typeof window === "undefined" ||
      (await window.ai?.assistant.capabilities())?.available !== "readily" ||
      !value.trim()
    ) {
      return;
    }

    console.log("start", value);

    const assistant = await window.ai.assistant.create();
    const result = await assistant.prompt(
      `Generate autocomplete suggestions for: ${value}`
    );

    console.log(`result\n${result}`);

    setSuggestions(result.split("\n"));

    console.log("end", value);
  }

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <Search
        value={value}
        onChange={(value) => {
          setValue(value);
          generateSuggestions(value);
        }}
        suggestions={suggestions}
      />
    </main>
  );
}

export default App;
