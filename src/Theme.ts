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
      main: "#2d6efbff",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
  },
  sidebar: {
    width: 240,
    closedWidth: 55,
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
    
    MuiDrawer: {
      styleOverrides: {
        paper: {
          marginLeft: '0px', 
          height: 'calc(100vh - 32px)', 
          marginTop: '16px', 
          marginBottom: '16px',
          borderRadius: '0 0', 
        },
      },
    },

    RaLayout:{
      styleOverrides: {
        root: {
          '& .RaLayout-contentWithSidebar': {
            marginLeft: '16px', // Compensar el espacio de la sidebar
          },
        },
      }   
    }
  },
});
