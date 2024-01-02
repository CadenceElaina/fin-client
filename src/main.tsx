import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext.tsx";
import { WelcomeBackProvider } from "./context/WelcomeBackContext.tsx";
import { PortfoliosProvider } from "./context/PortfoliosContext.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NewsProvider } from "./context/NewsContext.tsx";
import { WatchlistsProvider } from "./context/WatchlistContext.tsx";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <PortfoliosProvider>
        <WatchlistsProvider>
          <WelcomeBackProvider>
            <QueryClientProvider client={queryClient}>
              <NewsProvider>
                <App />
              </NewsProvider>
              {/*      <ReactQueryDevtools /> */}
            </QueryClientProvider>
          </WelcomeBackProvider>
        </WatchlistsProvider>
      </PortfoliosProvider>
    </AuthProvider>
  </React.StrictMode>
);
