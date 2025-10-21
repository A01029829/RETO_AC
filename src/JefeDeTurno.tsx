import { useRedirect, useGetOne, useGetList } from "react-admin";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Avatar,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import NoteIcon from "@mui/icons-material/Note";
import PersonIcon from "@mui/icons-material/Person";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useMemo } from "react";


export const JefeDeTurnoPage = () => {
  const redirect = useRedirect();
  

  const { data: usuarioActual, isLoading: loadingUsuario } = useGetOne('me', { id: 'current' });
  

  const { data: todosLosUsuarios = [], isLoading: loadingUsuarios } = useGetList('usuarios', {
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'nombre', order: 'ASC' }
  });

  const usuariosMismoTurno = useMemo(() => {
    if (!usuarioActual || !todosLosUsuarios.length) return [];
    
  
    return todosLosUsuarios.filter(usuario => 
      usuario.turno === usuarioActual.turno && 
      usuario.usuario !== usuarioActual.usuario 
    );
  }, [usuarioActual, todosLosUsuarios]);
  
  
  if (loadingUsuario || loadingUsuarios) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!usuarioActual) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Error al cargar información del usuario
        </Typography>
      </Box>
    );
  }

  return (
    <Grid
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
      <Grid
        sx={{
          //backgroundColor: "#fff",
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
          <Grid size={3}>
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
                  onClick={() => redirect("/reportesEH/create")}
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

          {/* Ver Reportes */}
          <Grid size={3}>
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
                  onClick={() => redirect("/reportesEH")}
                  startIcon={<AssessmentIcon />}
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: 12, sm: 14, md: 16 },
                    px: { xs: 1.25, sm: 2 },
                    py: { xs: 1, sm: 1.5 },
                    maxWidth: "100%",
                  }}
                >
                  VER REPORTES
                </Button>
              </Stack>
            </Card>
          </Grid>

          {/* Generar Nota */}
          <Grid size={3}>
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

          {/* Turno */}
          <Grid size={3}>
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
                    MI TURNO
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight={700} textAlign="center">
                    {usuarioActual.turno || 'No asignado'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
                    Turno actual del sistema:
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight={700} textAlign="center">
                    {usuarioActual.turnoActual?.nombre || 'N/A'}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Personas activas */}
        <Grid mt={4}>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            PERSONAS ACTIVAS EN MI TURNO: ({usuariosMismoTurno.length})
          </Typography>

          <Card sx={{ bgcolor: "#eeeeee", borderRadius: 3 }}>
            {usuariosMismoTurno.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No hay otros usuarios asignados a tu turno
                </Typography>
              </Box>
            ) : (
              <Grid
                sx={{
                  p: 3,
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(4, 1fr)",
                  },
                  gap: 3,
                }}
              >
                {usuariosMismoTurno.map((persona) => (
                  <Stack key={persona.id} alignItems="center" spacing={1}>
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
                    <Typography variant="body2" fontWeight={700} textAlign="center">
                      {persona.nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" textAlign="center">
                      {persona.tipo}
                    </Typography>
                  </Stack>
                ))}
              </Grid>
            )}
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};
