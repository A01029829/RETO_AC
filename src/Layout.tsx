import type { ReactNode } from "react";
import { Layout as RALayout, CheckForApplicationUpdate, Sidebar, Menu } from "react-admin";
import { Box } from "@mui/material";

// Custom Sidebar with styling
const CustomSidebar = (props: any) => (
  <Sidebar
    sx={{
      "& .RaSidebar-drawerPaper": {
        backgroundColor: "#0064af", // Color azul del contenedor
        width: 200, // Ancho del sidebar aumentado
        paddingTop: 2,
        paddingX: 2,
      },
    }}
    {...props}
  >
    {/* Logo en la parte superior */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 2,
        paddingY: 2,
      }}
    >
      <Box
        component="img"
        src="/CuajisSVG.svg" // Puedes cambiar esto por tu logo
        alt="Logo"
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
        }}
      />
    </Box>
    {/* Contenedor/Grid grande para el menú */}
    <Box
      sx={{
        backgroundColor: "#B8D8E8", // Color del contenedor grande
        borderRadius: "16px",
        padding: 2,
        margin: 1,
      }}
    >
      <Menu
        sx={{
          "& .RaMenuItemLink-root": {
            borderRadius: "12px", // Bordes redondeados
            marginBottom: 2, // Mayor separación entre botones (era 1)
            paddingY: 2, // Mayor padding vertical (era 1.5)
            paddingX: 2,
            textAlign: "center",
            backgroundColor: "#236eb1", // Color azul de los botones no seleccionados
            color: "#000000", // Texto negro
            fontWeight: 600,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#1e5c9a", // Color más oscuro al pasar el mouse
              transform: "translateX(4px)",
            },
            "&.RaMenuItemLink-active": {
              backgroundColor: "#ffffff", // Color blanco para el item activo
              color: "#000000", // Texto negro para el item activo
            },
          },
          "& .MuiListItemIcon-root": {
            display: "none", // Ocultar iconos si los hay
          },
          "& .MuiTypography-root": {
            fontSize: "0.95rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          },
        }}
      />
    </Box>
  </Sidebar>
);

export const Layout = ({ children }: { children: ReactNode }) => (
  <RALayout 
    sidebar={CustomSidebar}
    sx={{
      "& .RaLayout-content": {
        marginLeft: "50px", // Debe coincidir con el ancho del sidebar
        padding: 3,
        transition: "margin-left 0.3s ease",
      },
      // Para cuando el sidebar está cerrado en móviles
      "& .RaLayout-contentWithSidebar": {
        display: "flex",
        flexGrow: 1,
      },
    }}
  >
    {children}
    <CheckForApplicationUpdate />
  </RALayout>
);
