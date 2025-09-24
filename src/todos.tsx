import {List, EditButton,  DataTable, Edit, SimpleForm, TextInput, Create, ReferenceInput, NullableBooleanInput } from "react-admin";

export const todosList = () => (
    <List filters={todosFilters}>
        <DataTable>
            <DataTable.Col source="userId" />
            <DataTable.Col source= "id" />   
            <DataTable.Col source="title" />
            <DataTable.Col source="completed" />
            <DataTable.Col label="Actions" sx={{textAlign: "right"}} >
                <EditButton/>
            </DataTable.Col>
        </DataTable>
    </List>
)

export const todosEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput required source="title" />
            <TextInput required source="completed" />
        </SimpleForm>
    </Edit>
)

export const todosCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput required source= "userId" />
            <TextInput required source= "id" />
            <TextInput required source= "title" />
            <TextInput required source= "completed" />
        </SimpleForm>
    </Create>
)

const todosFilters = [
    <TextInput source="q" label="Buscar" alwaysOn />,
    <ReferenceInput source="userId" label="User" reference="users" />,
    <NullableBooleanInput source="completed" label="Completed" />
];