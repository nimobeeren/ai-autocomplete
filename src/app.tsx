import { useState } from "react";
import { Search } from "./search";

function App() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  async function generateSuggestions(value: string) {
    if (!value) {
      return [];
    }

    const session = await (window as any).ai.assistant.create({
      initialPrompts: [
        {
          role: "system",
          content: `Generate autocomplete suggestions for the input query.`,
        },
        { role: "user", content: "Generate autocomplete suggestions: apple" },
        {
          role: "assistant",
          content: "* apple iphone\n* apple ipad\n* macbook pro",
        },
      ],
    });

    const result: string = await session.prompt(
      `Generate autocomplete suggestions: ${value}`
    );
    console.log("raw result", result);
    const newSuggestions = result
      .split("\n")
      .map((suggestion) => suggestion.replace("*", "").trim().toLowerCase());
    console.log("suggestions", newSuggestions);
    return newSuggestions;
  }

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <Search
        value={value}
        onChange={async (newValue) => {
          setValue(newValue);
          const newSuggestions = await generateSuggestions(newValue);
          setSuggestions(newSuggestions);
        }}
        suggestions={suggestions}
      />
    </main>
  );
}

export default App;
