import { debounce } from "lodash-es";
import { useMemo, useState } from "react";
import { Search } from "./search";

async function createAssistant() {
  return window.ai.assistant.create({
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
}

function App() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [oldAssistant, setOldAssistant] = useState<AIAssistant>();

  const generateSuggestions = useMemo(() => {
    const func = async (value: string) => {
      if (!value) {
        return setSuggestions([]);
      }

      if (oldAssistant) {
        console.log("destroying assistant");
        oldAssistant.destroy();
      }
      const assistant = await createAssistant();
      setOldAssistant(assistant);

      console.log("start", value);
      let result;
      try {
        result = await assistant.prompt(
          `Generate autocomplete suggestions: ${value}`
        );
      } catch (e) {
        if (
          e instanceof Error &&
          e.name == "InvalidStateError" &&
          e.message.includes("destroyed")
        ) {
          console.log("ignoring destroyed session");
          return;
        }
        throw e;
      }

      console.log(`result\n${result}`);

      setSuggestions(
        result
          .split("\n")
          .map((suggestion) => suggestion.replaceAll("**", ""))
          .filter((suggestion) => !suggestion.endsWith(":"))
          .map((suggestion) =>
            suggestion
              .replace(/^\s*[*-]/, "")
              .trim()
              .toLowerCase()
          )
      );

      console.log("end", value);
    };
    return debounce(func, 300);
  }, [oldAssistant]);

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
