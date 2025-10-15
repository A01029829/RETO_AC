import { Card, CardContent, CardHeader, Box, Grid } from "@mui/material";
import { usePermissions } from "react-admin";
import { OperatorPage } from "./operador";
import { JefeDeTurnoPage } from "./JefeDeTurno";
import { OperatorUPage } from "./operatorU";
import { AdminDashboard } from "./AdminDashboard.tsx";

export const Dashboard = () => {
  const { permissions, isLoading } = usePermissions();

  if (isLoading) return null;

  // Redirigir según el tipo de usuario
  if (permissions === "operador") {
    return <OperatorPage />;
  }
  if (permissions === "jefeDeTurno") {
    return <JefeDeTurnoPage />;
  }
  if (permissions === "operatorU") {
    return <OperatorUPage />;
  }
  if(permissions === "administrador"){
    return <AdminDashboard />;
  }
  
  // Dashboard por defecto (no debería llegar aquí)
  return (
    <>
        <Grid size={{ xs: 12, md: 6 }}>
            <CardHeader title="PÁGINA DE INICIO" />
    
            <Card>
                <CardHeader title="Protección Civil - Sistema de Reportes" />
                <CardContent>Bienvenido al sistema</CardContent>
            </Card>
        </Grid>
    </>
  );
};
