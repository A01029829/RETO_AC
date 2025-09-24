import { useMediaQuery, Theme } from "@mui/material";
import { List, DataTable, EmailField, SimpleList } from "react-admin";

export const UserList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("md")); //Tamaño a partir del cual se ejecutará el if (SimpleList)

    return (
        <List>
            {isSmall ? (
                <SimpleList
                    primaryText={(record) => record.name}
                    secondaryText={(record) => record.username}
                    tertiaryText={(record) => record.email}
                />
            ) : ( //else: Todos los datos
                <DataTable>
                    <DataTable.Col source="id" label= "ID" />
                    <DataTable.Col source="name" label= "Nombre" />
                    <DataTable.Col source="username" label= "Usuario" />
                    <DataTable.Col source="email" label= "Email" >
                        <EmailField source="email" />
                    </DataTable.Col>
                    <DataTable.Col source="address.street" label= "Dirección" />
                    <DataTable.Col source="phone" label= "Teléfono" />
                    <DataTable.Col source="website" label= "Sitio Web" />
                    <DataTable.Col source="company.name" label= "Nombre de la compañía" />
                </DataTable>
            )}
        </List>
    )
};