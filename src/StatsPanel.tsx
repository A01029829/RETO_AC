import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,} from "recharts";
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, Divider, CircularProgress, Alert,} from "@mui/material";

// estos son colores para las gráficas :D
const COLORS = ["#236eb1", "#f19102", "#b7cde4"];

const API_URL = import.meta.env.VITE_JSON_SERVER_URL || "https://localhost:3000";

// Funcion helper para obtener el token de autenticacion
const getAuthToken = () => {
  return sessionStorage.getItem("auth");
};

// Funcion generica para hacer fetch a los endpoints
const fetchEstadistica = async (endpoint: string, params: any = {}) => {
  const token = getAuthToken();
  if (!token) throw new Error("No hay token de autenticación");
  
  const queryParams = new URLSearchParams(params).toString();
  const url = queryParams ? `${API_URL}${endpoint}?${queryParams}` : `${API_URL}${endpoint}`;
  
  console.log('Fetching estadistica:', url); // Debug log
  
  const response = await fetch(url, {
    headers: { 
      "Authentication": token,
      "Content-Type": "application/json"
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', response.status, errorText);
    throw new Error(`Error al cargar ${endpoint}: ${response.status}`);
  }
  return response.json();
};

export const StatisticsPanel = () => {
  // Estados para cada tipo de dato
  const [timeSeries, setTimeSeries] = useState<any[]>([]);
  const [distribution, setDistribution] = useState<any[]>([]);
  const [avgResponse, setAvgResponse] = useState<any[]>([]);
  const [unitUsage, setUnitUsage] = useState<any[]>([]);
  const [demographics, setDemographics] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);

  // Estados de carga
  const [loadingTimeSeries, setLoadingTimeSeries] = useState(true);
  const [loadingDistribution, setLoadingDistribution] = useState(true);
  const [loadingResponse, setLoadingResponse] = useState(true);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [loadingDemographics, setLoadingDemographics] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);

  // Estados de error
  const [errorTimeSeries, setErrorTimeSeries] = useState<string | null>(null);
  const [errorDistribution, setErrorDistribution] = useState<string | null>(null);
  const [errorResponse, setErrorResponse] = useState<string | null>(null);
  const [errorUnits, setErrorUnits] = useState<string | null>(null);
  const [errorDemographics, setErrorDemographics] = useState<string | null>(null);
  const [errorReports, setErrorReports] = useState<string | null>(null);

  // Cargar serie temporal
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingTimeSeries(true);
        setErrorTimeSeries(null);
        const data = await fetchEstadistica('/estadisticas/serie-temporal', { agrupacion: 'dia' });
        setTimeSeries(data);
      } catch (error: any) {
        setErrorTimeSeries(error.message);
      } finally {
        setLoadingTimeSeries(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000); // Refrescar cada minuto
    return () => clearInterval(interval);
  }, []);

  // Cargar distribucion
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingDistribution(true);
        setErrorDistribution(null);
        const data = await fetchEstadistica('/estadisticas/distribucion-tipo');
        setDistribution(data);
      } catch (error: any) {
        setErrorDistribution(error.message);
      } finally {
        setLoadingDistribution(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Cargar tiempo de respuesta
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingResponse(true);
        setErrorResponse(null);
        const data = await fetchEstadistica('/estadisticas/tiempo-respuesta');
        setAvgResponse(data);
      } catch (error: any) {
        setErrorResponse(error.message);
      } finally {
        setLoadingResponse(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Cargar uso de unidades
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingUnits(true);
        setErrorUnits(null);
        const data = await fetchEstadistica('/estadisticas/uso-unidades');
        setUnitUsage(data);
      } catch (error: any) {
        setErrorUnits(error.message);
      } finally {
        setLoadingUnits(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Cargar demografia
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingDemographics(true);
        setErrorDemographics(null);
        const data = await fetchEstadistica('/estadisticas/demografia');
        setDemographics(data);
      } catch (error: any) {
        setErrorDemographics(error.message);
      } finally {
        setLoadingDemographics(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Cargar ultimos reportes
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingReports(true);
        setErrorReports(null);
        const data = await fetchEstadistica('/estadisticas/ultimos-reportes', { limite: 10 });
        setRecentReports(data);
      } catch (error: any) {
        setErrorReports(error.message);
      } finally {
        setLoadingReports(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000); // Refrescar cada 30 segundos
    return () => clearInterval(interval);
  }, []);

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
