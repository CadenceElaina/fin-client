import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext.tsx";
import { WelcomeBackProvider } from "./context/WelcomeBackContext.tsx";

/* import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; */
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <WelcomeBackProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          {/*       <ReactQueryDevtools /> */}
        </QueryClientProvider>
      </WelcomeBackProvider>
    </AuthProvider>
  </React.StrictMode>
);
