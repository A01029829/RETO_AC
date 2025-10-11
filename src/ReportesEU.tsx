import {
    List, DataTable, EditButton, Edit, SimpleForm, 
    TextInput, Create, Show, SimpleShowLayout, TextField, ImageField, 
    DateTimeInput, SelectInput, NumberInput, ImageInput
} from "react-admin";

const turnoChoices = [
    { id: '1', name: 'Lunes a viernes, de 8:00 a 15:00 horas' },
                { id: '2', name: 'Lunes a viernes, de 15:00 a 21:00 horas' },
                { id: '3', name: 'Lunes, miércoles y viernes, de 21:00 a 8:00 horas' },
                { id: '4', name: 'Martes, jueves y domingo, de 21:00 a 8:00 horas' },
                { id: '5', name: 'Sábados, domingos y días festivos, de 8:00 a 20:00 horas' },
                { id: '6', name: 'Sábados, domingos y días festivos, de 20:00 a 8:00 horas' }
];

const gravedadChoices = [
    { id: 'baja', name: 'Baja' },
    { id: 'media', name: 'Media' },
    { id: 'alta', name: 'Alta' },
    { id: 'critica', name: 'Crítica' }
];

const modoActivacionChoices = [
    { id: 'llamada_emergencia', name: 'Llamada de Emergencia' },
    { id: 'seguimiento_oficio', name: 'Seguimiento de Oficio' }
];

export const ReporteEUList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="id" label="ID" />
            <DataTable.Col source="fecha" label="Fecha" />
            <DataTable.Col source="turno" label="Turno" />
            <DataTable.Col source="personal_cargo" label="Personal a Cargo" />
            <DataTable.Col source="tipo_servicio" label="Tipo de Servicio" />
            <DataTable.Col source="gravedad" label="Gravedad" />
            <DataTable.Col label="Acciones" sx={{textAlign: "right"}}>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </List>
);

export const ReporteEUCreate = () => (
    <Create>
        <SimpleForm>
            <DateTimeInput required source="fecha" label="Día, Fecha y Hora"/>
            <SelectInput required source="turno" choices={turnoChoices} label= "Turno"/>
            <TextInput required source="personal_cargo" label="Nombre del Personal a Cargo"/>
            <SelectInput required source="modo_activacion" choices={modoActivacionChoices} label="Modo de Activación"/>
            <TextInput required source="tipo_servicio" label="Tipo de Servicio"/>
            <DateTimeInput required source="fecha_hora_atencion" label="Fecha y Hora de Atención"/>
            <NumberInput required source="tiempo_traslado" label="Tiempo de Traslado (minutos)"/>
            <TextInput required source="ubicacion_gps" label="Ubicación GPS"/>
            <TextInput required source="ubicacion_descripcion" label="Descripción de la Ubicación"/>
            <SelectInput required source="gravedad" choices={gravedadChoices} label="Gravedad"/>
            <NumberInput required source="km_recorridos" label="Kilómetros Recorridos"/>
            <TextInput required source="trabajos_realizados" label="Trabajos Realizados"/>
            <TextInput required source="observaciones" label="Observaciones"/>
            <ImageInput source="fotografias" label="Fotografías">
                <ImageField source="src" title="title" />
            </ImageInput>
            <TextInput required source="conclusion_dictamen" label="Conclusión/Dictamen"/>
            <TextInput required source="responsables_emergencia" label="Responsables de la Emergencia"/>
            <TextInput required source="autoridades_participantes" label="Autoridades Participantes"/>
        </SimpleForm>
    </Create>
)

export const ReporteEUEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <DateTimeInput source="fecha_hora" label="Día, fecha y hora" required/>
            <SelectInput source="turno" choices={turnoChoices} label="Turno" required/>
            <TextInput source="personal_cargo" label="Nombre del personal a cargo" required multiline/>
            <SelectInput source="modo_activacion" choices={modoActivacionChoices} label="Modo de activación" required/>
            <TextInput source="tipo_servicio" label="Tipo de servicio (petición de mitigación de riesgo)" required multiline/>
            <DateTimeInput source="fecha_hora_atencion" label="Fecha y hora de atención" required/>
            <NumberInput source="tiempo_traslado" label="Tiempo de traslado (minutos)" required/>
            <TextInput source="ubicacion_gps" label="Ubicación (GPS)" placeholder="Lat, Long"/>
            <TextInput source="ubicacion_descripcion" label="Descripción de ubicación" multiline/>
            <SelectInput source="gravedad" choices={gravedadChoices} label="Gravedad de la emergencia" required/>
            <NumberInput source="km_recorridos" label="Kilómetros recorridos"/>
            <TextInput source="trabajos_realizados" label="Trabajos realizados" multiline rows={4} required/>
            <TextInput source="observaciones" label="Observaciones" multiline rows={4}/>
            <ImageInput source="fotografias" label="Fotografías">
                <ImageField source="src" title="title" />
            </ImageInput>
            <TextInput source="conclusion_dictamen" label="Conclusión/Dictamen" multiline rows={4} required />
            <TextInput source="responsables_emergencia" label="Responsables de la emergencia" multiline rows={3} />
            <TextInput source="autoridades_participantes" label="Autoridades y dependencias participantes" multiline rows={3} />
        </SimpleForm>
    </Edit>
)

export const ReporteEUShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="fecha_hora" label="Fecha y hora" />
            <TextField source="turno" label="Turno" />
            <TextField source="personal_cargo" label="Personal a cargo" />
            <TextField source="modo_activacion" label="Modo de activación" />
            <TextField source="tipo_servicio" label="Tipo de servicio" />
            <TextField source="fecha_hora_atencion" label="Fecha y hora de atención" />
            <TextField source="tiempo_traslado" label="Tiempo de traslado (min)" />
            <TextField source="ubicacion_gps" label="Ubicación GPS" />
            <TextField source="ubicacion_descripcion" label="Descripción ubicación" />
            <TextField source="gravedad" label="Gravedad" />
            <TextField source="km_recorridos" label="Km recorridos" />
            <TextField source="trabajos_realizados" label="Trabajos realizados" />
            <TextField source="observaciones" label="Observaciones" />
            <ImageField source="fotografias" label="Fotografías" />
            <TextField source="conclusion_dictamen" label="Conclusión/Dictamen" />
            <TextField source="responsables_emergencia" label="Responsables" />
            <TextField source="autoridades_participantes" label="Autoridades participantes" />
        </SimpleShowLayout>
    </Show>
)