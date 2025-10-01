import type { ReactNode } from "react";
import { Layout as RALayout, CheckForApplicationUpdate, Sidebar, Menu, useSidebarState } from "react-admin";
import { Box, useMediaQuery, Theme } from "@mui/material";

// Custom Sidebar with styling
const CustomSidebar = (props: any) => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const [isSidebarOpen] = useSidebarState();

  const drawerWidth = isSidebarOpen
    ? (isSmall ? 70 : isMedium ? 160 : 180)
    : (isSmall ? 64 : 72);

  const menuItemSpacing = isSidebarOpen
    ? {
        paddingX: isSmall ? 2 : isMedium ? 1 : 2,
        paddingY: 2,
        margin: "5px auto",
      }
    : {
        paddingX: 1.25,
        paddingY: 2,
        margin: "5px auto",
      };

  const menuItemWidths = isSidebarOpen
    ? {
        minWidth: isSmall ? "210px" : isMedium ? "56px" : "auto",
        width: isSmall ? "210px" : isMedium ? "100%" : "210px",
        maxWidth: isSmall ? "210px" : isMedium ? "100%" : "210px",
      }
    : {
        minWidth: "100%",
        width: "100%",
        maxWidth: "100%",
      };

  return (
    <Sidebar
      sx={{
        "& .RaSidebar-drawerPaper": {
          backgroundColor: "#0064af",
          width: drawerWidth,
          paddingTop: isSmall ? 0.5 : 2,
          paddingX: isSmall ? 0.5 : isMedium ? 1 : 1.5,
          overflowX: "hidden",
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
          marginBottom: isSmall ? 0.5 : isMedium ? 1 : 2,
          paddingY: isSmall ? 0.5 : isMedium ? 1 : 2,
        }}
      >
        <Box
          component="img"
          src="/CuajisSVG.svg"
          alt="Logo"
          sx={{
            width: isSmall ? 60 : isMedium ? 60 : 80,
            height: isSmall ? 60 : isMedium ? 60 : 80,
            borderRadius: "50%",
          }}
        />
      </Box>
      {/* Contenedor/Grid grande para el menú */}
      <Box
        sx={{
          backgroundColor: "#B8D8E8",
          borderRadius: isSmall ? "6px" : isMedium ? "12px" : "16px",
          padding: isSmall ? 0.5 : isMedium ? 1 : 1.2,
          margin: isSmall ? 0.2 : isMedium ? 0.5 : 0.6,
          overflow: "hidden",
          maxWidth: isSidebarOpen ? (isSmall ? "100%" : isMedium ? "100%" : "240px") : "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Menu
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            "& .RaMenuItemLink-root": {
              borderRadius: isSmall ? "6px" : isMedium ? "8px" : "10px",
              marginBottom: isSmall ? 0.5 : isMedium ? 1 : 2,
              paddingY: menuItemSpacing.paddingY,
              paddingX: menuItemSpacing.paddingX,
              textAlign: "center",
              backgroundColor: "#236eb1",
              color: "#000000",
              fontWeight: 600,
              transition: "all 0.3s ease",
              minHeight: "32px",
              ...menuItemWidths,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: menuItemSpacing.margin,
              "&:hover": {
                backgroundColor: "#1e5c9a",
                transform: isSmall ? "scale(1.0)" : "translateX(4px)",
              },
              "&.RaMenuItemLink-active": {
                backgroundColor: "#ffffff",
                color: "#000000",
              },
            },
            "& .MuiListItemIcon-root": {
              display: "flex",
              minWidth: isSmall ? "auto" : "40px",
              color: "#000000",
              justifyContent: "center",
              fontSize: isSmall ? "2rem" : "1.5rem",
            },
            "& .MuiListItemText-root": {
              display: isSidebarOpen ? "block" : "none",
              marginLeft: isSidebarOpen ? (isSmall ? 1 : 1) : 0,
              transition: "opacity 0.3s ease",
              opacity: isSidebarOpen ? 1 : 0,
            },
            "& .MuiTypography-root": {
              fontSize: isSmall ? "0.85rem" : isMedium ? "0.95rem" : "0.95rem",
              textTransform: "uppercase",
              letterSpacing: isSmall ? "0.2px" : isMedium ? "0.3px" : "0.3px",
            },
          }}
        />
      </Box>
    </Sidebar>
  );
};

export const Layout = ({ children }: { children: ReactNode }) => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <RALayout 
      sidebar={CustomSidebar}
      sx={{
        "& .RaLayout-content": {
          marginLeft: isSmall ? 0 : "50px",
          padding: isSmall ? 1 : 3,
          transition: "margin-left 0.3s ease",
        },
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
};
