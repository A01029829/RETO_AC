import { Button, useRedirect } from "react-admin";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Stack,
  Avatar,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import NoteIcon from "@mui/icons-material/Note";
import PersonIcon from "@mui/icons-material/Person";

const turno = 1;
const personasActivas = [
  { id: "p1", nombre: "Persona 1" },
  { id: "p2", nombre: "Persona 2" },
  { id: "p3", nombre: "Persona 3" },
  { id: "p4", nombre: "Persona 4" },
];

export const JefeDeTurnoPage = () => {
  const redirect = useRedirect();

  return (
    <Grid
      sx={{
        backgroundColor: "#1f66ad",
        p: { xs: 1.5, md: 3 },
        //borderRadius: 4,
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid
        sx={{
          backgroundColor: "#fff",
          borderRadius: 3,
          p: { xs: 2, md: 4, lg: 6 },
          width: "100%",
          height: "100%",
        }}
      >
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h4" fontWeight={800}>
            EMERGENCIAS PREHOSPITALARIAS
          </Typography>
        </Grid>

        {/* Generar Reporte */}
        <Grid container spacing={3}>
          <Grid size={4}>
            <Card
              sx={{
                bgcolor: "#eeeeee",
                borderRadius: 3,
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Stack alignItems="center" spacing={2}>
                <Button
                  label="GENERAR REPORTE"
                  onClick={() => redirect("/comments/create")}
                  startIcon={<DescriptionIcon />}
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: 12, sm: 14, md: 16 },
                    px: { xs: 1.25, sm: 2 },
                    py: { xs: 1, sm: 1.5 },
                    maxWidth: "100%",
                  }}
                />
              </Stack>
            </Card>
          </Grid>

          {/* Generar Nota */}
          <Grid size={4}>
            <Card
              sx={{
                bgcolor: "#eeeeee",
                borderRadius: 3,
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Stack alignItems="center" spacing={2}>
                <Button
                  label="GENERAR NOTA"
                  onClick={() => redirect("/comments/create")}
                  startIcon={<NoteIcon />}
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: 12, sm: 14, md: 16 },
                    px: { xs: 1.25, sm: 2 },
                    py: { xs: 1, sm: 1.5 },
                    maxWidth: "100%",
                  }}
                />
              </Stack>
            </Card>
          </Grid>

          {/* Turno */}
          <Grid size={4}>
            <Card
              sx={{
                bgcolor: "#eeeeee",
                borderRadius: 3,
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Stack alignItems="center" spacing={0.5}>
                  <Typography variant="h5" fontWeight={800}>
                    TURNO
                  </Typography>
                  <Typography variant="h3" color="primary" fontWeight={900}>
                    {turno}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Personas activas */}
        <Grid mt={4}>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            PERSONAS ACTIVAS EN EL TURNO:
          </Typography>

          <Card sx={{ bgcolor: "#eeeeee", borderRadius: 3 }}>
            <Grid
              sx={{
                p: 3,
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(4, 1fr)",
                },
                gap: 3,
              }}
            >
              {personasActivas.map((p) => (
                <Stack key={p.id} alignItems="center" spacing={1}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: "transparent",
                      border: "6px solid",
                      borderColor: "primary.main",
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 60, color: "primary.main" }} />
                  </Avatar>
                </Stack>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};
