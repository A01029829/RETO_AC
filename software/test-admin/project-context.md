# Contexto del Proyecto - Sistema de Gestión de Emergencias

**Proyecto:** Sistema de Gestión de Emergencias - Alcaldía de Cuajimalpa  
**Versión SRS:** 1.0  
**Fecha:** 2025-01-14  

## Resumen Ejecutivo

El Sistema de Gestión de Emergencias es una plataforma web diseñada para la Alcaldía de Cuajimalpa que permite la gestión integral de reportes de emergencias prehospitalarias y urbanas. El sistema facilita la captura, seguimiento y análisis de incidentes atendidos por el personal operativo, incluyendo paramédicos, operadores, jefes de turno y administradores.

La plataforma está diseñada como un MVP escalable que centraliza la información de emergencias, optimiza los tiempos de respuesta y proporciona herramientas de análisis para la toma de decisiones operativas. El sistema maneja diferentes tipos de usuarios con permisos específicos, gestiona turnos de trabajo 24/7 y permite el almacenamiento de evidencias digitales.

El proyecto busca modernizar los procesos manuales actuales, mejorar la trazabilidad de los casos y proporcionar métricas que apoyen la planeación de recursos y la mitigación de riesgos urbanos.

## Objetivos y Alcance

### Objetivos Principales
- Digitalizar el proceso de creación y gestión de reportes de emergencia
- Implementar un sistema de roles y permisos que refleje la estructura organizacional
- Proporcionar dashboards y estadísticas para análisis operativo
- Facilitar el almacenamiento y gestión de evidencias digitales
- Optimizar la visualización de reportes por turnos de trabajo
- Habilitar exportación de datos para reportes oficiales

### Alcance del MVP
**Incluye:**
- Gestión completa de reportes de emergencia (CRUD)
- Sistema de autenticación y autorización por roles
- Visualización de reportes por turno y filtros avanzados
- Subida y gestión de evidencias (fotografías, firmas)
- Dashboard de estadísticas básicas
- Exportación de reportes en PDF (desde CSV de React Admin)
- Gestión de usuarios y asignación de roles

**No incluye en MVP:**
- Integración GPS (opcional, evaluar costos de APIs)
- Notificaciones push en tiempo real
- Aplicación móvil nativa
- Integración con sistemas externos de la alcaldía
- Testing automatizado (se hará testing manual)
- CI/CD pipeline (deployment manual)

### Límites del Sistema
- Enfocado únicamente en gestión de reportes post-incidente
- No incluye sistema de despacho de emergencias en tiempo real
- No maneja inventario de ambulancias o equipos médicos
- No incluye facturación o aspectos financieros

## Stack Tecnológico

### Frontend
- **Framework:** React 18+
- **UI Library:** React Admin para interfaz administrativa
- **Styling:** Material-UI (incluido en React Admin)
- **Data Provider:** express-mongoose-ra-json-server

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Authentication:** JWT (JSON Web Tokens) + bcrypt
- **Password Hashing:** bcrypt

### Base de Datos
- **Primary DB:** MongoDB 6.0+
- **ODM:** Mongoose
- **File Storage:** Sistema de archivos local

### Herramientas de Desarrollo
- **Version Control:** Git + GitHub
- **API Testing:** Postman/Insomnia (testing manual)
- **Database GUI:** MongoDB Compass

## Requerimientos Clave

### Funcionales (RF)
- **RF-001:** Autenticación de usuarios con email/contraseña
- **RF-002:** Creación de reportes de emergencia con todos los campos requeridos
- **RF-003:** Edición de reportes existentes (solo usuarios autorizados)
- **RF-004:** Visualización de reportes según permisos de rol
- **RF-005:** Filtrado de reportes por fecha, turno, tipo de emergencia
- **RF-006:** Gestión de roles y permisos (Operador, Jefe Turno, Admin, Jefe)
- **RF-007:** Subida de evidencias digitales (fotos, firmas)
- **RF-008:** Exportación de reportes en PDF y Excel
- **RF-009:** Dashboard con estadísticas operativas
- **RF-010:** Gestión de usuarios (CRUD) para administradores
- **RF-011:** Sistema de turnos con horarios oficiales
- **RF-012:** Visualización de reportes por turno específico

### No Funcionales (RNF)
- **RNF-001:** Seguridad - Autenticación JWT, hash de contraseñas
- **RNF-002:** Performance - Respuesta < 3 segundos para consultas
- **RNF-003:** Escalabilidad - Soporte para 100+ usuarios concurrentes
- **RNF-004:** Disponibilidad - 99% uptime durante horarios operativos
- **RNF-005:** Usabilidad - Interfaz responsive para tablets y móviles
- **RNF-006:** Backup - Respaldo diario automático de datos
- **RNF-007:** Compliance - Logs de auditoría para cambios críticos

