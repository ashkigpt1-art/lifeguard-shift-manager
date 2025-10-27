import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript, extendTheme, theme as baseTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./hooks/useAuth";

const theme = extendTheme({
  config: { initialColorMode: "light", useSystemColorMode: false },
  colors: {
    brand: {
      50: "#e1f5ff",
      100: "#b3e0ff",
      200: "#84cbff",
      300: "#55b7ff",
      400: "#27a2ff",
      500: "#0d89e6",
      600: "#026ab4",
      700: "#004c82",
      800: "#002e51",
      900: "#001020"
    }
  },
  fonts: {
    heading: `"Inter", ${baseTheme.fonts?.heading}`,
    body: `"Inter", ${baseTheme.fonts?.body}`
  }
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
