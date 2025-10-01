import {
    List, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create, Show, SimpleShowLayout, DateField, DateInput} from "react-admin";
  
  export const notaList = () => (
    <List>
      <Datagrid rowClick="show">
        <TextField source="id" />
        <TextField source="reporte" />
        <TextField source="contenido" />
        <DateField source="fecha" />
        <EditButton />
      </Datagrid>
    </List>
  );
  
  export const notaCreate = () => (
    <Create>
      <SimpleForm>
        <TextInput source="reporte" required />
        <TextInput source="contenido" multiline rows={5} required />
        <DateInput source="fecha" />
      </SimpleForm>
    </Create>
  );
  
  export const notaEdit = () => (
    <Edit>
      <SimpleForm>
        <TextInput source="reporte" />
        <TextInput source="contenido" multiline rows={5} />
        <DateInput source="fecha" />
      </SimpleForm>
    </Edit>
  );
  
  export const notaShow = () => (
    <Show>
      <SimpleShowLayout>
        <TextField source="reporte" />
        <TextField source="contenido" />
        <DateField source="fecha" />
      </SimpleShowLayout>
    </Show>
  );
  