import {List, DataTable, EditButton, Edit, SimpleForm, TextInput, Create, Show, SimpleShowLayout, TextField, ImageField} from "react-admin";

export const photoList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="albumId" />
            <DataTable.Col source= "id" />   
            <DataTable.Col source="title" />
            <DataTable.Col source="url" />
            <DataTable.Col source="thumbnail.Url" >
                <ImageField source="thumbnailUrl"/>
            </DataTable.Col>
            <DataTable.Col label="Actions" sx={{textAlign: "right"}} >
                <EditButton/>
            </DataTable.Col>
        </DataTable>
    </List>
)

export const photoEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput required source="id" />
            <TextInput required source="title" />
            <TextInput required source="source" />
        </SimpleForm>
    </Edit>
)

export const photoCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput required source= "id" />
            <TextInput required source= "title" />
            <TextInput required source= "url" />
            <ImageField source="thumbnailUrl"/>
        </SimpleForm>
    </Create>
)

export const photoShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="albumId" />
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="url" />
            <ImageField source="thumbnailUrl" />
        </SimpleShowLayout>
    </Show>
);