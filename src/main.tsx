
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  // Load our global theme overrides after the generated Tailwind utilities
  import "./styles/globals.css";

  createRoot(document.getElementById("root")!).render(<App />);
  