import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import usersService from "../services/users";
import loginService from "../services/login";
import portfolioService from "../services/portfolios";
import watchlistService from "../services/watchlist";
/* import PositionedSnackbar from "../PositionedSnackbar"; */
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const cred = {
        name: data.get("name"),
        username: data.get("username"),
        password: data.get("password"),
      };

      let usernameStr = "";
      let passwordStr = "";
      let nameStr = "";
      if (
        typeof cred.name === "string" &&
        typeof cred.username === "string" &&
        typeof cred.password === "string"
      ) {
        nameStr = cred.name;
        usernameStr = cred.username;
        passwordStr = cred.password;
      }

      // Create a new user
      const newUser = await usersService.createUser({
        name: nameStr,
        username: usernameStr,
        password: passwordStr,
      });

      // Log in the newly created user
      const user = await loginService.login({
        username: usernameStr,
        password: passwordStr,
      });

      signIn(user);
      portfolioService.setToken(user.token);
      watchlistService.setToken(user.token);
      navigate("/");
      console.log(user);
      setSnackbar({
        open: true,
        message: `${nameStr} successfully registered and signed in!`,
        type: "success",
      });
    } catch (exception) {
      setSnackbar({
        open: true,
        message: "Error during registration or login",
        type: "error",
      });
    }
  };
  return (
    <div className="register">
      <div className="register-inner">
        <div className="form-container">
          <div className="form-inner">
            <div className="sign-in-logo">
              {" "}
              <FaUncharted size={24} />
              <Link to={"/"}>Finhub</Link>
            </div>
            <div className="header-container">
              <h1>Create an account</h1>
            </div>
            <form onSubmit={handleSubmit} className="register-form">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                autoComplete="name"
                autoFocus
                required
              />

              <label>Username:</label>
              <input
                type="text"
                name="username"
                autoComplete="username"
                required
              />

              <label>Password:</label>
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                required
              />

              {/*          <input type="email" name="email" autoComplete="email" required /> */}

              <button type="submit">Register</button>
            </form>
            <div className="links-container">
              <Link to={"/login"}>Have an account? Sign in</Link>
            </div>
            {/*    {snackbar.open && (
              <PositionedSnackbar
                message={snackbar.message}
                type={snackbar.type}
                isOpen={snackbar.open}
                onClose={handleSnackbarClose}
              />
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
