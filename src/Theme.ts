import { defaultTheme } from "react-admin";
import { createTheme } from "@mui/material/styles";

export const customTheme = createTheme({
  ...defaultTheme,
  palette: {
    mode: "light",
    primary: {
      main: "#1a3e78",
    },
    secondary: {
      main: "#fbc02d",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
  },
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          margin: "4px 8px",
        },
      },
    },
  },
});
