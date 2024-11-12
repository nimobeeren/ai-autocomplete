// Output JSON

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

    const session = await window.ai.languageModel.create({
      systemPrompt: `You are a shopping assistant for a tech store. Generate 5-10 autocomplete suggestions for the user query. Respond only with JSON and follow this schema: {"suggestions": string[]}`,
    });
    const result = await session.prompt(`User query: ${value}`);

    console.log(`result\n${result}`);

    const parsedSuggestions = JSON.parse(result).suggestions;

    if (!Array.isArray(parsedSuggestions)) {
      throw new Error("JSON did not conform to schema");
    }

    setSuggestions(
      parsedSuggestions.filter((suggestion) => typeof suggestion === "string")
    );

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
