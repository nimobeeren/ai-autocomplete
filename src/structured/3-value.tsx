// Generate suggestions based on value

import { Search } from "@/components/search";
import { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  async function generateSuggestions(value: string) {
    if (
      value.trim().length < 3 ||
      typeof window === "undefined" ||
      (await window.ai?.languageModel?.capabilities())?.available !== "readily"
    ) {
      setSuggestions([]);
      return;
    }

    console.log("start", value);

    const session = await window.ai.languageModel.create();
    const result = await session.prompt(
      `Generate 5 autocomplete suggestions for: ${value}`
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
