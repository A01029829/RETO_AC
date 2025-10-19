import { useRedirect, useDataProvider } from "react-admin";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import NoteIcon from "@mui/icons-material/Note";
import { useEffect, useState } from "react";

interface UsuarioActual {
  usuario: string;
  nombre: string;
  tipo: string;
  turno: string;
  turnoActual: {
    nombre: string;
    descripcion: string;
    horario: string;
    codigo: string;
  };
}

export const OperatorPage = () => {
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  
  const [usuario, setUsuario] = useState<UsuarioActual | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarUsuarioActual = async () => {
      try {
        setLoading(true);
        const { data } = await dataProvider.getOne('me', { id: 'current' });
        setUsuario(data);
      } catch (err) {
        console.error('Error cargando usuario:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    cargarUsuarioActual();
  }, [dataProvider]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !usuario) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Error al cargar información del usuario: {error}
        </Typography>
      </Box>
    );
  }

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
                  src="https://www.shutterstock.com/image-photo/beige-cat-doctor-medical-hat-260nw-2103390197.jpg"
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
                    <b>Nombre:</b> {usuario.nombre}
                  </Typography>
                  <Typography>
                    <b>Usuario:</b> {usuario.usuario}
                  </Typography>
                  <Typography>
                    <b>Rol:</b> {usuario.tipo}
                  </Typography>
                  <Typography>
                    <b>Turno Asignado:</b> {usuario.turno || 'No asignado'}
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
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
              }}
            >
              <Stack alignItems="center" spacing={1}>
                <Typography variant="h6" fontWeight={800} textAlign="center">
                  TURNO ACTUAL
                </Typography>
                <Typography variant="h5" color="primary" fontWeight={900} textAlign="center">
                  {usuario.turnoActual.nombre}
                </Typography>
                <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
                  {usuario.turnoActual.horario}
                </Typography>
                <Typography variant="caption" textAlign="center" color="text.secondary">
                  {usuario.turnoActual.descripcion}
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
