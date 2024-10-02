// Add debounce

import { debounce } from "lodash-es";
import { useMemo, useState } from "react";
import { Search } from "../search";

function App() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const generateSuggestions = useMemo(() => {
    async function func(value: string) {
      if (
        typeof window === "undefined" ||
        (await window.ai?.assistant.capabilities())?.available !== "readily" ||
        !value.trim()
      ) {
        setSuggestions([]);
        return;
      }

      console.log("start", value);

      const assistant = await window.ai.assistant.create();
      const result = await assistant.prompt(
        `Generate autocomplete suggestions for: ${value}`
      );

      console.log(`result\n${result}`);

      setSuggestions(
        result
          .split("\n")
          .map((suggestion) =>
            suggestion.replace(/[-*]/, "").replaceAll("**", "").trim()
          )
          .filter((suggestion) => suggestion && !suggestion.endsWith(":"))
      );

      console.log("end", value);
    }
    return debounce(func, 300);
  }, []);

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
