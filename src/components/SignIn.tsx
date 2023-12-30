import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import loginService from "../services/login";
import portfolioService from "../services/portfolios";
import watchlistService from "../services/watchlist";
import PositionedSnackbar from "./PositionedSnackbar";
import "../App.css";
import { FaUncharted } from "react-icons/fa";

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "info",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (event: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get("username"),
      password: data.get("password"),
    });

    try {
      const cred = {
        username: data.get("username"),
        password: data.get("password"),
      };
      let username = "";
      let password = "";
      if (
        typeof cred.username === "string" &&
        typeof cred.password === "string"
      ) {
        username = cred.username;
        password = cred.password;
      }
      const user = await loginService.login({
        username,
        password,
      });
      signIn(user);
      portfolioService.setToken(user.token);
      watchlistService.setToken(user.token);
      navigate("/");
      console.log(user);
      setSnackbar({
        open: true,
        message: `${username} successfully signed in!`,
        type: "success",
      });
    } catch (exception) {
      setSnackbar({
        open: true,
        message: "Wrong credentials!",
        type: "error",
      });
    }
  };

  return (
    <div className="sign-in">
      <div className="sign-in-inner">
        <div className="form-container">
          <div className="form-inner">
            <div className="sign-in-logo">
              {" "}
              <FaUncharted size={24} />
              <Link to={"/"}>Finhub</Link>
            </div>
            <div className="header-container">
              <h1>Sign in</h1>
            </div>
            <form onSubmit={handleSubmit} className="signin-form">
              <label>Username:</label>
              <input
                type="username"
                name="username"
                autoComplete="username"
                autoFocus
                required
              />
              <label>Password:</label>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
              />
              <div className="checkbox-container">
                <input type="checkbox" id="remember" name="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <button type="submit">Sign In</button>
            </form>
            <div className="links-container">
              <Link to={"/"}>Forgot password?</Link>
              <Link to={"/register"}>Create account</Link>
            </div>
            {snackbar.open && (
              <PositionedSnackbar
                message={snackbar.message}
                type={snackbar.type}
                isOpen={snackbar.open}
                onClose={handleSnackbarClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
