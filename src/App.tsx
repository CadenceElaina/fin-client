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
import Portfolio from "./components/Portfolio";

function App() {
  /*   const user = null; */
  return (
    <>
      <Router>
        <RegisterModal />
        <Routes>
          <Route path="/" element={<Home portfolios={[]} />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
