import { useRedirect } from "react-admin";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import NoteIcon from "@mui/icons-material/Note";

export const OperatorPage = () => {
  const redirect = useRedirect();

  const operador = {
    nombre: "Juanito",
    rol: "Paramédico",
    contacto: "555-123-456",
    turno: 1,
    foto: "https://www.shutterstock.com/image-photo/beige-cat-doctor-medical-hat-260nw-2103390197.jpg",
  };

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
            EMERGENCIAS PREHOSPITALARIAS
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
                  <img src={operador.foto} alt="foto" width={200} />
                  <Box>
                    <Typography>
                      <b>Nombre:</b> {operador.nombre}
                    </Typography>
                    <Typography>
                      <b>Rol:</b> {operador.rol}
                    </Typography>
                    <Typography>
                      <b>Contacto:</b> {operador.contacto}
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
                    {operador.turno}
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
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: 12, sm: 14, md: 16 },
                      px: { xs: 1.25, sm: 2 },
                      py: { xs: 1, sm: 1.5 },
                      maxWidth: "100%",
                    }}
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
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: 12, sm: 14, md: 16 },
                      px: { xs: 1.25, sm: 2 },
                      py: { xs: 1, sm: 1.5 },
                      maxWidth: "100%",
                    }}
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
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: 12, sm: 14, md: 16 },
                      px: { xs: 1.25, sm: 2 },
                      py: { xs: 1, sm: 1.5 },
                      maxWidth: "100%",
                    }}
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
