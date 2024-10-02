// Starting point

import { Search } from "@/components/search";
import { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <Search value={value} onChange={setValue} suggestions={suggestions} />
    </main>
  );
}

export default App;
