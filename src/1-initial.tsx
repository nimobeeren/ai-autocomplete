// Starting point

import { useState } from "react";
import { Search } from "./search";

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
