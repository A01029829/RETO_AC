import {List, DataTable, EditButton, Edit, SimpleForm, TextInput, Create, Show, SimpleShowLayout, TextField, ReferenceField} from "react-admin";

export const albumList = () => (
    <List>
        <DataTable>
            <DataTable.Col source= "userId"/>
            <DataTable.Col source= "id"/>
            <DataTable.Col source="title"/>
            <DataTable.Col label="Actions" sx={{textAlign: "right"}} >
                <EditButton/>
            </DataTable.Col>
        </DataTable>
    </List>
)

export const albumEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput required source="id" />
            <TextInput required source="user" />
            <TextInput required source="title" />
        </SimpleForm>
    </Edit>
)

export const albumCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput required source= "userId" />
            <TextInput required source= "id" />
            <TextInput required source= "title" />
        </SimpleForm>
    </Create>
)

export const albumShow = () => (
    <Show>
        <SimpleShowLayout>
            <ReferenceField source="userId" reference= "users" />
            <TextField source="id" />
            <TextField source="title" />
        </SimpleShowLayout>
    </Show>
);