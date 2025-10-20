import React, { useState } from "react";
import { AppBar } from "react-admin";
import { IconButton, Tooltip, Menu, MenuItem, Typography, Divider, Switch, ListItemText} from "@mui/material";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import { useAccessibility } from "./Accessibility";

export const MyBar = () => {
  const { setFontSize, toggleDyslexicFont, dyslexicEnabled } = useAccessibility();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar
      sx={{
        backgroundColor: "#1976d2",
        color: "white",
      }}
    >
      <Typography
        variant="h6"
        sx={{ flex: 1, textAlign: "left", marginLeft: "1rem", fontWeight: 600 }}
      >
        Protección Civil
      </Typography>

      <Tooltip title="Accesibilidad">
        <IconButton color="inherit" onClick={handleOpen}>
          <AccessibilityNewIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Typography variant="subtitle1" sx={{ px: 2, py: 1, fontWeight: 600 }}>
          Opciones de accesibilidad
        </Typography>
        <Divider />

        <Typography variant="body2" sx={{ px: 2, mt: 1 }}>
          Tamaño de letra
        </Typography>
        <MenuItem onClick={() => setFontSize("12px")}>Pequeña</MenuItem>
        <MenuItem onClick={() => setFontSize("16px")}>Normal</MenuItem>
        <MenuItem onClick={() => setFontSize("18px")}>Grande</MenuItem>
        <MenuItem onClick={() => setFontSize("20px")}>Muy grande</MenuItem>
        <MenuItem onClick={() => setFontSize("22px")}>Extra grande</MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem>
          <ListItemText primary="OpenDyslexic" />
          <Switch checked={dyslexicEnabled} onChange={toggleDyslexicFont} />
        </MenuItem>
      </Menu>
    </AppBar>
  );
};