## Flujo de Usuario Principal

### Pantallas Clave
1. **Login** - Autenticación de usuarios
2. **Dashboard** - Resumen de estadísticas y accesos rápidos
3. **Lista de Reportes** - Visualización con filtros y paginación
4. **Crear/Editar Reporte** - Formulario completo de captura
5. **Detalle de Reporte** - Vista completa con evidencias
6. **Gestión de Usuarios** - CRUD de usuarios (solo admins)
7. **Estadísticas** - Dashboard con métricas operativas
8. **Exportar** - Generación de reportes en PDF/Excel

### Flujo Principal
1. Usuario se autentica en el sistema
2. Accede al dashboard según su rol
3. Crea nuevo reporte o consulta existentes
4. Completa información requerida y sube evidencias
5. Guarda reporte y queda disponible según permisos
6. Supervisores pueden generar estadísticas y exportar datos

## Esquema de Datos Simplificado

### Colecciones Principales

**users**
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  nombre: String,
  rol: String, // 'operador', 'jefe_turno', 'admin', 'jefe'
  turno: String,
  activo: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**reportes**
```javascript
{
  _id: ObjectId,
  folio: Number (auto-increment, unique),
  fechaHora: Date,
  turno: String,
  ubicacionGPS: {
    lat: Number,
    lng: Number,
    direccion: String
  },
  tipoEmergencia: String, // 'prehospitalaria', 'urbana'
  gravedad: String, // 'baja', 'media', 'alta'
  afectaciones: String,
  paciente: String,
  insumosUtilizados: String,
  responsable: String,
  evidencias: [String], // URLs de archivos
  observaciones: String,
  conclusion: String,
  creadoPor: ObjectId (ref: users),
  createdAt: Date,
  updatedAt: Date
}
```

**turnos**
```javascript
{
  _id: ObjectId,
  nombre: String,
  tipo: String, // 'prehospitalario', 'urbano'
  horarioInicio: String,
  horarioFin: String,
  diasSemana: [String],
  personalAsignado: Number,
  activo: Boolean
}
```

## Reglas de Seguridad y Compliance

### Autenticación y Autorización
- Contraseñas hasheadas con bcrypt (salt rounds: 12)
- Tokens JWT con expiración de 8 horas
- Refresh tokens para sesiones extendidas
- Rate limiting: 5 intentos de login por minuto por IP

### Permisos por Rol
- **Operador:** Solo sus propios reportes, subir evidencias
- **Jefe de Turno:** Reportes de su turno, subir evidencias
- **Admin:** Todos los reportes, gestión de usuarios, estadísticas
- **Jefe:** Todos los reportes, estadísticas, exportar (no gestión usuarios)

### Protección de Datos
- Logs de auditoría para operaciones críticas
- Cifrado de datos sensibles en tránsito (HTTPS)
- Backup automático diario con retención de 30 días
- Acceso a evidencias solo para usuarios autorizados

### Compliance
- Logs de acceso y modificaciones
- Trazabilidad completa de cambios en reportes
- Políticas de retención de datos según normativas locales

## Non-Functional Targets

### Performance
- **Latencia:** < 3 segundos para consultas complejas
- **Throughput:** 100 requests/segundo concurrentes
- **Carga de archivos:** < 30 segundos para archivos de 10MB
- **Exportación:** < 60 segundos para reportes de 1000 registros

### Disponibilidad
- **Uptime:** 99% durante horarios operativos (6:00-24:00)
- **RTO (Recovery Time Objective):** < 4 horas
- **RPO (Recovery Point Objective):** < 1 hora de datos

### Escalabilidad
- Soporte inicial: 50 usuarios concurrentes
- Escalabilidad horizontal: hasta 200 usuarios
- Almacenamiento: 100GB inicial, escalable a 1TB
- Base de datos: Sharding preparado para crecimiento

### Monitoring y Logs
- Logs estructurados con Winston
- Métricas de performance con timestamps
- Alertas automáticas para errores críticos
- Dashboard de monitoreo para administradores

## Entregables y Milestones

### MVP (8 semanas)
**Milestone 1 - Infraestructura Base (2 semanas)**
- API REST configurada
- Base de datos MongoDB
- Autenticación JWT
- CI/CD pipeline básico

**Milestone 2 - Core Functionality (3 semanas)**
- CRUD de reportes completo
- Sistema de roles y permisos
- Frontend con React Admin básico

