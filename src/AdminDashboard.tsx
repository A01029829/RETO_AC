import { Button, useRedirect } from "react-admin";
import { Card, Grid, Box, Typography, Stack, Avatar } from "@mui/material";

export const AdminDashboard = () => {
  const redirect = useRedirect();

  // TODO: Obtener estos datos desde el dataProvider cuando se integre la base de datos
  // Ejemplo: const { data: estadisticas } = useGetOne('estadisticas', { id: 'dashboard' });
  const estadisticas = {
    reportesTurno1: 2, // Número de reportes en el turno actual
    tiempoPromedio: "8 minutos", // Tiempo promedio de llegada a emergencias
  };

  // TODO: Obtener reportes recientes desde el dataProvider
  // Ejemplo: const { data: reportesRecientes } = useGetList('reportes', { 
  //   sort: { field: 'fecha', order: 'DESC' }, 
  //   pagination: { page: 1, perPage: 2 } 
  // });
  const reportesRecientes = [
    {
      id: 1,
      autor: "Bono",
      hora: "10:47 am",
      fecha: "hoy",
      preview: "I have climbed highest mountains.\nI have run through the fields.\nOnly to be with you.\nOnly to be with you.",
    },
    {
      id: 2,
      autor: "Rick",
      hora: "13:56 pm",
      fecha: "hoy",
      preview: "We're no strangers to love.\nYou know the rules, and so do I.\nA full commitment's what I'm thinking of.\nYou wouldn't get this far with any other guy.",
    },
  ];

  // TODO: Obtener notas recientes desde el dataProvider
  // Ejemplo: const { data: notasRecientes } = useGetList('notas', { 
  //   sort: { field: 'fecha', order: 'DESC' }, 
  //   pagination: { page: 1, perPage: 3 } 
  // });
  const notasRecientes = [
    {
      id: 1,
      autor: "Bonnie",
      contenido: "I need a hero.\nI'm holding out for a hero 'til the end of the night.",
    },
    {
      id: 2,
      autor: "Bonnie",
      contenido: "He's gotta be strong, and he's got to be fast.",
    },
    {
      id: 3,
      autor: "Bonnie",
      contenido: "And he's gotta be fresh from the fight.",
    },
  ];

  // Obtener fecha actual formateada
  const fechaActual = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header con título y fecha */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          PÁGINA DE INICIO
        </Typography>

        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {fechaActual.charAt(0).toUpperCase() + fechaActual.slice(1)}
        </Typography>
      </Box>

      {/* Contenido del Dashboard */}
      <Grid container spacing={2}>
        {/* Sección de estadísticas - Card principal con métricas */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            sx={{
              bgcolor: "#d9d9d9",
              borderRadius: 3,
              p: 3,
              height: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            {/* Reportes en el Turno */}
            <Stack alignItems="center" spacing={1}>
              <Typography variant="h2" fontWeight={900} color="primary">
                {estadisticas.reportesTurno1}
              </Typography>
              <Typography variant="h6" fontWeight={700} textAlign="center">
                Reportes en
                <br />
                el Turno 1
              </Typography>
            </Stack>

            {/* Tiempo promedio */}
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
                Tiempo promedio
                <br />
                en llegar a la
                <br />
                Emergencia:
              </Typography>
              <Typography variant="h4" fontWeight={900}>
                {estadisticas.tiempoPromedio}.
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Sección de Notas Recientes */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            sx={{
              bgcolor: "#eeeeee",
              borderRadius: 3,
              p: 2,
              height: "200px",
              overflow: "auto",
            }}
          >
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
              NOTAS RECIENTES
            </Typography>
            <Stack spacing={2}>
              {notasRecientes.map((nota) => (
                <Box key={nota.id} sx={{ display: "flex", gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: "#5fa8d3", width: 40, height: 40 }} />
                  <Box>
                    <Typography variant="body2" fontWeight={700}>
                      Por: {nota.autor}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                      {nota.contenido}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Sección de Reportes Recientes */}
        <Grid size={12}>
          <Card sx={{ bgcolor: "#eeeeee", borderRadius: 3, p: 3 }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
              REPORTES RECIENTES:
            </Typography>
            <Grid container spacing={3}>
              {reportesRecientes.map((reporte) => (
                <Grid size={{ xs: 12, md: 6 }} key={reporte.id}>
                  <Card sx={{ bgcolor: "#fff", borderRadius: 2, p: 2 }}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "#5fa8d3", width: 50, height: 50 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" fontWeight={700}>
                          Reporte generado por: {reporte.autor}, {reporte.fecha}. A las{" "}
                          {reporte.hora}.
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 1,
                            whiteSpace: "pre-line",
                            color: "#666",
                          }}
                        >
                          {reporte.preview}
                        </Typography>
                        {/* TODO: Ajustar ruta según la estructura de recursos en App.tsx */}
                        <Button
                          label="Presiona aquí para ver el reporte"
                          onClick={() => redirect(`/comments/${reporte.id}`)}
                          sx={{
                            mt: 1,
                            fontSize: "0.75rem",
                            textDecoration: "underline",
                            color: "#1f66ad",
                            padding: 0,
                            minWidth: "auto",
                            "&:hover": {
                              backgroundColor: "transparent",
                              textDecoration: "underline",
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}