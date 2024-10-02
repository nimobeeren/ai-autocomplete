import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./plaintext/1-initial";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
