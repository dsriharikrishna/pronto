import { createRoot } from "react-dom/client";
// import './index.css'
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./components/redux/store.jsx";
import "@fontsource/poppins";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./components/styles/theme.js";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GoogleOAuthProvider clientId="967502586803-i1pmsqkh14mht406mr0ro8usbic4k561.apps.googleusercontent.com">
        <BrowserRouter>
          <App />
          <ToastContainer
            limit={1}
            // position="top-right"
            autoClose={1000}
            // hideProgressBar={false}
            // newestOnTop={false}
            closeOnClick
            // pauseOnFocusLoss
            // draggable
            // pauseOnHover
            // theme="colored"
          />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ThemeProvider>
  </Provider>
);
