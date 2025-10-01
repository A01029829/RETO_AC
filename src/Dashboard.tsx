import { Card, CardContent, CardHeader, Box, Grid } from "@mui/material";
import { usePermissions } from "react-admin";
import { OperatorPage } from "./operador";
import { JefeDeTurnoPage } from "./JefeDeTurno";
import { OperatorUPage } from "./operatorU";
import { AdminDashboard } from "./AdminDashboard.tsx";

export const Dashboard = () => {
  const { permissions, isLoading } = usePermissions();

  if (isLoading) return null;

  if (permissions === "operator") {
    return <OperatorPage />;
  }
  if (permissions === "jefeDeTurno") {
    return <JefeDeTurnoPage />;
  }
  if (permissions === "operatorU") {
    return <OperatorUPage />;
  }
  if(permissions === "admin"){
    return <AdminDashboard />;
  }
  return (
    <>
        <Grid size={{ xs: 12, md: 6 }}>
            <CardHeader title="PAGINA DE INICIO" />
    
            <Card  >
                <CardHeader title="Integración de seguridad informática en redes y sistemas de software (Gpo 402)" />
                <CardContent>Equipo 2 - Superhipermegaarchirequete Gran Equipo 2</CardContent>
            </Card>
        </Grid>
        
        <Box>
            <h1>REPORTES RECIENTES</h1>
            <Card sx={{ mt: 2,
                    backgroundColor: "#e8e8e8"
                }}>
                
                <CardHeader title="Integrantes" />
            </Card>
        </Box>
        

        
    </>
  );
};
