// Stream suggestions

import { Search } from "@/components/search";
import pRetry from "p-retry";
import { parse as parsePartial } from "partial-json";
import { useRef, useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const sessionRef = useRef<AILanguageModel>();

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

    if (sessionRef.current) {
      sessionRef.current.destroy();
      sessionRef.current = undefined;
    }

    const session = await window.ai.languageModel.create({
      systemPrompt: `You are a shopping assistant for a tech store. Generate 5-10 autocomplete suggestions for the user query. Respond only with JSON and follow this schema: {"suggestions": string[]}`,
    });
    sessionRef.current = session;

    let parsedSuggestions;
    for await (const chunk of session.promptStreaming(`User query: ${value}`)) {
      if (chunk.trim().length === 0) {
        continue;
      }

      const parsed = parsePartial(chunk);
      parsedSuggestions = parsed.suggestions;

      if (!Array.isArray(parsedSuggestions)) {
        continue;
      }

      setSuggestions(
        parsedSuggestions.filter((suggestion) => typeof suggestion === "string")
      );
    }

    if (!Array.isArray(parsedSuggestions)) {
      throw new Error("Final JSON did not conform to schema");
    }

    console.log("end", value);
  }

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
            shouldRetry: (error) => error.name !== "InvalidStateError",
          });
        }}
        suggestions={suggestions}
      />
    </main>
  );
}

export default App;
