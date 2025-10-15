import { useRedirect } from "react-admin";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import NoteIcon from "@mui/icons-material/Note";

export const OperatorUPage = () => {
  const redirect = useRedirect();

  const operadorU = {
    nombre: "Tobías Ernesto 'El Toby' del Monte Rodríguez",
    rol: "Operador",
    contacto: "555-789-1011",
    turno: 1,
    foto: "https://media.tenor.com/3Cs_AKNDxRwAAAAM/gato-lengua.gif",
  };

  return (
    <Grid
      className="main-container"
      sx={{
        //backgroundColor: "#1f66ad",
        p: { xs: 1.5, md: 3 },
        //borderRadius: 4,
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Contenedor de blanco */}
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
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            EMERGENCIAS URBANAS
          </Typography>
        </Grid>

        <Grid>
          {/* Contenedor de datos */}
          <Grid container spacing={2}>
            <Grid size={8}>
              <Card
                sx={{ bgcolor: "#eeeeee", borderRadius: 3, height: "100%" }}
              >
                <CardContent
                  sx={{ display: "flex", alignItems: "center", gap: 3 }}
                >
                  <img src={operadorU.foto} alt="foto" width={200} />
                  <Box>
                    <Typography>
                      <b>Nombre:</b> {operadorU.nombre}
                    </Typography>
                    <Typography>
                      <b>Rol:</b> {operadorU.rol}
                    </Typography>
                    <Typography>
                      <b>Contacto:</b> {operadorU.contacto}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={4}>
              <Card
                sx={{
                  bgcolor: "#eeeeee",
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
                    {operadorU.turno}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          </Grid>

          <Grid
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          ></Grid>

          {/* Contenedor de botones */}
          <Grid container spacing={3}>
            {/* Generar Reporte */}
            <Grid size={4}>
              <Card
                sx={{
                  bgcolor: "#eeeeee",
                  borderRadius: 3,
                  height: "100%",
                  //   display: "flex",
                  //   alignItems: "center",
                  //   justifyContent: "center",
                }}
              >
                <Stack alignItems="center" spacing={2}>
                  <Button
                    onClick={() => redirect("/comments/create")}
                    startIcon={<DescriptionIcon />}
                    sx={{ fontWeight: 800, px: 2, py: 1.5 }}
                  >
                    GENERAR REPORTE
                  </Button>
                </Stack>
              </Card>
            </Grid>
            {/* Generar Evidencia */}
            <Grid size={4}>
              <Card
                sx={{
                  bgcolor: "#eeeeee",
                  borderRadius: 3,
                  height: "100%",
                  //   display: "flex",
                  //   alignItems: "center",
                  //   justifyContent: "center",
                }}
              >
                <Stack alignItems="center" spacing={2}>
                  <Button
                    onClick={() => redirect("/photos/create")}
                    startIcon={<PhotoCameraIcon />}
                    sx={{ fontWeight: 800, px: 2, py: 1.5 }}
                  >
                    GENERAR EVIDENCIA
                  </Button>
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
                  //   display: "flex",
                  //   alignItems: "center",
                  //   justifyContent: "center",
                }}
              >
                <Stack alignItems="center" spacing={2}>
                  <Button
                    onClick={() => redirect("/notas/create")}
                    startIcon={<NoteIcon />}
                    sx={{ fontWeight: 800, px: 2, py: 1.5 }}
                  >
                    GENERAR NOTA
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
