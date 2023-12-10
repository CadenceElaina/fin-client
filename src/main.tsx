import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./AuthContext.tsx";

/* import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; */
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        {/*       <ReactQueryDevtools /> */}
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
