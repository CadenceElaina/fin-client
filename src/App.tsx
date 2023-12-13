import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

/* import { useEffect, useRef } from "react"; */
import {
  BrowserRouter as Router,
  Route,
  /* Link, */ Routes,
} from "react-router-dom";
/* import Navbar from "./components/Navbar";
import Togglable from "./components/Togglable"; */
import Home from "./pages/Home";
import RegisterModal from "./components/modals/RegisterModal";
import SignIn from "./components/SignIn";
import Portfolio from "./components/portfolio/Portfolio";
import Help from "./pages/footer/Help";
import Feedback from "./pages/footer/Feedback";
import Privacy from "./pages/footer/Privacy";
import Terms from "./pages/footer/Terms";
import Disclaimer from "./pages/footer/Disclaimer";
import Watchlist from "./pages/Watchlist";
import Settings from "./pages/Settings";
import Quote from "./pages/Quote";
import { useAuth } from "./context/AuthContext";
/* import { refreshToken } from "./services/refreshToken"; */
import { useEffect, useRef, useState } from "react";
import SessionTimeoutModal from "./components/modals/SessionTimeoutModal";
import ReactDOM from "react-dom";
import refreshTokenService from "./services/refreshToken";

function App() {
  const { user, signOut, updateUserToken } = useAuth();
  const [isSessionTimeoutModalOpen, setSessionTimeoutModalOpen] =
    useState(false);

  const sessionTimeoutRef = useRef<number | null>(null as number | null);
  useEffect(() => {
    sessionTimeoutRef.current = window.setTimeout(() => {
      setSessionTimeoutModalOpen(true);
    }, 30 * 60 * 1000); // 30 minutes

    return () => {
      clearTimeout(sessionTimeoutRef.current as number);
    };
  }, []); // Run once on component mount

  const resetSessionTimeout = () => {
    console.log("Resetting session timeout");
    clearTimeout(sessionTimeoutRef.current as number);

    sessionTimeoutRef.current = window.setTimeout(() => {
      setSessionTimeoutModalOpen(true);
    }, 0.3 * 60 * 1000); // 3 minutes
  };
  console.log(sessionTimeoutRef, isSessionTimeoutModalOpen);
  const handleSessionResponse = async (isStillThere: boolean) => {
    console.log("Handling session response. Is still there:", isStillThere);
    setSessionTimeoutModalOpen(false);

    if (isStillThere) {
      try {
        const storedUserString =
          localStorage.getItem("loggedFinanceappUser") || "{}";
        const storedUserData = JSON.parse(storedUserString);
        const token = storedUserData.token || "";

        // Call the refreshToken service with the user's token
        console.log("selected yes, old token", token);
        const newData = await refreshTokenService(token);
        console.log("new token: ", newData);

        // Assuming you have a function like updateUserToken in your auth context
        updateUserToken(newData.token);

        resetSessionTimeout(); // Restart the timer after updating the token
      } catch (error) {
        console.error("Error refreshing token:", error);
        // Handle the case where refreshing the token fails
      }
    } else {
      signOut();
      localStorage.clear(); // Logout if the user is not there
    }
  };
  return (
    <>
      <Router>
        <RegisterModal />
        <Routes>
          <Route path="/" element={<Home portfolios={[]} />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:id" element={<Portfolio />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/quote/:quote" element={<Quote />} />
          <Route path="/:user/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
        </Routes>
      </Router>
      {isSessionTimeoutModalOpen &&
        ReactDOM.createPortal(
          <SessionTimeoutModal
            onConfirm={() => handleSessionResponse(true)}
            onCancel={() => handleSessionResponse(false)}
          />,
          document.body
        )}
    </>
  );
}

export default App;
