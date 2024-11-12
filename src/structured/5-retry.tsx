// Output JSON

import { Search } from "@/components/search";
import pRetry from "p-retry";
import { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const generateSuggestions = async (value: string) => {
    if (
      typeof window === "undefined" ||
      (await window.ai?.languageModel?.capabilities())?.available !==
        "readily" ||
      value.trim().length < 3
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

    const json = result
      .trim()
      .replace(/^```json/i, "")
      .replace(/```$/, "");
    const parsedSuggestions = JSON.parse(json).suggestions;

    if (!Array.isArray(parsedSuggestions)) {
      throw new Error("JSON did not conform to schema");
    }

    setSuggestions(
      parsedSuggestions.filter((suggestion) => typeof suggestion === "string")
    );

    console.log("end", value);
  };

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <Search
        value={value}
        onChange={(value) => {
          setValue(value);
          pRetry(() => generateSuggestions(value), {
            retries: 2,
            minTimeout: 0,
            maxTimeout: 0,
            onFailedAttempt: (error) => {
              console.warn(`failed attempt ${error.attemptNumber}`);
            },
          });
        }}
        suggestions={suggestions}
      />
    </main>
  );
}

export default App;
