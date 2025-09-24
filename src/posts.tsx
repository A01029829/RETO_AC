import {List, DataTable, ReferenceField, Edit, SimpleForm, TextInput, ReferenceInput, Create, EditButton, Show, SimpleShowLayout, TextField, useNotify, useRedirect, useRefresh } from "react-admin";

export const PostList = () => ( //Llaves con return y paréntesis cuando es void
    <List filters={postFilters}>
        <DataTable>
            <DataTable.Col source= "userId" label= "Nombre Usuario" >
                <ReferenceField source="userId" reference= "users" link="show"/>
            </DataTable.Col>
            <DataTable.Col source="id" label= "ID" />
            <DataTable.Col source="title" label= "Título" />
            <DataTable.Col source="body" label= "Contenido" />
            <DataTable.Col label="Acciones" sx={{textAlign: "right"}} >
                <EditButton/>
            </DataTable.Col>
        </DataTable>
    </List>
)

export const PostEdit = () => {

    const notify= useNotify();
    const refresh= useRefresh();
    const redirect= useRedirect();

    const onSuccess= () => {
        notify('Cambios guardados', {undoable:true});
        redirect('/posts');
        refresh();
    }

    return(
        <Edit mutationOptions={{onSuccess}}>
            <SimpleForm warnWhenUnsavedChanges>
                <TextInput disabled source="id" label= "ID" />
                <ReferenceInput required source="userId" reference="users" />
                <TextInput required source="title" label= "Título" />
                <TextInput required source="body" multiline rows={5} label= "Contenido" />
            </SimpleForm>
        </Edit>
    );
}

export const PostCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput required source="userId" reference="users" />
            <TextInput required source="title" label= "Título" />
            <TextInput  required source="body" multiline rows= {5} label= "Contenido" />
        </SimpleForm>
    </Create>
)

export const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" label= "ID" />
            <ReferenceField source="userId" reference="users" label= "ID Usuario" />
            <TextField source="title" label= "Título" />
            <TextField source="body" label= "Contenido" />
        </SimpleShowLayout>
    </Show>
);

const postFilters = [
    <TextInput source="q" label="Buscar" alwaysOn />,
    <ReferenceInput source="userId" label="ID Usuario" reference="users" />,
];
