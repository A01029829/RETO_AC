import { MongoClient } from 'mongodb';
import argon2 from 'argon2';

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function setupDatabase() {
    try {
        await client.connect();
        console.log("✅ Conectado a MongoDB");
        
        const db = client.db("proteccionCivil");
        
        // Obtener colecciones existentes
        const collections = await db.listCollections().toArray();
        const existingCollections = collections.map(c => c.name);
        
        // ==================== USUARIOS ====================
        if (!existingCollections.includes('usuarios402')) {
            await db.createCollection('usuarios402');
            console.log("✅ Colección 'usuarios402' creada");
            
            // CORRECCIÓN: Crear todos los usuarios a la vez sin duplicados
            await db.collection('usuarios402').insertMany([
                {
                    usuario: "admin",
                    password: await argon2.hash("admin123", {
                        type: argon2.argon2id,
                        memoryCost: 19 * 1024,
                        timeCost: 2,
                        parallelism: 1,
                        saltLength: 16
                    }),
                    nombre: "Administrador Principal",
                    tipo: "administrador",
                    turno: null 
                },
                {
                    usuario: "operador1",
                    password: await argon2.hash("operador123", {
                        type: argon2.argon2id,
                        memoryCost: 19 * 1024,
                        timeCost: 2,
                        parallelism: 1,
                        saltLength: 16
                    }),
                    nombre: "Juan Operador",
                    tipo: "operador",
                    turno: "matutino"
                },
                {
                    usuario: "operador2",
                    password: await argon2.hash("operador123", {
                        type: argon2.argon2id,
                        memoryCost: 19 * 1024,
                        timeCost: 2,
                        parallelism: 1,
                        saltLength: 16
                    }),
                    nombre: "Pedro Operador",
                    tipo: "operador",
                    turno: "vespertino"
                },
                {
                    usuario: "jefeTurno1",
                    password: await argon2.hash("jefe123", {
                        type: argon2.argon2id,
                        memoryCost: 19 * 1024,
                        timeCost: 2,
                        parallelism: 1,
                        saltLength: 16
                    }),
                    nombre: "María Jefe de Turno",
                    tipo: "jefeDeTurno",
                    turno: "matutino"
                },
                {
                    usuario: "jefeTurno2",
                    password: await argon2.hash("jefe123", {
                        type: argon2.argon2id,
                        memoryCost: 19 * 1024,
                        timeCost: 2,
                        parallelism: 1,
                        saltLength: 16
                    }),
                    nombre: "Roberto Jefe de Turno",
                    tipo: "jefeDeTurno",
                    turno: "vespertino"
                }
            ]);
            
            console.log("✅ Usuarios creados exitosamente:");
            console.log("   - admin / admin123 (Administrador)");
            console.log("   - operador1 / operador123 (Operador Turno Matutino)");
            console.log("   - operador2 / operador123 (Operador Turno Vespertino)");
            console.log("   - jefeTurno1 / jefe123 (Jefe de Turno Matutino)");
            console.log("   - jefeTurno2 / jefe123 (Jefe de Turno Vespertino)");
        } else {
            console.log("⚠️  La colección 'usuarios402' ya existe");
        }
        
        // ==================== REPORTES EMERGENCIAS URBANAS ====================
        if (!existingCollections.includes('reportesEU')) {
            await db.createCollection('reportesEU');
            console.log("✅ Colección 'reportesEU' creada");
            
            await db.collection('reportesEU').insertMany([
                {
                    id: 1,
                    fecha: new Date("2025-01-15T10:30:00Z"),
                    turno: "1",
                    personal_cargo: "Juan Pérez García",
                    modo_activacion: "llamada_emergencia",
                    tipo_servicio: "Inundación en vía pública",
                    fecha_hora_atencion: new Date("2025-01-15T10:45:00Z"),
                    tiempo_traslado: 15,
                    ubicacion_gps: "19.432608, -99.133209",
                    ubicacion_descripcion: "Calle Principal esquina con Avenida Central",
                    gravedad: "media",
                    km_recorridos: 8.5,
                    trabajos_realizados: "Desazolve de coladeras y retiro de escombros",
                    observaciones: "Se requiere seguimiento preventivo",
                    fotografias: {
                        src: "url_de_la_imagen",
                        title: "Evidencia fotográfica"
                    },
                    conclusion_dictamen: "Emergencia controlada satisfactoriamente",
                    responsables_emergencia: "Juan Pérez - Protección Civil",
                    autoridades_participantes: "Policía Municipal, Bomberos",
                    fecha_creacion: new Date("2025-01-15T10:30:00Z"),
                    creado_por: "usuario123",
                    fecha_modificacion: new Date("2025-01-15T12:00:00Z"),
                    modificado_por: "usuario123"
                },
                {
                    id: 2,
                    fecha: new Date("2024-10-02T15:20:00"),
                    turno: "2",
                    personal_cargo: "María López Hernández",
                    modo_activacion: "seguimiento_oficio",
                    tipo_servicio: "Deslizamiento de tierra",
                    fecha_hora_atencion: new Date("2024-10-02T16:00:00"),
                    tiempo_traslado: 40,
                    ubicacion_gps: "25.6829, -100.3400",
                    ubicacion_descripcion: "Colonia Independencia, calle Los Pinos",
                    gravedad: "media",
                    km_recorridos: 8.3,
                    trabajos_realizados: "Evaluación de riesgo estructural y evacuación preventiva",
                    observaciones: "Zona con riesgo medio de nuevos deslizamientos",
                    fotografias: [],
                    conclusion_dictamen: "Se recomienda monitoreo constante",
                    responsables_emergencia: "Ing. Carlos Ramírez",
                    autoridades_participantes: "Protección Civil Municipal, Obras Públicas",
                    fecha_creacion: new Date(),
                    creado_por: "admin"
                },
                {
                    id: 3,
                    fecha: new Date("2024-10-03T09:15:00"),
                    turno: "1",
                    personal_cargo: "Roberto Sánchez Torres",
                    modo_activacion: "llamada_emergencia",
                    tipo_servicio: "Inundación",
                    fecha_hora_atencion: new Date("2024-10-03T09:30:00"),
                    tiempo_traslado: 25,
                    ubicacion_gps: "25.6714, -100.3089",
                    ubicacion_descripcion: "Colonia Mitras Centro, calles inundadas",
                    gravedad: "critica",
                    km_recorridos: 18.2,
                    trabajos_realizados: "Rescate de personas atrapadas, evacuación de 15 familias",
                    observaciones: "Nivel del agua alcanzó 1.5 metros",
                    fotografias: [],
                    conclusion_dictamen: "Evacuación exitosa, daños materiales severos",
                    responsables_emergencia: "Cap. Fernando Ruiz",
                    autoridades_participantes: "Protección Civil, Policía Municipal, Cruz Roja",
                    fecha_creacion: new Date(),
                    creado_por: "admin"
                }
            ]);
            
            await db.collection('reportesEU').createIndex({ id: 1 }, { unique: true });
            await db.collection('reportesEU').createIndex({ fecha: -1 });
            console.log("✅ Datos de prueba y índices de reportesEU creados");
        } else {
            console.log("⚠️  La colección 'reportesEU' ya existe");
        }
        
        // ==================== REPORTES EMERGENCIAS HOSPITALARIAS ====================
        if (!existingCollections.includes('reportesEH')) {
            await db.createCollection('reportesEH');
            console.log("✅ Colección 'reportesEH' creada");
            
            await db.collection('reportesEH').insertMany([
                {
                    id: 1,
                    hora_llamada: new Date("2024-10-05T14:23:00"),
                    hora_salida: "14:25:00",
                    hora_llegada: "14:45:00",
                    hora_traslado: "15:10:00",
                    hora_ingreso_hospital: "15:30:00",
                    hora_salida_hospital: "16:00:00",
                    hora_base: "16:00:00",
                    calle: "Av. Constitución",
                    entre_calles: "Juárez y Hidalgo",
                    colonia: "Centro",
                    alcaldia_municipio: "Monterrey",
                    lugar_ocurrencia: "via_publica",
                    numero_ambulancia: "AMB-001",
                    operador: "Carlos Martínez",
                    tum: "Ana García",
                    socorrista: "Pedro Sánchez",
                    paciente_nombre: "Juan Pérez",
                    paciente_sexo: "masculino",
                    paciente_domicilio_calle: "Calle Morelos 123",
                    paciente_domicilio_colonia: "Del Valle",
                    paciente_domicilio_alcaldia: "San Pedro",
                    derechohabiente: "imss",
                    paciente_telefono: "8123456789",
                    paciente_ocupacion: "Empleado",
                    
                    // Sección adicional: Accidente automovilístico
                    secciones_adicionales: "accidente_automovilistico",
                    tipo_accidente: "colision",
                    tipo_impacto: "frontal",
                    cms: "15",
                    parabrisas: "estrellado",
                    volante: "integro",
                    bolsa_aire: true,
                    cinturon_seguridad: "colocado",
                    dentro_vehiculo: true,
                    
                    // Evaluación inicial
                    nivel_conciencia: "alerta",
                    deglucion: "presente",
                    via_aerea: "permeable",
                    ventilacion: "automatismo_regular",
                    ruidos_respiratorios: "normales",
                    pulso_carotideo: true,
                    pulso_radial: true,
                    paro_cardiorrespiratorio: false,
                    calidad_pulso: "ritmico",
                    piel_estado: "normal",
                    caracteristicas_piel: "normotermico",
                    
                    // Pupilas
                    pupilas_izquierda: "3mm reactiva",
                    pupilas_derecha: "3mm reactiva",
                    
                    // Signos vitales
                    apertura_ocular: "espontanea",
                    respuesta_motora: "espontanea_normal",
                    respuesta_verbal: "orientada",
                    glasgow_total: 15,
                    
                    // Información previa
                    alergias: "Ninguna conocida",
                    medicamentos: "Losartán 50mg",
                    padecimientos_cirugias: "Hipertensión",
                    ultima_comida: "Desayuno a las 8:00 am",
                    eventos_previos: "Colisión vehicular hace 30 minutos",
                    
                    // Condición y prioridad
                    condicion_paciente: "2_1",
                    prioridad: "2",
                    
                    // Traslado
                    hospital_traslado: "Hospital Universitario",
                    doctor: "Dr. Roberto Flores",
                    folio_cru: "CRU-2024-001",
                    
                    // Tratamiento - Vía aérea
                    aspiracion: false,
                    canula_orofaringea: false,
                    control_manual: true,
                    collarin_rigido: true,
                    
                    // Asistencia ventilatoria
                    mascarilla_simple: true,
                    latidos_por_minuto: 78,
                    
                    // Control de hemorragia
                    presion_directa: true,
                    vendaje_compresivo: true,
                    
                    // Vías venosas
                    hartmann: true,
                    linea_iv: 1,
                    cateter: 18,
                    cantidad_solucion: 500,
                    
                    // Atención básica
                    curacion: true,
                    inmovilizacion_extremidades: true,
                    observaciones_tratamiento: "Paciente estable, lesiones leves en extremidades",
                    
                    // Pertenencias
                    pertenencias: "Billetera\nCelular\nLlaves del vehículo",
                    
                    // Datos legales
                    autoridades_conocimiento: "Policía de Tránsito",
                    dependencia: "Tránsito Municipal",
                    num_unidad_legal: "TM-305",
                    num_oficial: "12458",
                    
                    // Vehículos involucrados
                    vehiculo_tipo: "Sedán",
                    vehiculo_marca: "Toyota Corolla",
                    vehiculo_placa: "ABC-1234",
                    
                    fecha_creacion: new Date(),
                    creado_por: "admin"
                },
                {
                    id: 2,
                    // Cronometría
                    hora_llamada: new Date("2024-10-06T08:15:00"),
                    hora_salida: "08:17:00",
                    hora_llegada: "08:32:00",
                    hora_traslado: "08:45:00",
                    hora_ingreso_hospital: "09:00:00",
                    hora_salida_hospital: "09:30:00",
                    hora_base: "09:30:00",
                    
                    // Ubicación
                    calle: "Calle Zaragoza 789",
                    entre_calles: "Morelos y Allende",
                    colonia: "Obispado",
                    alcaldia_municipio: "Monterrey",
                    lugar_ocurrencia: "hogar",
                    
                    // Control
                    numero_ambulancia: "AMB-002",
                    operador: "Laura Ramírez",
                    tum: "José Torres",
                    socorrista: "María González",
                    
                    // Datos del paciente
                    paciente_nombre: "Ana Martínez",
                    paciente_sexo: "femenino",
                    paciente_domicilio_calle: "Calle Zaragoza 789",
                    paciente_domicilio_colonia: "Obispado",
                    paciente_domicilio_alcaldia: "Monterrey",
                    derechohabiente: "issste",
                    paciente_telefono: "8187654321",
                    paciente_ocupacion: "Ama de casa",
                    
                    // Sección adicional: Parto
                    secciones_adicionales: "parto",
                    semanas_gesta: 39,
                    hora_inicio_contracciones: "06:00:00",
                    frecuencia_contracciones: "Cada 5 minutos",
                    duracion_contracciones: "45 segundos",
                    hora_nacimiento: "08:55:00",
                    placenta_expulsada: true,
                    lugar_parto: "Ambulancia",
                    producto: "vivo",
                    recien_nacido_sexo: "masculino",
                    edad_gestacional: 39,
                    
                    // Apgar - Color
                    color_1_minuto: "rosado",
                    color_5_minutos: "rosado",
                    
                    // Apgar - Frecuencia Cardiaca
                    fc_1_minuto: "mayor_140",
                    fc_5_minutos: "mayor_140",
                    
                    // Apgar - Irritabilidad Refleja
                    irritabilidad_refleja_1_minuto: "llora_retira",
                    irritabilidad_refleja_5_minutos: "llora_retira",
                    
                    // Apgar - Tono Muscular
                    tono_muscular_1_minuto: "movimiento_activo",
                    tono_muscular_5_minutos: "movimiento_activo",
                    
                    // Apgar - Respiración
                    respiracion_1_minuto: "llora",
                    respiracion_5_minutos: "llora",
                    
                    // Evaluación inicial (madre)
                    nivel_conciencia: "alerta",
                    deglucion: "presente",
                    via_aerea: "permeable",
                    ventilacion: "automatismo_rapido",
                    ruidos_respiratorios: "normales",
                    pulso_carotideo: true,
                    pulso_radial: true,
                    paro_cardiorrespiratorio: false,
                    calidad_pulso: "rapido",
                    piel_estado: "palida",
                    caracteristicas_piel: "diaforesis",
                    
                    // Pupilas
                    pupilas_izquierda: "4mm reactiva",
                    pupilas_derecha: "4mm reactiva",
                    
                    // Signos vitales
                    apertura_ocular: "espontanea",
                    respuesta_motora: "espontanea_normal",
                    respuesta_verbal: "orientada",
                    glasgow_total: 15,
                    
                    // Información previa
                    alergias: "Ninguna",
                    medicamentos: "Vitaminas prenatales",
                    padecimientos_cirugias: "Ninguno",
                    ultima_comida: "Cena ligera anoche",
                    eventos_previos: "Inicio de labor de parto",
                    
                    // Condición y prioridad
                    condicion_paciente: "2_1",
                    prioridad: "2",
                    
                    // Traslado
                    hospital_traslado: "Hospital de Ginecología",
                    doctor: "Dra. Patricia Méndez",
                    folio_cru: "CRU-2024-002",
                    
                    // Tratamiento
                    mascarilla_simple: true,
                    latidos_por_minuto: 95,
                    
                    // Vías venosas
                    hartmann: true,
                    linea_iv: 1,
                    cateter: 18,
                    cantidad_solucion: 1000,
                    
                    // Atención básica
                    observaciones_tratamiento: "Parto en ambulancia exitoso, madre y bebé estables",
                    
                    // Pertenencias
                    pertenencias: "Bolso con documentos\nCelular\nRopa del bebé",
                    
                    fecha_creacion: new Date(),
                    creado_por: "admin"
                },
                {
                    id: 3,
                    // Cronometría
                    hora_llamada: new Date("2024-10-07T18:45:00"),
                    hora_salida: "18:47:00",
                    hora_llegada: "19:05:00",
                    hora_traslado: "19:20:00",
                    hora_ingreso_hospital: "19:35:00",
                    hora_salida_hospital: "20:15:00",
                    hora_base: "20:15:00",
                    
                    // Ubicación
                    calle: "Av. Universidad 2500",
                    entre_calles: "Gómez Morín y Morones Prieto",
                    colonia: "San Jerónimo",
                    alcaldia_municipio: "Monterrey",
                    lugar_ocurrencia: "trabajo",
                    
                    // Control
                    numero_ambulancia: "AMB-003",
                    operador: "Miguel Hernández",
                    tum: "Sandra Morales",
                    socorrista: "Ricardo Vega",
                    
                    // Datos del paciente
                    paciente_nombre: "Luis Gómez",
                    paciente_sexo: "masculino",
                    paciente_domicilio_calle: "Calle Roble 345",
                    paciente_domicilio_colonia: "Residencial Santa María",
                    paciente_domicilio_alcaldia: "Guadalupe",
                    derechohabiente: "imss",
                    paciente_telefono: "8198765432",
                    paciente_ocupacion: "Ingeniero",
                    
                    // Sección adicional: Causa clínica
                    secciones_adicionales: "causa_clinica",
                    origen_probable: "cardiovascular",
                    especificacion_consulta: "1_vez",
                    
                    // Evaluación inicial
                    nivel_conciencia: "verbal",
                    deglucion: "ausente",
                    via_aerea: "comprometida",
                    ventilacion: "automatismo_irregular",
                    ruidos_respiratorios: "disminuidos",
                    hemitorax: "izquierdo",
                    sitio_auscultacion: "base",
                    pulso_carotideo: true,
                    pulso_radial: false,
                    paro_cardiorrespiratorio: false,
                    calidad_pulso: "arritmico",
                    piel_estado: "palida",
                    caracteristicas_piel: "diaforesis",
                    observaciones_adicionales: "Dolor torácico intenso, irradiado a brazo izquierdo",
                    
                    // Pupilas
                    pupilas_izquierda: "4mm reactiva",
                    pupilas_derecha: "4mm reactiva",
                    
                    // Signos vitales
                    apertura_ocular: "a_la_voz",
                    respuesta_motora: "localiza_dolor",
                    respuesta_verbal: "confusa",
                    glasgow_total: 12,
                    
                    // Información previa
                    alergias: "Penicilina",
                    medicamentos: "Atorvastatina, Aspirina",
                    padecimientos_cirugias: "Diabetes tipo 2, Hipertensión",
                    ultima_comida: "Comida a las 14:00 hrs",
                    eventos_previos: "Dolor torácico súbito hace 1 hora",
                    
                    // Condición y prioridad
                    condicion_paciente: "1_1",
                    prioridad: "1",
                    
                    // Traslado
                    hospital_traslado: "Hospital de Cardiología",
                    doctor: "Dr. Javier Rodríguez",
                    folio_cru: "CRU-2024-003",
                    
                    // Tratamiento - Vía aérea
                    aspiracion: true,
                    canula_orofaringea: true,
                    
                    // Asistencia ventilatoria
                    mascarilla_reservorio: true,
                    balon_valvula_mascarilla: true,
                    latidos_por_minuto: 110,
                    
                    // Medicamento
                    medicamento_hora: "19:10:00",
                    medicamento_dosis: "300mg",
                    medicamento_nombre: "Aspirina",
                    via_administracion: "Oral",
                    dr_tratante: "Dr. Javier Rodríguez",
                    
                    // Vías venosas
                    nacl: true,
                    linea_iv: 2,
                    cateter: 16,
                    cantidad_solucion: 500,
                    
                    // Atención básica
                    rcp: "avanzada",
                    observaciones_tratamiento: "Paciente con sospecha de infarto agudo al miocardio, traslado urgente a cardiología",
                    
                    // Pertenencias
                    pertenencias: "Cartera\nCelular\nLlaves\nGafete de trabajo",
                    
                    // Datos legales
                    autoridades_conocimiento: "Seguridad del edificio",
                    dependencia: "Protección Civil Empresarial",
                    
                    fecha_creacion: new Date(),
                    creado_por: "admin"
                }
            ]);
            
            await db.collection('reportesEH').createIndex({ id: 1 }, { unique: true });
            await db.collection('reportesEH').createIndex({ hora_llamada: -1 });
            console.log("✅ Datos de prueba y índices de reportesEH creados");
        } else {
            console.log("⚠️  La colección 'reportesEH' ya existe");
        }
        
        console.log("\n🎉 Base de datos configurada exitosamente!");
        console.log("\n📋 Credenciales de prueba:");
        console.log("   Usuario: admin");
        console.log("   Contraseña: admin123");
        
    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await client.close();
    }
}

setupDatabase();
