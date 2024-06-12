import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import AppRoutes from "@routes/Routes";
import AuthContext from "@components/contexts/AuthContext";

import "react-toastify/dist/ReactToastify.css";
import WaitForContext from "@components/misc/WaitForContext.tsx";

const googleClientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />

    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthContext>
        <WaitForContext>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </WaitForContext>
      </AuthContext>
    </GoogleOAuthProvider>

    <ToastContainer
      className="text-sm"
      position="top-right"
      closeButton={false}
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      draggable
      theme="dark"
    />
  </ThemeProvider>
);

export default App;
