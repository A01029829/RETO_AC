import { useRedirect } from "react-admin";
import {
  Card,
  CardContent,
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
    <Box
      //className="main-container"
      sx={{
        p: { xs: 1.5, md: 3 },
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Contenedor blanco */}
      <Box
        sx={{
          //backgroundColor: "#fff",
          borderRadius: 3,
          p: { xs: 2, md: 4, lg: 6 },
          width: "100%",
          height: "100%",
        }}
      >
        {/* Header */}
        <Box
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
        </Box>

        {/* Contenedor de datos */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 3,
          }}
        >
          {/* Card Operador */}
          <Box sx={{ flex: { xs: "1 1 100%", md: "0 1 66%" } }}>
            <Card sx={{ bgcolor: "#eeeeee", borderRadius: 3, height: "100%" }}>
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  flexWrap: "wrap",
                }}
              >
                <Box
                  component="img"
                  src={operador.foto}
                  alt="foto"
                  sx={{
                    width: { xs: 120, sm: 160, md: 200 },
                    height: "auto",
                    borderRadius: 2,
                    objectFit: "cover",
                  }}
                />
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
          </Box>

          {/* Card Turno */}
          <Box sx={{ flex: { xs: "1 1 100%", md: "0 1 34%" } }}>
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
          </Box>
        </Box>

        {/* Contenedor de botones */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {/* Generar Reporte */}
          <Card sx={{ bgcolor: "#eeeeee", borderRadius: 3, height: "100%" }}>
            <Stack alignItems="center" spacing={2} sx={{ p: 2 }}>
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

          {/* Generar Evidencia */}
          <Card sx={{ bgcolor: "#eeeeee", borderRadius: 3, height: "100%" }}>
            <Stack alignItems="center" spacing={2} sx={{ p: 2 }}>
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

          {/* Generar Nota */}
          <Card sx={{ bgcolor: "#eeeeee", borderRadius: 3, height: "100%" }}>
            <Stack alignItems="center" spacing={2} sx={{ p: 2 }}>
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
        </Box>
      </Box>
    </Box>
  );
};
