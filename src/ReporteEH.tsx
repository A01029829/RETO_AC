import {
    List, DataTable, ReferenceField, Edit, SimpleForm, TextInput, ReferenceInput, Create, EditButton, Show, SimpleShowLayout, TextField, 
    useNotify, useRedirect, useRefresh, SelectInput, DateTimeInput, NumberInput, BooleanInput, TimeInput, FormDataConsumer, ImageField, 
    ImageInput} from "react-admin";

const CondicionPacienteChoices = [
    { id: '1_1', name: 'Crítico' },
    { id: '2_1', name: 'No Crítico' },
    { id: '1_2', name: 'Estable' },
    { id: '2_2', name: 'No Estable' }
];

const PrioridadChoices = [
    { id: '1', name: 'Rojo' },
    { id: '2', name: 'Amarillo' },
    { id: '3', name: 'Verde' },
    { id: '4', name: 'Negra' }
];

const AperturaOcularChoices = [
    { id: 'espontanea', name: 'Espontánea (4)' },
    { id: 'a_la_voz', name: 'A la Voz (3)' },
    { id: 'al_dolor', name: 'Al dolor (2)' },
    { id: 'ninguna', name: 'Ninguna (1)' }
];

const RespuestaMotoraChoices = [
    { id: 'espontanea_normal', name: 'Espontánea/Normal (6)' },
    { id: 'localiza_tacto', name: 'Localiza al Tacto (5)' },
    { id: 'localiza_dolor', name: 'Localiza al Dolor (4)' },
    { id: 'decorticación', name: 'Decorticación (3)' },
    { id: 'descerebracion', name: 'Descerebración (2)' },
    { id: 'ninguna', name: 'Ninguna (1)' }
];

const RespuestaVerbalChoices = [
    { id: 'orientada', name: 'Orientada (5)' },
    { id: 'confusa', name: 'Confusa (4)' },
    { id: 'palabras_inapropiadas', name: 'Palabras Inapropiadas (3)' },
    { id: 'sonidos_incomprensible', name: 'Sonidos Incomprensibles (2)' },
    { id: 'ninguna', name: 'Ninguna (1)' }
];

const ColorChoices = [
    { id: 'azul_palido', name: 'Azul o Pálido (0)' },
    { id: 'acrocianosis', name: 'Acrocianosis (1)' },
    { id: 'rosado', name: 'Rosado Completamente (2)' },
];

const FCChoices = [
    { id: 'ausente', name: 'Ausente (0)' },
    { id: 'menor_100', name: 'Menos de 100 (1)' },
    { id: 'mayor_140', name: 'Más de 100 (2)' }
];

const IrritabilidadReflejaChoices = [
    { id: 'no_respuesta', name: 'No Respuesta (0)' },
    { id: 'muecas', name: 'Muecas (1)' },
    { id: 'llora_retira', name: 'Llora o Retira (2)' }
];

const TonoMuscularChoices = [
    { id: 'flacido', name: 'Flácido (0)' },
    { id: 'alguna_flexion', name: 'Alguna Flexión (1)' },
    { id: 'movimiento_activo', name: 'Movimiento Activo (2)' }
];

const RespiracionChoices = [
    { id: 'ausente', name: 'Ausente (0)' },
    { id: 'lenta_irregular', name: 'Lenta o Irregular (1)' },
    { id: 'llora', name: 'Llora (2)' },
];

