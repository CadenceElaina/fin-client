import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import loginService from "../services/login";
import portfolioService from "../services/portfolios";
import PositionedSnackbar from "./PositionedSnackbar";
import { useNavigate } from "react-router-dom";
import { SnackbarType } from "../types/types";
import { useAuth } from "../context/AuthContext";
import "../App.css";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  /*   const [user, setUser] = useState(null); */
  const { signIn } = useAuth();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "info",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });

    try {
      const cred = {
        email: data.get("email"),
        password: data.get("password"),
      };
      let username = "";
      let password = "";
      if (typeof cred.email === "string" && typeof cred.password === "string") {
        username = cred.email;
        password = cred.password;
      }
      const user = await loginService.login({
        username,
        password,
      });
      signIn(user); // Update AuthContext with the signed-in user
      portfolioService.setToken(user.token);
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
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
          {snackbar.open && (
            <PositionedSnackbar
              message={snackbar.message}
              type={snackbar.type as SnackbarType}
              isOpen={snackbar.open}
              onClose={handleSnackbarClose}
            />
          )}
        </ThemeProvider>
      </div>
    </div>
  );
}
