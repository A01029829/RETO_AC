import {List, DataTable, EditButton, Edit, SimpleForm, TextInput, Create, Show, SimpleShowLayout, TextField, ReferenceField} from "react-admin";

export const commentsList = () => (
    <List>
        <DataTable>
            <DataTable.Col source= "postId"/>
            <DataTable.Col source= "id"/>
            <DataTable.Col source="name"/>
            <DataTable.Col source="email"/>
            <DataTable.Col source="body"/>
            <DataTable.Col label="Actions" sx={{textAlign: "right"}} >
                <EditButton/>
            </DataTable.Col>
        </DataTable>
    </List>
)

export const commentsEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput required source="name" />
            <TextInput required source="body" multiline rows={5} />
        </SimpleForm>
    </Edit>
)

export const commentsCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput required source= "postId" />
            <TextInput required source= "id" />
            <TextInput required source= "email" />
            <TextInput required source= "name" />
            <TextInput required source= "body" multiline rows={5} />
        </SimpleForm>
    </Create>
)

export const commentsShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <ReferenceField source="userId" reference="users" />
            <TextField source="title" />
            <TextField source="body" />
        </SimpleShowLayout>
    </Show>
);