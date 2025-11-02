
// src/contexts/SnackbarContext.js
import React, { createContext, useState, useCallback, useContext } from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",     // info | success | error | warning
    duration: 3000,
    position: { vertical: "bottom", horizontal: "center" },
    variant: "filled",    // filled | outlined | standard
  });

  const showSnackbar = useCallback(
    ({
      message,
      severity = "info",
      duration = 3000,
      position = { vertical: "bottom", horizontal: "center" },
      variant = "filled",
    }) => {
      setSnack({
        open: true,
        message,
        severity,
        duration,
        position,
        variant,
      });
    },
    []
  );

  const handleClose = useCallback(() => {
    setSnack(prev => ({ ...prev, open: false }));
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snack.open}
        autoHideDuration={snack.duration}
        onClose={handleClose}
        anchorOrigin={snack.position}
      >
        <Alert
          onClose={handleClose}
          severity={snack.severity}
          variant={snack.variant}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
