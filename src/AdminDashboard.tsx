import { Button, useRedirect, useDataProvider } from "react-admin";
import { Card, Grid, Box, Typography, Stack, Avatar } from "@mui/material";
import { useEffect, useState } from "react";

interface Estadisticas {
  reportesTurno1: number;
  tiempoPromedio: string;
}

interface ReporteReciente {
  id: number;
  autor: string;
  hora: string;
  fecha: string;
  preview: string;
}

interface NotaReciente {
  id: number;
  autor: string;
  contenido: string;
}

export const AdminDashboard = () => {
  const redirect = useRedirect();
  const dataProvider = useDataProvider();

  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    reportesTurno1: 0,
    tiempoPromedio: "0 minutos",
  });

  const [reportesRecientes, setReportesRecientes] = useState<ReporteReciente[]>([]);
  const [notasRecientes, setNotasRecientes] = useState<NotaReciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatosDashboard = async () => {
      try {
        setLoading(true);

        const [estadisticasData, reportesData, notasData] = await Promise.all([
          dataProvider.getOne('dashboard/estadisticas', { id: 'stats' })
            .then(({ data }) => data)
            .catch(err => {
              console.error('Error cargando estadisticas:', err);
              return { reportesTurno1: 0, tiempoPromedio: "0 minutos" };
            }),

          dataProvider.getList('dashboard/reportes-recientes', {
            pagination: { page: 1, perPage: 2 },
            sort: { field: 'fecha', order: 'DESC' },
            filter: {}
          })
            .then(({ data }) => data)
            .catch(err => {
              console.error('Error cargando reportes:', err);
              return [];
            }),

          dataProvider.getList('dashboard/notas-recientes', {
            pagination: { page: 1, perPage: 3 },
            sort: { field: 'fecha', order: 'DESC' },
            filter: {}
          })
            .then(({ data }) => data)
            .catch(err => {
              console.error('Error cargando notas:', err);
              return [];
            })
        ]);

        setEstadisticas(estadisticasData);
        setReportesRecientes(reportesData);
        setNotasRecientes(notasData);
      } catch (err) {
        console.error('Error general cargando dashboard:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    cargarDatosDashboard();
  }, [dataProvider]);

  // Obtener fecha actual formateada
  const fechaActual = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Cargando dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Error al cargar el dashboard: {error}
        </Typography>
      </Box>
    );
  }

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
                      <Avatar
                        sx={{ bgcolor: "#5fa8d3", width: 50, height: 50 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" fontWeight={700}>
                          Reporte generado por: {reporte.autor}, {reporte.fecha}
                          . A las {reporte.hora}.
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
};
