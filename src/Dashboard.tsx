import { Card, CardContent, CardHeader } from "@mui/material";
import { usePermissions } from "react-admin";
import { OperatorPage } from "./operador";

export const Dashboard = () => {
  const { permissions, isLoading } = usePermissions();

  if (isLoading) return null;

  if (permissions === "operator") {
    return <OperatorPage />;
  }
  return (
    <Card>
      <CardHeader title="Integración de seguridad informática en redes y sistemas de software (Gpo 402)" />
      <CardContent>
        Equipo 2 - Superhipermegaarchirequete Gran Equipo 2
      </CardContent>
    </Card>
  );
};