export const ReporteEHList = () => (
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

export const ReporteEHEdit = () => {

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

export const ReporteEHCreate = () => ( 
    <Create>
        <SimpleForm>
            {/* Reportes de Emergencias Prehospitalarias */}
            <h1>Reportes de Emergencias Prehospitalarias</h1>
            
            {/* Cronometría */}
            <h2>Cronometría</h2>
            <DateTimeInput source="hora_llamada" label="Hora de llamada" />
            <TimeInput source="hora_salida" label="Hora de salida" />
            <TimeInput source="hora_llegada" label="Hora de llegada" />
            <TimeInput source="hora_traslado" label="Hora de traslado" />
            <TimeInput source="hora_ingreso_hospital" label="Hora de ingreso al hospital" />
            <TimeInput source="hora_base" label="Hora base" />

            {/* Ubicación de servicio */}
            <h2>Ubicación de servicio</h2>
            <TextInput source="calle" label="Calle" fullWidth />
            <TextInput source="entre_calles" label="Entre (calle 1 y calle 2)" fullWidth />
            <TextInput source="colonia" label="Colonia o comunidad" fullWidth />
            <TextInput source="alcaldia_municipio" label="Alcaldía o municipio" fullWidth />
            
            <SelectInput 
                source="lugar_ocurrencia" 
                label="Lugar de ocurrencia"
                choices={[
                    { id: 'transporte_publico', name: 'Transporte público' },
                    { id: 'escuela', name: 'Escuela' },
                    { id: 'trabajo', name: 'Trabajo' },
                    { id: 'hogar', name: 'Hogar' },
                    { id: 'recreacion_deporte', name: 'Recreación y deporte' },
                    { id: 'via_publica', name: 'Vía pública' },
                    { id: 'otra', name: 'Otra' }
                ]}
            />
            <TextInput source="lugar_ocurrencia_otra" label="Otra (especificar)" />

            {/* CONTROL */}
            <h2>Control</h2>
            <TextInput source="numero_ambulancia" label="Número de ambulancia" />
            <TextInput source="operador" label="Operador" />
            <TextInput source="tum" label="T.U.M" />
            <TextInput source="socorrista" label="Socorrista" />
            <TextInput source="matricula_helicoptero" label="Matrícula helicóptero" />

            {/* DATOS DEL PACIENTE */}
            <h2>Datos del Paciente</h2>
            <SelectInput 
                source="paciente_sexo" 
                label="Sexo"
                choices={[
                    { id: 'masculino', name: 'Masculino' },
                    { id: 'femenino', name: 'Femenino' }
                ]}
            />
            <TextInput source="paciente_domicilio_calle" label="Domicilio - Calle" fullWidth />
            <TextInput source="paciente_domicilio_colonia" label="Domicilio - Colonia" fullWidth />
            <TextInput source="paciente_domicilio_alcaldia" label="Domicilio - Alcaldía o municipio" fullWidth />
            
            <SelectInput 
                source="derechohabiente" 
                label="Derechohabiente"
                choices={[
                    { id: 'imss', name: 'IMSS' },
                    { id: 'issste', name: 'ISSSTE' },
                    { id: 'otra', name: 'Otra' }
                ]}
            />
            <TextInput source="derechohabiente_otra" label="Otra (especificar)" />
            <TextInput source="paciente_telefono" label="Teléfono" />
            <TextInput source="paciente_ocupacion" label="Ocupación" />

            {/* SECCIONES ADICIONALES */}
            <h2>Secciones Adicionales</h2>
            
            {/* Selector de secciones adicionales */}
            <SelectInput 
                source="secciones_adicionales" 
                label="Seleccionar secciones adicionales"
                choices={[
                    { id: 'ninguna', name: 'Ninguna' },
                    { id: 'parto', name: 'Parto' },
                    { id: 'causa_traumatica', name: 'Causa Traumática' },
                    { id: 'accidente_automovilistico', name: 'Accidente Automovilístico' },
                    { id: 'causa_clinica', name: 'Causa Clínica' }
                ]}
                defaultValue="ninguna"
            />

            <FormDataConsumer>
                {({ formData }) => { /*El componente proporciona un mecanismo para acceder 
                                        y utilizar los datos del formulario actual dentro de un formulario, 
                                        lo que permite un comportamiento dinámico basado en la entrada del usuario.*/ 
                    const seccionSeleccionada = formData.secciones_adicionales;
                    
                    return (
                        <>
                            {/* PARTO */}
                            {seccionSeleccionada === 'parto' && (
                                <>
                                    <h2>Parto</h2>
                                    <h2>Datos de la madre</h2>
                                    <NumberInput source="semanas_gesta" label="Semanas de gesta" />
                                    <TimeInput source="hora_inicio_contracciones" label="Hora de inicio de contracciones" />
                                    <TextInput source="frecuencia_contracciones" label="Frecuencia de contracciones" />
                                    <TextInput source="duracion_contracciones" label="Duración" />

                                    <h2>Datos del recién nacido y postparto</h2>
                                    <TimeInput source="hora_nacimiento" label="Hora del nacimiento" />
                                    <BooleanInput source="placenta_expulsada" label="Placenta expulsada" />
                                    <TextInput source="lugar_parto" label="Lugar" />
                                    
                                    <SelectInput 
                                        source="producto" 
                                        label="Producto"
                                        choices={[
                                            { id: 'vivo', name: 'Vivo' },
                                            { id: 'muerto', name: 'Muerto' }
                                        ]}
                                    />
                                    <SelectInput 
                                        source="recien_nacido_sexo" 
                                        label="Sexo del recién nacido"
                                        choices={[
                                            { id: 'masculino', name: 'Masculino' },
                                            { id: 'femenino', name: 'Femenino' }
                                        ]}
                                    />
                                    <h2>Puntaje de Apgar</h2>
                                    <NumberInput source="edad_gestacional" label="Edad Gestacional" />
                                    <SelectInput 
                                            source="apgar" 
                                            label="Tabla de Apgar"
                                            choices={[
                                                { id: 'ninguna', name: 'Ninguna' },
                                                { id: 'color', name: 'Color' },
                                                { id: 'fc', name: 'Frecuencia Cardiaca' },
                                                { id: 'irritabilidad_refleja', name: 'Irritabilidad Refleja' },
                                                { id: 'tono_muscular', name: 'Tono Muscular' },
                                                { id: 'respiracion', name: 'Respiración' },
                                            ]}
                                            defaultValue="ninguna"
                                        />

                                        <FormDataConsumer>
                                            {({ formData }) => { /*El componente proporciona un mecanismo para acceder 
                                                                    y utilizar los datos del formulario actual dentro de un formulario, 
                                                                    lo que permite un comportamiento dinámico basado en la entrada del usuario.*/ 
                                                const seccionSeleccionada = formData.apgar;
                                                
                                                return (
                                                    <>
                                                    {/* Color */}
                                                    {seccionSeleccionada === 'color' && (
                                                        <>
                                                            <h2>Color</h2>
                                                            <h3>1 Minuto</h3>
                                                            <SelectInput source="color_1_minuto" label="Color 1 Minuto" choices={ColorChoices} />
                                                            <h3>5 Minutos</h3>
                                                            <SelectInput source="color_5_minutos" label="Color 5 Minutos" choices={ColorChoices} />
                                                            <h3>10 Minutos</h3>
                                                            <SelectInput source="color_10_minutos" label="Color 10 Minutos" choices={ColorChoices} />
                                                            <h3>15 Minutos</h3>
                                                            <SelectInput source="color_15_minutos" label="Color 15 Minutos" choices={ColorChoices} />
                                                            <h3>20 Minutos</h3>
                                                            <SelectInput source="color_20_minutos" label="Color 20 Minutos" choices={ColorChoices} />
                                                        </>
                                                    )}
                                                    {/* Frecuencia Cardiaca */}
                                                    {seccionSeleccionada === 'fc' && (
                                                        <>
                                                            <h2>Frecuencia Cardiaca</h2>
                                                            <h3>1 Minuto</h3>
                                                            <SelectInput source="fc_1_minuto" label="Frecuencia Cardiaca 1 Minuto" choices={FCChoices} />
                                                            <h3>5 Minutos</h3>
                                                            <SelectInput source="fc_5_minutos" label="Frecuencia Cardiaca 5 Minutos" choices={FCChoices} />
                                                            <h3>10 Minutos</h3>
                                                            <SelectInput source="fc_10_minutos" label="Frecuencia Cardiaca 10 Minutos" choices={FCChoices} />
                                                            <h3>15 Minutos</h3>
                                                            <SelectInput source="fc_15_minutos" label="Frecuencia Cardiaca 15 Minutos" choices={FCChoices} />
                                                            <h3>20 Minutos</h3>
                                                            <SelectInput source="fc_20_minutos" label="Frecuencia Cardiaca 20 Minutos" choices={FCChoices} />
                                                        </>
                                                    )}
                                                    {/* Irritabilidad Refleja */}
                                                    {seccionSeleccionada === 'irritabilidad_refleja' && (
                                                        <>
                                                            <h2>Irritabilidad Refleja</h2>
                                                            <h3>1 Minuto</h3>
                                                            <SelectInput source="irritabilidad_refleja_1_minuto" label="Irritabilidad Refleja 1 Minuto" choices={IrritabilidadReflejaChoices} />
                                                            <h3>5 Minutos</h3>
                                                            <SelectInput source="irritabilidad_refleja_5_minutos" label="Irritabilidad Refleja 5 Minutos" choices={IrritabilidadReflejaChoices} />
                                                            <h3>10 Minutos</h3>
                                                            <SelectInput source="irritabilidad_refleja_10_minutos" label="Irritabilidad Refleja 10 Minutos" choices={IrritabilidadReflejaChoices} />
                                                            <h3>15 Minutos</h3>
                                                            <SelectInput source="irritabilidad_refleja_15_minutos" label="Irritabilidad Refleja 15 Minutos" choices={IrritabilidadReflejaChoices} />
                                                            <h3>20 Minutos</h3>
                                                            <SelectInput source="irritabilidad_refleja_20_minutos" label="Irritabilidad Refleja 20 Minutos" choices={IrritabilidadReflejaChoices} />
                                                        </>
                                                    )}
                                                    {/* Tono Muscular */}
                                                    {seccionSeleccionada === 'tono_muscular' && (
                                                        <>
                                                            <h2>Tono Muscular</h2>
                                                            <h3>1 Minuto</h3>
                                                            <SelectInput source="tono_muscular_1_minuto" label="Tono Muscular 1 Minuto" choices={TonoMuscularChoices} />
                                                            <h3>5 Minutos</h3>
                                                            <SelectInput source="tono_muscular_5_minutos" label="Tono Muscular 5 Minutos" choices={TonoMuscularChoices} />
                                                            <h3>10 Minutos</h3>
                                                            <SelectInput source="tono_muscular_10_minutos" label="Tono Muscular 10 Minutos" choices={TonoMuscularChoices} />
                                                            <h3>15 Minutos</h3>
                                                            <SelectInput source="tono_muscular_15_minutos" label="Tono Muscular 15 Minutos" choices={TonoMuscularChoices} />
                                                            <h3>20 Minutos</h3>
                                                            <SelectInput source="tono_muscular_20_minutos" label="Tono Muscular 20 Minutos" choices={TonoMuscularChoices} />
                                                        </>
                                                    )}
                                                    {/* Respiración */}
                                                    {seccionSeleccionada === 'respiracion' && (
                                                        <>
                                                            <h2>Respiración</h2>
                                                            <h3>1 Minuto</h3>
                                                            <SelectInput source="respiracion_1_minuto" label="Respiración 1 Minuto" choices={RespiracionChoices} />
                                                            <h3>5 Minutos</h3>
                                                            <SelectInput source="respiracion_5_minutos" label="Respiración 5 Minutos" choices={RespiracionChoices} />
                                                            <h3>10 Minutos</h3>
                                                            <SelectInput source="respiracion_10_minutos" label="Respiración 10 Minutos" choices={RespiracionChoices} />
                                                            <h3>15 Minutos</h3>
                                                            <SelectInput source="respiracion_15_minutos" label="Respiración 15 Minutos" choices={RespiracionChoices} />
                                                            <h3>20 Minutos</h3>
                                                            <SelectInput source="respiracion_20_minutos" label="Respiración 20 Minutos" choices={RespiracionChoices} />
                                                        </>
                                                    )}
                                                    </>
                                                );
                                            }}
                                        </FormDataConsumer>
                                </>
                            )}
                                    {/* CAUSA TRAUMÁTICA */}
                                    {seccionSeleccionada === 'causa_traumatica' && (
                                        <>
                                            <h2>Causa Traumática</h2>
                                    <SelectInput 
                                        source="agente_causal" 
                                        label="Agente causal"
                                        choices={[
                                            { id: 'arma', name: 'Arma' },
                                            { id: 'juguete', name: 'Juguete' },
                                            { id: 'fuego', name: 'Fuego' },
                                            { id: 'explosion', name: 'Explosión' },
                                            { id: 'animal', name: 'Animal' },
                                            { id: 'bicicleta', name: 'Bicicleta' },
                                            { id: 'automotor', name: 'Automotor' },
                                            { id: 'maquinaria', name: 'Maquinaria' },
                                            { id: 'herramienta', name: 'Herramienta' },
                                            { id: 'electricidad', name: 'Electricidad' },
                                            { id: 'sustancia_caliente', name: 'Sustancia caliente' },
                                            { id: 'sustancia_toxica', name: 'Sustancia tóxica' },
                                            { id: 'producto_biologico', name: 'Producto biológico' },
                                            { id: 'ser_humano', name: 'Ser humano' },
                                            { id: 'otro', name: 'Otro' }
                                        ]}
                                    />
                                    <TextInput source="agente_causal_otro" label="Otro (especificar)" />
                                    <TextInput source="descripcion_traumatica" label="Descripción" multiline rows={3} />
                                </>
                            )}
                            {/* ACCIDENTE AUTOMOVILÍSTICO */}
                            {seccionSeleccionada === 'accidente_automovilistico' && (
                                <>
                                    <h2>Accidente Automovilístico</h2>
                                    <SelectInput 
                                        source="tipo_accidente" 
                                        label="Tipo de accidente"
                                        choices={[
                                            { id: 'colision', name: 'Colisión' },
                                            { id: 'volcadura', name: 'Volcadura' },
                                            { id: 'automotor', name: 'Automotor' },
                                            { id: 'bicicleta', name: 'Bicicleta' },
                                            { id: 'motocicleta', name: 'Motocicleta' },
                                            { id: 'maquinaria', name: 'Maquinaria' },
                                            { id: 'contra_objeto_fijo', name: 'Contra Objeto fijo' }
                                        ]}
                                    />
                                    
                                    <SelectInput 
                                        source="tipo_impacto" 
                                        label="Tipo de impacto"
                                        choices={[
                                            { id: 'posterior', name: 'Posterior' },
                                            { id: 'frontal', name: 'Frontal' },
                                            { id: 'lateral', name: 'Lateral' },
                                            { id: 'volcadura', name: 'Volcadura' },
                                            { id: 'rotacional', name: 'Rotacional' },
                                            { id: 'hundimiento', name: 'Hundimiento' }
                                        ]}
                                    />
                                    <TextInput source="cms" label="CMS" />
                                    
                                    <SelectInput 
                                        source="parabrisas" 
                                        label="Parabrisas"
                                        choices={[
                                            { id: 'integrado', name: 'Integrado' },
                                            { id: 'estrellado', name: 'Estrellado' }
                                        ]}
                                    />
                                    
                                    <SelectInput 
                                        source="volante" 
                                        label="Volante"
                                        choices={[
                                            { id: 'integro', name: 'Íntegro' },
                                            { id: 'doblado', name: 'Doblado' }
                                        ]}
                                    />
                                    
                                    <BooleanInput source="bolsa_aire" label="Bolsa de aire" />
                                    
                                    <SelectInput 
                                        source="cinturon_seguridad" 
                                        label="Cinturón de seguridad"
                                        choices={[
                                            { id: 'colocado', name: 'Colocado' },
                                            { id: 'no_colocado', name: 'No colocado' }
                                        ]}
                                    />
                                    
                                    <BooleanInput source="dentro_vehiculo" label="Dentro del vehículo" />
                                    
                                    <SelectInput 
                                        source="eyectado_atropellado" 
                                        label="Eyectado/Atropellado"
                                        choices={[
                                            { id: 'automotor', name: 'Automotor' },
                                            { id: 'motocicleta', name: 'Motocicleta' },
                                            { id: 'bicicleta', name: 'Bicicleta' },
                                            { id: 'maquinaria', name: 'Maquinaria' }
                                        ]}
                                    />
                                </>
                            )}
                            {/* CAUSA CLÍNICA */}
                            {seccionSeleccionada === 'causa_clinica' && (
                                <>
                                    <h2>Causa Clínica</h2>
                                    <SelectInput 
                                        source="origen_probable" 
                                        label="Origen probable"
                                        choices={[
                                            { id: 'neurologia', name: 'Neurología' },
                                            { id: 'infecciosa', name: 'Infecciosa' },
                                            { id: 'musculo_esqueletico', name: 'Músculo Esquelético' },
                                            { id: 'urogenital', name: 'Urogenital' },
                                            { id: 'digestiva', name: 'Digestiva' },
                                            { id: 'cardiovascular', name: 'Cardiovascular' },
                                            { id: 'oncologico', name: 'Oncológico' },
                                            { id: 'metabolico', name: 'Metabólico' },
                                            { id: 'ginecobstetra', name: 'Ginecobstetra' },
                                            { id: 'respiratorio', name: 'Respiratorio' },
                                            { id: 'cognitivo_emocional', name: 'Cognitivo emocional' },
                                            { id: 'otro', name: 'Otro' }
                                        ]}
                                    />
                                    <TextInput source="origen_probable_otro" label="Otro (especificar)" />
                                    
                                    <SelectInput 
                                        source="especificacion_consulta" 
                                        label="Especificación"
                                        choices={[
                                            { id: '1_vez', name: '1 vez' },
                                            { id: 'subsecuente', name: 'Subsecuente' }
                                        ]}
                                    />
                                </>
                            )}
                        </>
                    );
                }}
        </FormDataConsumer>


            {/* EVALUACIÓN INICIAL */}
            <h2>Evaluación Inicial</h2>
            <SelectInput 
                source="nivel_conciencia" 
                label="Nivel de conciencia"
                choices={[
                    { id: 'alerta', name: 'Alerta' },
                    { id: 'verbal', name: 'Verbal' },
                    { id: 'dolor', name: 'Dolor' },
                    { id: 'inconsciente', name: 'Inconsciente' }
                ]}
            />
            
            <SelectInput 
                source="deglucion" 
                label="Deglución"
                choices={[
                    { id: 'presente', name: 'Presente' },
                    { id: 'ausente', name: 'Ausente' }
                ]}
            />
            
            <SelectInput 
                source="via_aerea" 
                label="Vía aérea"
                choices={[
                    { id: 'permeable', name: 'Permeable' },
                    { id: 'comprometida', name: 'Comprometida' }
                ]}
            />
            
            <SelectInput 
                source="ventilacion" 
                label="Ventilación"
                choices={[
                    { id: 'automatismo_regular', name: 'Automatismo regular' },
                    { id: 'automatismo_rapido', name: 'Automatismo rápido' },
                    { id: 'automatismo_irregular', name: 'Automatismo irregular' },
                    { id: 'automatismo_superficial', name: 'Automatismo superficial' },
                    { id: 'apnea', name: 'Apnea' }
                ]}
            />

            {/* Auscultación */}
            <SelectInput 
                source="ruidos_respiratorios" 
                label="Ruidos respiratorios"
                choices={[
                    { id: 'normales', name: 'Normales' },
                    { id: 'disminuidos', name: 'Disminuidos' },
                    { id: 'ausentes', name: 'Ausentes' }
                ]}
            />
            
            <SelectInput 
                source="hemitorax" 
                label="Hemitórax"
                choices={[
                    { id: 'derecho', name: 'Derecho' },
                    { id: 'izquierdo', name: 'Izquierdo' }
                ]}
            />
            
            <SelectInput 
                source="sitio_auscultacion" 
                label="Sitio"
                choices={[
                    { id: 'apical', name: 'Apical' },
                    { id: 'base', name: 'Base' }
                ]}
            />

            {/* Presencia de pulsos */}
            <BooleanInput source="pulso_carotideo" label="Carotídeo" />
            <BooleanInput source="pulso_radial" label="Radial" />
            <BooleanInput source="paro_cardiorrespiratorio" label="Paro cardiorrespiratorio" />
            
            <SelectInput 
                source="calidad_pulso" 
                label="Calidad del pulso"
                choices={[
                    { id: 'rapido', name: 'Rápido' },
                    { id: 'lento', name: 'Lento' },
                    { id: 'ritmico', name: 'Rítmico' },
                    { id: 'arritmico', name: 'Arrítmico' }
                ]}
            />

            {/* Piel */}
            <SelectInput 
                source="piel_estado" 
                label="Estado de la piel"
                choices={[
                    { id: 'normal', name: 'Normal' },
                    { id: 'palida', name: 'Pálida' },
                    { id: 'cianotica', name: 'Cianótica' }
                ]}
            />
            
            <SelectInput 
                source="caracteristicas_piel" 
                label="Características de la piel"
                choices={[
                    { id: 'caliente', name: 'Caliente' },
                    { id: 'fria', name: 'Fría' },
                    { id: 'diaforesis', name: 'Diaforesis' },
                    { id: 'normotermico', name: 'Normotérmico' }
                ]}
            />

            <TextInput source="observaciones_adicionales" label="Observaciones adicionales" multiline rows={3} />

            {/*Exploracion Fisica y Zonas de Lesión (Imagen)*/}
            <h2>Exploración Física y Zonas de Lesión</h2>
            <ImageInput source="imagen" label="Imagen de la exploración física y zonas de lesión">
                <ImageField source="src" title="title" />
            </ImageInput>

             {/* Pupilas */}
            <h2>Pupilas</h2>
            <TextInput source="pupilas_izquierda" label="Izquierda" />
            <TextInput source="pupilas_derecha" label="Derecha" />
            
             {/* Signos vitales y Monitoreo */}
            <h2>Signos vitales y Monitoreo</h2>
            <SelectInput source= "apertura_ocular" choices={AperturaOcularChoices} label="Apertura ocular" />
            <SelectInput source= "respuesta_motora" choices={RespuestaMotoraChoices} label="Respuesta motora" />
            <SelectInput source= "respuesta_verbal" choices={RespuestaVerbalChoices} label="Respuesta verbal" />
            <NumberInput source= "glasgow_total" label="Glasgow total" />

            {/* Información Previa del Paciente */}
            <h2>Información Previa del Paciente</h2>
            <TextInput source="alergias" label="Alergias" multiline rows={2} />
            <TextInput source="medicamentos" label="Medicamentos" multiline rows={2} />
            <TextInput source="padecimientos_cirugias" label="Padecimientos/Cirugías" multiline rows={2} />
            <TextInput source="ultima_comida" label="Última comida" multiline rows={2} />
            <TextInput source="eventos_previos" label="Eventos Previos" multiline rows={2} />
            
             {/* Condicion y Prioridad */}
            <h2>Condición y Prioridad</h2>
            <SelectInput source="condicion_paciente" choices={CondicionPacienteChoices} label="Condición del paciente" />
            <SelectInput source="prioridad" choices={PrioridadChoices} label="Prioridad" />

            {/* TRASLADO */}
            <h2>Traslado</h2>
            <TextInput source="hospital_traslado" label="Hospital" />
            <TextInput source="doctor" label="Doctor" />
            <TextInput source="folio_cru" label="Folio CRU" />

            {/* TRATAMIENTO */}
            <h2>Tratamiento</h2>
            {/* Vía aérea */}
            <h2>Vía aérea</h2>
            <BooleanInput source="aspiracion" label="Aspiración" />
            <BooleanInput source="canula_orofaringea" label="Cánula Orofaríngea" />
            <BooleanInput source="canula_nasofaringea" label="Cánula nasofaríngea" />
            <BooleanInput source="intubacion_orotraqueal" label="Intubación orotraqueal" />
            <BooleanInput source="combitubo" label="Combitubo" />
            <BooleanInput source="intubacion_nasotraqueal" label="Intubación nasotraqueal" />
            <BooleanInput source="mascarilla_laringea" label="Mascarilla laríngea" />
            <BooleanInput source="cricotiroidotomia" label="Cricotiroidotomía por punción" />

            {/* Control cervical */}
            <h2>Control cervical</h2>
            <BooleanInput source="control_manual" label="Manual" />
            <BooleanInput source="collarin_rigido" label="Collarín rígido" />
            <BooleanInput source="collarin_blando" label="Collarín blando" />

            {/* Asistencia ventilatoria */}
            <h2>Asistencia ventilatoria</h2>
            <BooleanInput source="balon_valvula_mascarilla" label="Balón válvula mascarilla" />
            <BooleanInput source="valvula_demanda" label="Válvula de demanda" />
            <BooleanInput source="hiperventilacion" label="Hiperventilación" />
            <BooleanInput source="puntas_nasales" label="Puntas nasales" />
            <BooleanInput source="mascarilla_simple" label="Mascarilla simple" />
            <BooleanInput source="ventilador_automatico" label="Ventilador automático" />
            <BooleanInput source="hemitorax_derecho_trat" label="Hemitórax derecho" />
            <BooleanInput source="hemitorax_izquierdo_trat" label="Hemitórax izquierdo" />
            <BooleanInput source="descompresion_pleural" label="Descompresión pleural con agua" />
            <BooleanInput source="mascarilla_reservorio" label="Mascarilla con reservorio" />
            <BooleanInput source="mascarilla_venturi" label="Mascarilla venturi" />
            
            <NumberInput source="latidos_por_minuto" label="Latidos por minuto" />

            {/* Medicamento */}
            <h2>Medicamento</h2>
            <TimeInput source="medicamento_hora" label="Hora" />
            <TextInput source="medicamento_dosis" label="Dosis" />
            <TextInput source="medicamento_nombre" label="Medicamento" />
            <TextInput source="via_administracion" label="Vía administración" />
            <TextInput source="dr_tratante" label="Dr Tratante" />

            {/* Control de hemorragia */}
            <h2>Control de hemorragia</h2>
            <BooleanInput source="presion_directa" label="Presión directa" />
            <BooleanInput source="presion_indirecta" label="Presión indirecta" />
            <BooleanInput source="gravedad_hemorragia" label="Gravedad" />
            <BooleanInput source="vendaje_compresivo" label="Vendaje compresivo" />
            <BooleanInput source="crioterapia" label="Crioterapia" />
            <BooleanInput source="mast" label="MAST" />

            {/* Vía venosas y tipo de solución */}
            <h2>Vía venosas y tipo de solución</h2>
            <BooleanInput source="hartmann" label="Hartmann" />
            <BooleanInput source="nacl" label="NaCl 9.9%" />
            <BooleanInput source="mixta" label="Mixta" />
            <BooleanInput source="glucosa" label="Glucosa 5%" />
            <BooleanInput source="otra_solucion" label="Otra" />
            <NumberInput source="linea_iv" label="Línea IV" />
            <NumberInput source="cateter" label="Catéter" />
            <NumberInput source="cantidad_solucion" label="Cantidad" />

            {/* Atención básica */}
            <h2>Atención básica</h2>
            <SelectInput 
                source="rcp" 
                label="RCP"
                choices={[
                    { id: 'basica', name: 'Básica' },
                    { id: 'avanzada', name: 'Avanzada' }
                ]}
            />
            <BooleanInput source="curacion" label="Curación" />
            <BooleanInput source="inmovilizacion_extremidades" label="Inmovilización de extremidades" />
            <BooleanInput source="empaquetamiento" label="Empaquetamiento" />
            <BooleanInput source="vendaje" label="Vendaje" />
            
            <TextInput source="observaciones_tratamiento" label="Observaciones" multiline rows={3} />

            {/* PERTENENCIAS */}
            <h2>Pertenencias</h2>
            <TextInput source="pertenencias" label="Escribir pertenencias separadas por nueva línea (ENTER)" multiline rows={2} />

            {/* DATOS LEGALES */}
            <h2>Datos Legales</h2>
            <TextInput source="autoridades_conocimiento" label="Autoridades que tomaron conocimiento" multiline rows={2} />
            <TextInput source="dependencia" label="Dependencia" />
            <TextInput source="num_unidad_legal" label="Núm. unidad" />
            <TextInput source="num_oficial" label="Núm. de oficial" />

            {/* Vehículos involucrados */}
            <h2>Vehículos involucrados</h2>
            <TextInput source="vehiculo_tipo" label="Tipo" />
            <TextInput source="vehiculo_marca" label="Marca" />
            <TextInput source="vehiculo_placa" label="Placa" />
        </SimpleForm>
    </Create>
);

export const ReporteEHShow = () => (
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
