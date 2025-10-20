import { Button, useRedirect, useGetList } from "react-admin";
import { Card, Grid, Box, Typography, Stack, Avatar } from "@mui/material";
import { useMemo } from "react";

export const AdminDashboard = () => {
  const redirect = useRedirect();

  // Uso de hooks de react Admin
  const { data: reportesEH = [], isLoading: loadingReportes } = useGetList(
    'reportesEH',
    {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'hora_llamada', order: 'DESC' }
    }
  );

  const { data: notas = [], isLoading: loadingNotas } = useGetList(
    'notas',
    {
      pagination: { page: 1, perPage: 3 },
      sort: { field: 'fecha_creacion', order: 'DESC' }
    }
  );

  // Calcular estadisticas
  const estadisticas = useMemo(() => {
    if (!reportesEH.length) {
      return {
        reportesTurno1: 0,
        tiempoPromedio: "0 min",
        reportesRecientes: []
      };
    }

    // Calcular estadisticas del turno actual
    const ahora = new Date();
    const inicioTurno = new Date(ahora);
    inicioTurno.setHours(8, 0, 0, 0); // Turno 1: 8:00 AM

    const reportesDelTurno = reportesEH.filter((r: any) => {
      const fechaReporte = new Date(r.hora_llamada);
      return fechaReporte >= inicioTurno && fechaReporte <= ahora;
    });

    // Calcular tiempo promedio de respuesta
    const tiemposRespuesta: number[] = [];
    reportesDelTurno.forEach((r: any) => {
      if (r.hora_llamada && r.hora_llegada) {
        try {
          console.log('Procesando reporte:', {
            id: r.id,
            hora_llamada: r.hora_llamada,
            hora_llegada: r.hora_llegada,
            tipo_hora_llamada: typeof r.hora_llamada,
            tipo_hora_llegada: typeof r.hora_llegada
          });

          const llamada = new Date(r.hora_llamada);
          
          // Verificar si hora_llegada es string o Date
          let llegada: Date;
          if (typeof r.hora_llegada === 'string') {
            // Si es string en formato "HH:mm:ss"
            const [horas, minutos, segundos] = r.hora_llegada.split(':').map(Number);
            llegada = new Date(llamada);
            llegada.setHours(horas, minutos, segundos || 0);
            
            // Si la hora de llegada es menor que la de llamada, probablemente cruzó la medianoche
            if (llegada < llamada) {
              llegada.setDate(llegada.getDate() + 1);
            }
          } else {
            // Si es un objeto Date
            llegada = new Date(r.hora_llegada);
          }
          
          const diferencia = Math.abs(llegada.getTime() - llamada.getTime());
          const minutos = diferencia / 60000;
          
          console.log('Tiempo calculado:', minutos, 'minutos');
          tiemposRespuesta.push(minutos);
        } catch (error) {
          console.error('Error calculando tiempo de respuesta:', error, r);
        }
      }
    });

    const promedio = tiemposRespuesta.length > 0
      ? tiemposRespuesta.reduce((a, b) => a + b, 0) / tiemposRespuesta.length
      : 0;

    return {
      reportesTurno1: reportesDelTurno.length,
      tiempoPromedio: `${Math.round(promedio)} min`,
      reportesRecientes: reportesEH.slice(0, 2) // Solo los 2 mas recientes
    };
  }, [reportesEH]);

  const loading = loadingReportes || loadingNotas;

  // Obtener fecha actual formateada
  const fechaActual = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Funcion para formatear la fecha del reporte
  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Funcion para formatear la hora del reporte
  const formatearHora = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Cargando dashboard...</Typography>
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
                {estadisticas.tiempoPromedio}
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
              {notas.map((nota: any) => (
                <Box key={nota.id} sx={{ display: "flex", gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: "#5fa8d3", width: 40, height: 40 }} />
                  <Box>
                    <Typography variant="body2" fontWeight={700}>
                      Por: {nota.creado_por}
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
              {estadisticas.reportesRecientes.map((reporte: any) => (
                <Grid size={{ xs: 12, md: 6 }} key={reporte.id}>
                  <Card sx={{ bgcolor: "#fff", borderRadius: 2, p: 2 }}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Avatar
                        sx={{ bgcolor: "#5fa8d3", width: 50, height: 50 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" fontWeight={700}>
                          Reporte generado por: {reporte.creado_por || 'Desconocido'}, {formatearFecha(reporte.hora_llamada)}
                          . A las {formatearHora(reporte.hora_llamada)}.
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 1,
                            whiteSpace: "pre-line",
                            color: "#666",
                          }}
                        >
                          {reporte.secciones_adicionales || 'Sin tipo'} - {reporte.colonia || 'Sin ubicación'}
                          {reporte.paciente_nombre && ` - Paciente: ${reporte.paciente_nombre}`}
                        </Typography>
                        <Button
                          label="Presiona aquí para ver el reporte"
                          onClick={() => redirect(`/reportesEH/${reporte.id}/show`)}
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
