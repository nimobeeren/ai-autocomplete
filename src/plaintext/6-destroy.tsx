// Destroy old assistant

import { Search } from "@/components/search";
import { debounce } from "lodash-es";
import { useMemo, useRef, useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const assistantRef = useRef<AIAssistant>();

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

      if (assistantRef.current) {
        assistantRef.current.destroy();
      }

      const assistant = await window.ai.assistant.create();
      assistantRef.current = assistant;

      const result = await assistant.prompt(
        `Generate autocomplete suggestions for: ${value}`,
      );

      console.log(`result\n${result}`);

      setSuggestions(
        result
          .split("\n")
          .map((suggestion) =>
            suggestion.replace(/[-*]/, "").replaceAll("**", "").trim(),
          )
          .filter((suggestion) => suggestion && !suggestion.endsWith(":")),
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
