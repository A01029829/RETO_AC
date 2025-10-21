import { Button, useRedirect, useGetList } from "react-admin";
import { Card, Grid, Box, Typography, Stack, Avatar } from "@mui/material";
import { useMemo, useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_JSON_SERVER_URL || "https://localhost:3000";


const getAuthToken = () => {
  return sessionStorage.getItem("auth");
};

export const AdminDashboard = () => {
  const redirect = useRedirect();

  
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

  
  const [tiempoPromedioTotal, setTiempoPromedioTotal] = useState<number>(0);

  
  useEffect(() => {
    const loadTiempoPromedio = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const response = await fetch(`${API_URL}/estadisticas/tiempo-respuesta`, {
          headers: { 
            "Authentication": token,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data && data.length > 0) {
            const totalMinutos = data.reduce((acc: number, item: any) => acc + (item.minutos || 0), 0);
            const promedio = Math.round(totalMinutos / data.length);
            setTiempoPromedioTotal(promedio);
          }
        }
      } catch (error) {
        console.error('Error al cargar tiempo promedio:', error);
      }
    };

    loadTiempoPromedio();
    const interval = setInterval(loadTiempoPromedio, 60000); 
    return () => clearInterval(interval);
  }, []);

  
  const estadisticas = useMemo(() => {
    const ahora = new Date();
    const inicioHoy = new Date(ahora);
    inicioHoy.setHours(0, 0, 0, 0);
    const finHoy = new Date(ahora);
    finHoy.setHours(23, 59, 59, 999);

    
    const reportesHoy = reportesEH.filter((reporte: any) => {
      const horaReporte = new Date(reporte.hora_llamada);
      return horaReporte >= inicioHoy && horaReporte <= finHoy;
    });

    return {
      reportesHoy: reportesHoy.length,
      tiempoPromedio: `${tiempoPromedioTotal} minutos`
    };
  }, [reportesEH, tiempoPromedioTotal]);

  
  const reportesRecientes = useMemo(() => {
    return reportesEH.slice(0, 2);
  }, [reportesEH]);

 
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

  // Mostrar loading mientras se cargan los datos
  if (loadingReportes || loadingNotas) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Cargando dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Título y fecha */}
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
        {/* Sección de estadísticas */}
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
            {/* Reportes del día de hoy */}
            <Stack alignItems="center" spacing={1}>
              <Typography variant="h2" fontWeight={900} color="primary">
                {estadisticas.reportesHoy}
              </Typography>
              <Typography variant="h6" fontWeight={700} textAlign="center">
                Reportes
                <br />
                de Hoy
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
              {reportesRecientes.map((reporte: any) => (
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
