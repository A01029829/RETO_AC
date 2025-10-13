import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,} from "recharts";
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, Divider,} from "@mui/material";

// estos son colores para las gráficas :D
const COLORS = ["#236eb1", "#f19102", "#b7cde4"];

export const StatisticsPanel = () => {
  // HECTORLUGO AQUI VA TODO LO DE LA API
  // aquí vamos a guardar los datos que vienen del backend (ahorita estan como simulados ok?) 
  // cuando ya exista la API, solo cambias los set"x" por los datos que traiga el fetch
  const [timeSeries, setTimeSeries] = useState<any[]>([]);
  const [distribution, setDistribution] = useState<any[]>([]);
  const [avgResponse, setAvgResponse] = useState<any[]>([]);
  const [unitUsage, setUnitUsage] = useState<any[]>([]);
  const [demographics, setDemographics] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);

  useEffect(() => {
    // Y AQUI VA EL FETCH DEL API
    // setTimeSeries es el total de emergencias por fecha (serie temporal)
    // setDistribution es el conteo por tipo de emergencia
    // setAvgResponse es el promedio de tiempo de respuesta
    // setUnitUsage es el uso de unidades (por ambulancia)
    // setDemographics es el demografía (edad/género)
    // setRecentReports es el últimos reportes (para la lista lateral)
    //  y ya al final de cada fetch hagan un .then(data => setX(data))

    setTimeSeries([
      { fecha: "Oct 1", count: 5 },
      { fecha: "Oct 2", count: 9 },
      { fecha: "Oct 3", count: 7 },
      { fecha: "Oct 4", count: 10 },
      { fecha: "Oct 5", count: 6 },
    ]);

    setDistribution([
      { tipo: "Prehospitalaria", value: 45 },
      { tipo: "Urbana", value: 30 },
      { tipo: "Notas sin folio", value: 10 },
    ]);

    setAvgResponse([
      { turno: "Matutino", minutos: 12 },
      { turno: "Vespertino", minutos: 9 },
      { turno: "Nocturno", minutos: 14 },
    ]);

    setUnitUsage([
      { unidad: "Amb-01", servicios: 25, horas: 40 },
      { unidad: "Amb-02", servicios: 18, horas: 32 },
      { unidad: "Amb-03", servicios: 12, horas: 25 },
    ]);

    setDemographics([
      { rango: "0-17", hombres: 4, mujeres: 3 },
      { rango: "18-30", hombres: 7, mujeres: 8 },
      { rango: "31-60", hombres: 5, mujeres: 6 },
      { rango: "60+", hombres: 2, mujeres: 3 },
    ]);

    setRecentReports([
      { folio: "EU-1023", fecha: "2025-10-05 14:30", tipo: "ME URGE LA PATRULLAAAAAA", turno: "Matutino", ubicacion: "Mi casa" },
      { folio: "EU-1178", fecha: "2025-10-05 13:20", tipo: "Urbana", turno: "Matutino", ubicacion: "El Tec" },
      { folio: "EH-1022", fecha: "2025-10-04 21:00", tipo: "Prehospitalaria", turno: "Nocturno", ubicacion: "Santa Fe" },
    ]);
  }, []);

  // AQUI TERMINA TODO LO DE LA API HECTORLUGO

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
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#236eb1" fill="#f19102" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        <Box flex="1 45%">
          <Card style={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6">Últimos Reportes</Typography>
              <List dense>
                {recentReports.map((r, i) => (
                  <React.Fragment key={i}>
                    <ListItem>
                      <ListItemText
                        primary={`${r.folio} — ${r.tipo}`}
                        secondary={`${r.fecha} • ${r.turno} • ${r.ubicacion}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        <Box flex="1 1 45%">
          <Card>
            <CardContent>
              <Typography variant="h6">Distribución por Tipo de Emergencia</Typography>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={distribution}
                    dataKey="value"
                    nameKey="tipo"
                    label
                  >
                    {distribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        <Box flex="1 1 45%">
          <Card>
            <CardContent>
              <Typography variant="h6">Tiempo de Respuesta Promedio (por turno)</Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={avgResponse}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="turno" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="minutos" fill="#236eb1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        <Box flex="1 1 45%">
          <Card>
            <CardContent>
              <Typography variant="h6">Utilización de Unidades</Typography>
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
            </CardContent>
          </Card>
        </Box>

        <Box flex="1 1 45%">
          <Card>
            <CardContent>
              <Typography variant="h6">Demografía de Atendidos</Typography>
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
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};