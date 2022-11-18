import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "react-query";
import "@servicetitan/design-system/dist/system.min.css";
import "@servicetitan/anvil-fonts/dist/css/anvil-fonts.css";

import App from "./App"

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
