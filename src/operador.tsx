import {Button, useRedirect} from "react-admin";
import { Card, CardContent, Grid, Box, Typography, } from "@mui/material";

export const operadorPage = () => {
    const redirect = useRedirect();

    const operador = {
        nombre: "Juanito",
        rol: "Paramédico",
        contacto: "555-123-456",
        turno: 1,
        //foto: "https://www.shutterstock.com/image-photo/beige-cat-doctor-medical-hat-260nw-2103390197.jpg"
      };

    return (
        <Box>
            <div>
                <Grid>
                <Card>
                    <CardContent>
                        {/*<img src={operador.foto} alt="foto" width={100} />*/}
                        <Typography><b>Nombre:</b> {operador.nombre}</Typography>
                        <Typography><b>Rol:</b> {operador.rol}</Typography>
                        <Typography><b>Contacto:</b> {operador.contacto}</Typography>
                        </CardContent>
                        </Card>
                </Grid>
                <Grid>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Turno</Typography>
                            <Typography variant="h2">{operador.turno}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid>
                    <Card>
                        <CardContent>
                            <Button label="GENERAR REPORTE" onClick={() => redirect("/comments/create")} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid>
                    <Card>
                        <CardContent>
                            <Button label="GENERAR EVIDENCIA" onClick={() => redirect("/photos/create")} />
                        </CardContent>
                    </Card>
                </Grid> 
                <Grid>
                    <Card>
                        <CardContent>
                            <Button label="NOTA" onClick={() => redirect("/notas/create")} />
                        </CardContent>
                    </Card>
                </Grid>
            </div>
        </Box>

  );
};