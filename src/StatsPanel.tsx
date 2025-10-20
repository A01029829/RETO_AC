import React from "react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,} from "recharts";
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, Divider, CircularProgress, Alert,} from "@mui/material";

// estos son colores para las gráficas :D
const COLORS = ["#236eb1", "#f19102", "#b7cde4"];

// Configuracion de la API
const API_URL = "http://localhost:3000";

// Funcion helper para obtener el token de autenticacion
const getAuthToken = () => {
  return sessionStorage.getItem("auth");
};

// Funciones para hacer fetch a los endpoints
const fetchSerieTemporal = async (params: any = {}) => {
  const token = getAuthToken();
  if (!token) throw new Error("No hay token de autenticación");
  
  
  const { client, queryKey, meta, signal, ...cleanParams } = params;
  const queryParams = new URLSearchParams(cleanParams).toString();
  const url = queryParams ? `${API_URL}/estadisticas/serie-temporal?${queryParams}` : `${API_URL}/estadisticas/serie-temporal`;
  
  const response = await fetch(url, {
    headers: { 
      "Authentication": token,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) throw new Error("Error al cargar serie temporal");
  return response.json();
};

const fetchDistribucion = async (params: any = {}) => {
  const token = getAuthToken();
  if (!token) throw new Error("No hay token de autenticación");
  
  const { client, queryKey, meta, signal, ...cleanParams } = params;
  const queryParams = new URLSearchParams(cleanParams).toString();
  const url = queryParams ? `${API_URL}/estadisticas/distribucion-tipo?${queryParams}` : `${API_URL}/estadisticas/distribucion-tipo`;
  
  const response = await fetch(url, {
    headers: { 
      "Authentication": token,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) throw new Error("Error al cargar distribucion");
  return response.json();
};

const fetchTiempoRespuesta = async (params: any = {}) => {
  const token = getAuthToken();
  if (!token) throw new Error("No hay token de autenticación");
  
  const { client, queryKey, meta, signal, ...cleanParams } = params;
  const queryParams = new URLSearchParams(cleanParams).toString();
  const url = queryParams ? `${API_URL}/estadisticas/tiempo-respuesta?${queryParams}` : `${API_URL}/estadisticas/tiempo-respuesta`;
  
  const response = await fetch(url, {
    headers: { 
      "Authentication": token,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) throw new Error("Error al cargar tiempo de respuesta");
  return response.json();
};

const fetchUsoUnidades = async (params: any = {}) => {
  const token = getAuthToken();
  if (!token) throw new Error("No hay token de autenticación");
  
  const { client, queryKey, meta, signal, ...cleanParams } = params;
  const queryParams = new URLSearchParams(cleanParams).toString();
  const url = queryParams ? `${API_URL}/estadisticas/uso-unidades?${queryParams}` : `${API_URL}/estadisticas/uso-unidades`;
  
  const response = await fetch(url, {
    headers: { 
      "Authentication": token,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) throw new Error("Error al cargar uso de unidades");
  return response.json();
};

const fetchDemografia = async (params: any = {}) => {
  const token = getAuthToken();
  if (!token) throw new Error("No hay token de autenticación");
  
  const { client, queryKey, meta, signal, ...cleanParams } = params;
  const queryParams = new URLSearchParams(cleanParams).toString();
  const url = queryParams ? `${API_URL}/estadisticas/demografia?${queryParams}` : `${API_URL}/estadisticas/demografia`;
  
  const response = await fetch(url, {
    headers: { 
      "Authentication": token,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) throw new Error("Error al cargar demografia");
  return response.json();
};

const fetchUltimosReportes = async (params: any = {}) => {
  const token = getAuthToken();
  if (!token) throw new Error("No hay token de autenticación");
  
  const { client, queryKey, meta, signal, ...cleanParams } = params;
  const queryParams = new URLSearchParams(cleanParams).toString();
  const url = queryParams ? `${API_URL}/estadisticas/ultimos-reportes?${queryParams}` : `${API_URL}/estadisticas/ultimos-reportes`;
  
  const response = await fetch(url, {
    headers: { 
      "Authentication": token,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) throw new Error("Error al cargar ultimos reportes");
  return response.json();
};

export const StatisticsPanel = () => {
  // Usar React Query para manejar el estado de las peticiones
  const { data: timeSeries, isLoading: loadingTimeSeries, error: errorTimeSeries } = useQuery({
    queryKey: ["serie-temporal"],
    queryFn: () => fetchSerieTemporal({ agrupacion: "dia" }),
    refetchInterval: 60000, // Refrescar cada minuto
  });

  const { data: distribution, isLoading: loadingDistribution, error: errorDistribution } = useQuery({
    queryKey: ["distribucion-tipo"],
    queryFn: fetchDistribucion,
    refetchInterval: 60000,
  });

  const { data: avgResponse, isLoading: loadingResponse, error: errorResponse } = useQuery({
    queryKey: ["tiempo-respuesta"],
    queryFn: fetchTiempoRespuesta,
    refetchInterval: 60000,
  });

  const { data: unitUsage, isLoading: loadingUnits, error: errorUnits } = useQuery({
    queryKey: ["uso-unidades"],
    queryFn: fetchUsoUnidades,
    refetchInterval: 60000,
  });

  const { data: demographics, isLoading: loadingDemographics, error: errorDemographics } = useQuery({
    queryKey: ["demografia"],
    queryFn: fetchDemografia,
    refetchInterval: 60000,
  });

  const { data: recentReports, isLoading: loadingReports, error: errorReports } = useQuery({
    queryKey: ["ultimos-reportes"],
    queryFn: () => fetchUltimosReportes({ limite: 10 }),
    refetchInterval: 30000, // Refrescar cada 30 segundos
  });

  // Componente helper para mostrar errores
  const ErrorDisplay = ({ message }: { message: string }) => (
    <Alert severity="error">{message}</Alert>
  );

  // Componente helper para mostrar loading
  const LoadingDisplay = () => (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Panel de Estadísticas — Emergencias
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={3}>

        <Box flex="1 1 45%">
          <Card>
            <CardContent>
              <Typography variant="h6">Total de Emergencias (Serie Temporal)</Typography>
              {loadingTimeSeries ? (
                <LoadingDisplay />
              ) : errorTimeSeries ? (
                <ErrorDisplay message="Error al cargar serie temporal" />
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={timeSeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#236eb1" fill="#f19102" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box flex="1 45%">
          <Card style={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6">Últimos Reportes</Typography>
              {loadingReports ? (
                <LoadingDisplay />
              ) : errorReports ? (
                <ErrorDisplay message="Error al cargar reportes" />
              ) : (
                <List dense>
                  {recentReports && recentReports.map((r: any, i: number) => (
                    <React.Fragment key={i}>
                      <ListItem>
                        <ListItemText
                          primary={`${r.folio} — ${r.tipo}`}
                          secondary={`${new Date(r.fecha).toLocaleString('es-MX')} • ${r.turno} • ${r.ubicacion}`}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box flex="1 1 45%">
          <Card>
            <CardContent>
              <Typography variant="h6">Distribución por Tipo de Emergencia</Typography>
              {loadingDistribution ? (
                <LoadingDisplay />
              ) : errorDistribution ? (
                <ErrorDisplay message="Error al cargar distribución" />
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={distribution}
                      dataKey="value"
                      nameKey="tipo"
                      label
                    >
                      {distribution && distribution.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box flex="1 1 45%">
          <Card>
            <CardContent>
              <Typography variant="h6">Tiempo de Respuesta Promedio (por turno)</Typography>
              {loadingResponse ? (
                <LoadingDisplay />
              ) : errorResponse ? (
                <ErrorDisplay message="Error al cargar tiempo de respuesta" />
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={avgResponse}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="turno" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="minutos" fill="#236eb1" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box flex="1 1 45%">
          <Card>
            <CardContent>
              <Typography variant="h6">Utilización de Unidades</Typography>
              {loadingUnits ? (
                <LoadingDisplay />
              ) : errorUnits ? (
                <ErrorDisplay message="Error al cargar uso de unidades" />
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={unitUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="unidad" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="servicios" fill="#236eb1" />
                    <Bar dataKey="horas" fill="#f19102" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box flex="1 1 45%">
          <Card>
            <CardContent>
              <Typography variant="h6">Demografía de Atendidos</Typography>
              {loadingDemographics ? (
                <LoadingDisplay />
              ) : errorDemographics ? (
                <ErrorDisplay message="Error al cargar demografía" />
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={demographics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rango" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hombres" fill="#0088FE" />
                    <Bar dataKey="mujeres" fill="#FF69B4" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};