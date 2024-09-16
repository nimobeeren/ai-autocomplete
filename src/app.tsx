import { debounce } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import { Search } from "./search";

function App() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const generateSuggestions = useMemo(() => {
    const func = async (value: string) => {
      if (!value) {
        return setSuggestions([]);
      }

      const session = await window.ai.assistant.create({
        initialPrompts: [
          {
            role: "system",
            content: "Generate autocomplete suggestions for the input query",
          },
          {
            role: "user",
            content: "Generate autocomplete suggestions: apple",
          },
          {
            role: "assistant",
            content: "* apple iphone\n* apple ipad\n* macbook pro",
          },
        ],
      });

      console.log("start", value);
      const result: string = await session.prompt(
        `Generate autocomplete suggestions: ${value}`
      );
      // console.log("raw", result);
      const newSuggestions = result
        .split("\n")
        .map((suggestion) => suggestion.replace("*", "").trim().toLowerCase());
      // console.log("parsed", newSuggestions);
      console.log("end", value);

      setSuggestions(newSuggestions);
    };
    return debounce(func, 300);
  }, []);

  useEffect(() => {
    console.log("canceling");
    return () => {
      generateSuggestions.cancel();
    };
  }, [generateSuggestions]);

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <Search
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          generateSuggestions(newValue);
        }}
        suggestions={suggestions}
      />
    </main>
  );
}

export default App;
