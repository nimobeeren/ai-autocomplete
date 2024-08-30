import * as React from "react";
import { Search } from "./search";

function App() {
  const [value, setValue] = React.useState("");
  const suggestions = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <Search
        value={value}
        onChange={setValue}
        suggestions={suggestions}
      />
    </main>
  );
}

export default App;
