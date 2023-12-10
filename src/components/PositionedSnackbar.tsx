import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

type SnackbarType = "info" | "success" | "error" | "warning";

interface SnackbarProps {
  message: string;
  type: SnackbarType;
  isOpen: boolean;
  onClose: () => void;
}

interface State extends SnackbarOrigin {
  isOpen: boolean;
  message: string;
  type: SnackbarType;
}

export default function PositionedSnackbar({
  message,
  type,
  isOpen,
  onClose,
}: SnackbarProps) {
  const [state, setState] = React.useState<State>({
    isOpen: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    type: "info",
  });
  const { vertical, horizontal } = state;

  React.useEffect(() => {
    if (message) {
      setState({
        ...state,
        isOpen: true,
        message,
        type,
      });

      // Set a timeout to close the Snackbar after 3000ms (adjust as needed)
      const timeoutId = setTimeout(() => {
        handleClose();
      }, 3000);

      // Clear the timeout when the component unmounts or the Snackbar is closed manually
      return () => clearTimeout(timeoutId);
    }
  }, [message, type]);

  const handleClick = (newState: SnackbarOrigin) => {
    setState({
      ...newState,
      isOpen: true,
      message: state.message,
      type: state.type,
    });
  };

  const handleClose = () => {
    setState({ ...state, isOpen: false });
    onClose(); // Call the onClose callback to notify the parent component
  };

  const buttons = (
    <React.Fragment>
      <Grid container justifyContent="center">
        <Grid item xs={6}></Grid>
      </Grid>
    </React.Fragment>
  );

  return (
    <Box sx={{ width: 500 }}>
      {buttons}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={isOpen}
        onClose={handleClose}
        key={vertical + horizontal}
        TransitionComponent={Slide}
        transitionDuration={500} // Adjust the duration as needed
      >
        <Alert severity={type} onClose={handleClose}>
          {state.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
