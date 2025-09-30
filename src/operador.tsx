import { Button, useRedirect } from "react-admin";
import { Card, CardContent, Grid, Box, Typography } from "@mui/material";
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
      sx={{
        backgroundColor: "#1f66ad",
        p: { xs: 1.5, md: 3 },
        borderRadius: 4,
      }}
    >
      <Box
        sx={{ backgroundColor: "#fff", borderRadius: 3, p: { xs: 2, md: 3 } }}
      >
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

        <Grid container spacing={3}>
          <Grid>
            <Card sx={{ backgroundColor: "#e9ecef", borderRadius: 3 }}>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 3 }}
              >
                <img src={operador.foto} alt="foto" width={200} />
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
          </Grid>

          <Grid>
            <Card
              sx={{
                backgroundColor: "#e9ecef",
                borderRadius: 3,
                height: "100%",
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6">Turno</Typography>
                <Typography variant="h2">{operador.turno}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid>
            <Card
              sx={{ backgroundColor: "#e9ecef", borderRadius: 3, height: 190 }}
            >
              <CardContent
                sx={{
                  height: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  label="GENERAR REPORTE"
                  onClick={() => redirect("/comments/create")}
                  startIcon={<DescriptionIcon />}
                  sx={{ fontWeight: 800, px: 2, py: 1.5 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid>
            <Card
              sx={{ backgroundColor: "#e9ecef", borderRadius: 3, height: 190 }}
            >
              <CardContent
                sx={{
                  height: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  label="GENERAR EVIDENCIA"
                  onClick={() => redirect("/photos/create")}
                  startIcon={<PhotoCameraIcon />}
                  sx={{ fontWeight: 800, px: 2, py: 1.5 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid>
            <Card
              sx={{ backgroundColor: "#e9ecef", borderRadius: 3, height: 190 }}
            >
              <CardContent
                sx={{
                  height: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  label="GENERAR NOTA"
                  onClick={() => redirect("/notas/create")}
                  startIcon={<NoteIcon />}
                  sx={{ fontWeight: 800, px: 2, py: 1.5 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
