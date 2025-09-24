import {
    List, DataTable, ReferenceField, Edit, SimpleForm, TextInput, ReferenceInput, Create, EditButton, Show, SimpleShowLayout, TextField, 
    useNotify, useRedirect, useRefresh, SelectInput, DateTimeInput, NumberInput, BooleanInput} from "react-admin";

export const PostList = () => (
    <List filters={emergencyFilters}>
        <DataTable>
            <DataTable.Col source="eventDateTime" label="Fecha/Hora" />
            <DataTable.Col source="reportType" label="Tipo" />
            <DataTable.Col source="assignedUnit" label="Unidad" />
            <DataTable.Col source="location" label="Ubicación" />
            <DataTable.Col source="priority" label="Prioridad" />
            <DataTable.Col source="folioStatus" label="Estado" />
            <DataTable.Col source="title" label="Incidente" />
            <DataTable.Col source="userId" label="Responsable">
                <ReferenceField source="userId" reference="users" link="show"/>
            </DataTable.Col>
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
            {/* Datos Generales */}
            <SelectInput 
                required 
                source="reportType" 
                label="Tipo de reporte" 
                choices={[
                    { id: 'prehospitalario', name: 'Prehospitalario' },
                    { id: 'hospitalario', name: 'Hospitalario' },
                    { id: 'emergencia', name: 'Emergencia' },
                    { id: 'rescate', name: 'Rescate' }
                ]}
                defaultValue="prehospitalario"
            />
            
            <TextInput 
                required 
                source="location" 
                label="Ubicación" 
                placeholder="Calle, colonia, referencia"
                fullWidth
            />
            
            {/* Fecha y Hora del Evento */}
            <DateTimeInput 
                required 
                source="eventDateTime" 
                label="Fecha y hora del evento (llamada)" 
                defaultValue={new Date()}
            />
            
            {/* Horarios */}
            <TextInput 
                source="departureTime" 
                label="Hora - Salida" 
                placeholder="10:47 a.m."
                helperText="Formato: HH:MM a.m./p.m."
            />
            
            <TextInput 
                source="arrivalTime" 
                label="Hora - Llegada" 
                placeholder="10:58 a.m."
                helperText="Formato: HH:MM a.m./p.m."
            />
            
            {/* Unidad/Personal */}
            <SelectInput 
                required 
                source="assignedUnit" 
                label="Unidad asignada" 
                choices={[
                    { id: 'ambulancia-01', name: 'Ambulancia 01' },
                    { id: 'ambulancia-02', name: 'Ambulancia 02' },
                    { id: 'ambulancia-03', name: 'Ambulancia 03' },
                    { id: 'ambulancia-04', name: 'Ambulancia 04' },
                    { id: 'ambulancia-05', name: 'Ambulancia 05' },
                ]}
            />
            
            {/* Estado de la unidad */}
            <SelectInput 
                source="unitStatus" 
                label="Estado de la unidad"
                choices={[
                    { id: 'disponible', name: 'Disponible' },
                    { id: 'ocupada', name: 'Ocupada' },
                    { id: 'mantenimiento', name: 'En mantenimiento' }
                ]}
                defaultValue="ocupada"
            />
            
            {/* Turno asignado */}
            <NumberInput 
                required 
                source="assignedTurn" 
                label="Turno asignado" 
                defaultValue={1}
                min={1}
                max={3}
                helperText="1: Matutino, 2: Vespertino, 3: Nocturno"
            />
            
            {/* Estado del folio */}
            <SelectInput 
                source="folioStatus" 
                label="Estado del folio"
                choices={[
                    { id: 'pendiente', name: 'Pendiente' },
                    { id: 'en-proceso', name: 'En Proceso' },
                    { id: 'completado', name: 'Completado' },
                    { id: 'cancelado', name: 'Cancelado' }
                ]}
                defaultValue="pendiente"
            />
            
            {/* Usuario/Responsable del reporte */}
            <ReferenceInput required source="userId" reference="users" label="Responsable del reporte" />
            
            {/* Descripción del incidente */}
            <TextInput 
                required 
                source="title" 
                label="Título del incidente" 
                placeholder="Descripción breve del reporte"
                fullWidth
            />
            
            <TextInput 
                required 
                source="body" 
                multiline 
                rows={6} 
                label="Descripción detallada" 
                placeholder="Detalles completos del reporte de emergencia..."
                fullWidth
            />
            
            {/* Prioridad */}
            <SelectInput 
                source="priority" 
                label="Prioridad"
                choices={[
                    { id: 'baja', name: '🟢 Baja' },
                    { id: 'media', name: '🟡 Media' },
                    { id: 'alta', name: '🟠 Alta' },
                    { id: 'critica', name: '🔴 Crítica' }
                ]}
                defaultValue="media"
            />
            
            {/* Campos adicionales */}
            <BooleanInput 
                source="isCompleted" 
                label="Reporte completado" 
                defaultValue={false}
            />
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

const emergencyFilters = [
    <TextInput source="q" label="Buscar" alwaysOn />,
    <SelectInput source="reportType" label="Tipo de reporte" choices={[
        { id: 'prehospitalario', name: 'Prehospitalario' },
        { id: 'hospitalario', name: 'Hospitalario' },
        { id: 'emergencia', name: 'Emergencia' },
        { id: 'rescate', name: 'Rescate' }
    ]} />,
    <SelectInput source="priority" label="Prioridad" choices={[
        { id: 'baja', name: 'Baja' },
        { id: 'media', name: 'Media' },
        { id: 'alta', name: 'Alta' },
        { id: 'critica', name: 'Crítica' }
    ]} />,
    <ReferenceInput source="userId" label="Responsable" reference="users" />,
];