**Milestone 3 - Features Avanzadas (2 semanas)**
- Subida de evidencias
- Dashboard de estadísticas
- Exportación PDF/Excel

**Milestone 4 - Deployment y Testing (1 semana)**
- Testing integral
- Deployment a producción
- Documentación final

### Post-MVP (Fases Futuras)
- **Fase 2:** Integración GPS y mapas interactivos
- **Fase 3:** Aplicación móvil nativa
- **Fase 4:** Análisis predictivo y machine learning
- **Fase 5:** Integración con sistemas externos

## Definición de Done

### Para Issues/Tareas
- [ ] Código implementado y revisado
- [ ] Testing manual realizado
- [ ] Criterios de aceptación validados
- [ ] Funcionalidad probada en entorno local

### Para Historias de Usuario
- [ ] Todos los criterios de aceptación cumplidos
- [ ] UI/UX validado por stakeholders
- [ ] Testing manual de usuario realizado
- [ ] Funcionalidad desplegada y funcionando

## Convenciones de Código y API

### Naming Conventions
- **Variables/Funciones:** camelCase (JavaScript/TypeScript)
- **Constantes:** UPPER_SNAKE_CASE
- **Componentes React:** PascalCase
- **Archivos:** kebab-case para archivos, PascalCase para componentes
- **Base de datos:** snake_case para campos, camelCase en código

### API Standards
- **Endpoints:** RESTful con nombres en plural (/api/reportes)
- **HTTP Methods:** GET (read), POST (create), PUT (update), DELETE (delete)
- **Status Codes:** 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)

### Response Format
```javascript
{
  "status": "success" | "error",
  "data": any,
  "message": string,
  "pagination": {
    "page": number,
    "limit": number,
    "total": number
  }
}
```

### Error Handling
- Errores consistentes con códigos HTTP apropiados
- Mensajes de error descriptivos pero no sensibles
- Logging detallado para debugging
- Validación de entrada en todos los endpoints

## Procedimiento de Actualización

### Versionado de SRS
- **Versión Mayor (X.0.0):** Cambios arquitectónicos significativos
- **Versión Menor (1.X.0):** Nuevas funcionalidades
- **Versión Patch (1.0.X):** Correcciones y mejoras menores

### Proceso de Cambios
1. **Solicitud de Cambio:** Documentar en GitHub Issues
2. **Análisis de Impacto:** Evaluar afectación a sistema existente
3. **Aprobación:** Product Owner y Tech Lead
4. **Actualización SRS:** Modificar documento con nueva versión
5. **Comunicación:** Notificar a equipo de desarrollo
6. **Implementación:** Seguir proceso de desarrollo estándar

### Consulta para Futuros Agentes
- **Documentación:** Mantener README.md actualizado
- **Decisiones Técnicas:** Documentar en ADRs (Architecture Decision Records)
- **APIs:** Mantener documentación Swagger actualizada
- **Base de Datos:** Documentar cambios de schema en migraciones

## Contactos y Stakeholders

### Equipo del Proyecto
- **Product Owner:** [Por definir]
- **Tech Lead:** [Por definir]
- **Frontend Developer:** [Por definir]
- **Backend Developer:** [Por definir]
- **QA Engineer:** [Por definir]

### Stakeholders Alcaldía
- **Coordinador de Emergencias:** [Por definir]
- **Jefe de Sistemas:** [Por definir]
- **Usuario Final (Paramédicos):** [Por definir]

### Canales de Comunicación
- **Repositorio:** GitHub (URL por definir)
- **CI/CD:** GitHub Actions
- **Project Management:** GitHub Projects / Jira
- **Comunicación:** Slack / Microsoft Teams
- **Documentación:** GitHub Wiki / Confluence

## Anexos

### Referencias
- **SRS Original:** `SRS.txt` (versión completa)
- **Diagramas de Casos de Uso:** [Lucidchart URL en SRS]
- **Diagramas de Actividades:** [Lucidchart URL en SRS]
- **Matriz de Roles y Permisos:** Sección 12.4 del SRS

### Archivos de Referencia
- `package.json` - Dependencias del proyecto
- `docker-compose.yml` - Configuración de desarrollo
- `.env.example` - Variables de entorno requeridas
- `API.md` - Documentación detallada de endpoints
- `DEPLOYMENT.md` - Guía de despliegue
- `CONTRIBUTING.md` - Guía para contribuidores

### Recursos Externos
- **MongoDB Documentation:** https://docs.mongodb.com/
- **React Admin Documentation:** https://marmelab.com/react-admin/
- **Express.js Guide:** https://expressjs.com/
- **JWT Best Practices:** https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/