# Issues - Sistema de Gestión de Emergencias

**Proyecto:** Sistema de Gestión de Emergencias - Alcaldía de Cuajimalpa  
**Versión SRS:** 1.0  
**Fecha generada:** 2025-01-14  

## Tabla de Contenidos

- [ISSUE-001: Implementar autenticación y autorización de usuarios](#issue-001-implementar-autenticación-y-autorización-de-usuarios)
- [ISSUE-002: Crear modelo de datos para reportes de emergencia](#issue-002-crear-modelo-de-datos-para-reportes-de-emergencia)
- [ISSUE-003: Implementar CRUD de reportes de emergencia](#issue-003-implementar-crud-de-reportes-de-emergencia)
- [ISSUE-004: Desarrollar sistema de roles y permisos](#issue-004-desarrollar-sistema-de-roles-y-permisos)
- [ISSUE-005: Implementar visualización de reportes por turno](#issue-005-implementar-visualización-de-reportes-por-turno)
- [ISSUE-006: Crear funcionalidad de subida de evidencias](#issue-006-crear-funcionalidad-de-subida-de-evidencias)
- [ISSUE-007: Implementar exportación de reportes](#issue-007-implementar-exportación-de-reportes)
- [ISSUE-008: Desarrollar dashboard de estadísticas](#issue-008-desarrollar-dashboard-de-estadísticas)
- [ISSUE-009: Implementar gestión de usuarios](#issue-009-implementar-gestión-de-usuarios)
- [ISSUE-010: Crear sistema de turnos](#issue-010-crear-sistema-de-turnos)
- [ISSUE-011: Implementar integración GPS](#issue-011-implementar-integración-gps)
- [ISSUE-012: Desarrollar API REST](#issue-012-desarrollar-api-rest)
- [ISSUE-013: Configurar base de datos MongoDB](#issue-013-configurar-base-de-datos-mongodb)
- [ISSUE-014: Implementar frontend con React Admin](#issue-014-implementar-frontend-con-react-admin)


---

### ISSUE-001: Implementar autenticación y autorización de usuarios

**ID interno:** ISSUE-001  
**Relacionado a:** RF-001 / RNF-001  
**Área:** Backend | API  
**Prioridad:** High  
**Estimación:** 5d  

**Descripción:** Implementar sistema de autenticación JWT y autorización basada en roles para controlar el acceso a las funcionalidades del sistema según el tipo de usuario (Operador, Jefe de Turno, Admin, Jefe).

**Tareas concretas:**
- [ ] Configurar JWT para autenticación
- [ ] Implementar middleware de autorización
- [ ] Crear endpoints de login/logout
- [ ] Implementar hash de contraseñas con bcrypt
- [ ] Crear tests unitarios para auth
- [ ] Documentar endpoints de autenticación

**Criterios de aceptación:**
- CA1: Los usuarios deben autenticarse con email/username y contraseña
- CA2: El sistema debe generar tokens JWT válidos por 8 horas
- CA3: Los endpoints protegidos deben rechazar requests sin token válido
- CA4: Las contraseñas deben estar hasheadas en la base de datos

**Dependencias:** ISSUE-013  
**Notas técnicas:** Usar jsonwebtoken, bcryptjs. Implementar refresh tokens para sesiones largas. Considerar rate limiting para login attempts.

---

### ISSUE-002: Crear modelo de datos para reportes de emergencia

**ID interno:** ISSUE-002  
**Relacionado a:** RF-002 / RF-003  
**Área:** Backend | DB  
**Prioridad:** High  
**Estimación:** 3d  

**Descripción:** Definir y crear el esquema de datos para reportes de emergencia basado en el diccionario de datos del SRS, incluyendo validaciones y relaciones.

**Tareas concretas:**
- [ ] Crear schema de MongoDB para reportes
- [ ] Implementar validaciones de campos obligatorios
- [ ] Crear índices para búsquedas eficientes
- [ ] Implementar auto-incremento para folio
- [ ] Crear tests para el modelo
- [ ] Documentar estructura de datos

**Criterios de aceptación:**
- CA1: El modelo debe incluir todos los campos del diccionario de datos
- CA2: Los campos obligatorios deben tener validación
- CA3: El folio debe ser único y auto-incremental
- CA4: Las coordenadas GPS deben validarse como números válidos

**Dependencias:** ISSUE-013  
**Notas técnicas:** Usar Mongoose para schemas. Campos: folio, fecha/hora, turno, ubicacionGPS, tipoEmergencia, gravedad, afectaciones, paciente, insumosUtilizados, responsable, evidencias, observaciones, conclusion.

---

### ISSUE-003: Implementar CRUD de reportes de emergencia

**ID interno:** ISSUE-003  
**Relacionado a:** RF-004 / RF-005 / RF-006  
**Área:** Backend | API  
**Prioridad:** High  
**Estimación:** 5d  

**Descripción:** Crear endpoints REST para operaciones CRUD de reportes de emergencia con validaciones de permisos según el rol del usuario.

**Tareas concretas:**
- [ ] Implementar POST /api/reportes (crear reporte)
- [ ] Implementar GET /api/reportes (listar con filtros)
- [ ] Implementar GET /api/reportes/:id (obtener individual)
- [ ] Implementar PUT /api/reportes/:id (editar reporte)
- [ ] Implementar DELETE /api/reportes/:id (eliminar reporte)
- [ ] Agregar validaciones de permisos por rol
- [ ] Probar endpoints manualmente con Postman/Insomnia

**Criterios de aceptación:**
- CA1: Solo usuarios autenticados pueden acceder a los endpoints
- CA2: Los operadores solo pueden ver sus propios reportes
- CA3: Los jefes de turno pueden ver reportes de su turno
- CA4: Los admins pueden ver todos los reportes
- CA5: Solo admins pueden editar reportes

**Dependencias:** ISSUE-001, ISSUE-002, ISSUE-004  
**Notas técnicas:** Implementar paginación, filtros por fecha, turno, tipo de emergencia.

---

### ISSUE-004: Desarrollar sistema de roles y permisos

**ID interno:** ISSUE-004  
**Relacionado a:** RF-007 / RNF-002  
**Área:** Backend | API  
**Prioridad:** High  
**Estimación:** 3d  

**Descripción:** Implementar sistema de roles (Operador, Jefe de Turno, Admin, Jefe) con permisos específicos según la matriz de permisos del SRS.

**Tareas concretas:**
- [ ] Crear modelo de roles en la base de datos
- [ ] Implementar middleware de verificación de permisos
- [ ] Crear funciones helper para validar permisos
- [ ] Implementar asignación de roles a usuarios
- [ ] Crear tests para validación de permisos
- [ ] Documentar matriz de permisos

**Criterios de aceptación:**
- CA1: Cada usuario debe tener un rol asignado
- CA2: Los permisos deben coincidir con la matriz del SRS
- CA3: El sistema debe rechazar acciones no permitidas por rol
- CA4: Los cambios de rol deben requerir permisos de admin

**Dependencias:** ISSUE-001  
**Notas técnicas:** Roles: operador, jefe_turno, admin, jefe. Permisos: ver_propios_reportes, ver_reportes_turno, ver_todos_reportes, editar_reportes, subir_evidencias, generar_estadisticas, gestionar_usuarios, exportar_reportes.

---

### ISSUE-005: Implementar visualización de reportes por turno

**ID interno:** ISSUE-005  
**Relacionado a:** RF-008  
**Área:** Backend | API  
**Prioridad:** Medium  
**Estimación:** 3d  

**Descripción:** Crear endpoints para visualizar reportes filtrados por turno, considerando los horarios oficiales definidos en el SRS.

**Tareas concretas:**
- [ ] Implementar lógica de cálculo de turnos
- [ ] Crear endpoint GET /api/reportes/turno/:turnoId
- [ ] Implementar filtros por fecha y tipo de turno
- [ ] Agregar validación de permisos por rol
- [ ] Crear tests para filtros de turno
- [ ] Documentar estructura de turnos

**Criterios de aceptación:**
- CA1: Los jefes de turno solo pueden ver reportes de su turno
- CA2: El sistema debe calcular correctamente los turnos según horarios
- CA3: Los filtros deben funcionar para emergencias prehospitalarias y urbanas
- CA4: La respuesta debe incluir estadísticas del turno

**Dependencias:** ISSUE-003, ISSUE-004, ISSUE-010  
**Notas técnicas:** Considerar turnos: matutino (8-15h), vespertino (15-21h), nocturno (21-8h), guardias 24/7 para urbanas.

---

### ISSUE-006: Crear funcionalidad de subida de evidencias

**ID interno:** ISSUE-006  
**Relacionado a:** RF-009  
**Área:** Backend | API  
**Prioridad:** Medium  
**Estimación:** 3d  

**Descripción:** Implementar sistema de subida y almacenamiento de evidencias (fotografías, firmas electrónicas) asociadas a reportes de emergencia.

**Tareas concretas:**
- [ ] Implementar endpoint POST /api/reportes/:id/evidencias
- [ ] Crear validaciones de tipo y tamaño de archivo
- [ ] Implementar almacenamiento local en servidor
- [ ] Crear endpoint GET para descargar evidencias
- [ ] Probar subida de archivos manualmente

**Criterios de aceptación:**
- CA1: Solo formatos JPG, PNG, PDF permitidos
- CA2: Tamaño máximo de 10MB por archivo
- CA3: Las evidencias deben asociarse correctamente al reporte
- CA4: Solo usuarios con permisos pueden subir evidencias
- CA5: Las evidencias deben ser accesibles solo por usuarios autorizados

**Dependencias:** ISSUE-003, ISSUE-004  
**Notas técnicas:** Almacenamiento local en carpeta /uploads del servidor.

---

### ISSUE-007: Implementar exportación de reportes

**ID interno:** ISSUE-007  
**Relacionado a:** RF-010  
**Área:** Backend | Frontend  
**Prioridad:** Medium  
**Estimación:** 2d  

**Descripción:** Crear funcionalidad para exportar reportes en formato PDF aprovechando la exportación CSV nativa de React Admin.

**Tareas concretas:**
- [ ] Configurar exportación CSV en React Admin
- [ ] Implementar conversión de CSV a PDF
- [ ] Agregar filtros por fecha, turno, tipo de emergencia
- [ ] Implementar validación de permisos de exportación
- [ ] Probar exportación manualmente

**Criterios de aceptación:**
- CA1: Solo usuarios con permisos pueden exportar reportes
- CA2: Los archivos deben incluir todos los campos relevantes
- CA3: Los filtros deben aplicarse correctamente
- CA4: Los archivos deben generarse correctamente

**Dependencias:** ISSUE-003, ISSUE-004, ISSUE-014  
**Notas técnicas:** Usar la funcionalidad nativa de React Admin para CSV y convertir a PDF.

---

### ISSUE-008: Desarrollar dashboard de estadísticas

**ID interno:** ISSUE-008  
**Relacionado a:** RF-011  
**Área:** Backend | API  
**Prioridad:** Medium  
**Estimación:** 3d  

**Descripción:** Crear endpoints para generar estadísticas y métricas del sistema de emergencias para dashboards administrativos.

**Tareas concretas:**
- [ ] Implementar endpoint GET /api/estadisticas/resumen
- [ ] Crear métricas por tipo de emergencia
- [ ] Implementar estadísticas por turno y período
- [ ] Agregar métricas de gravedad de emergencias
- [ ] Probar cálculos estadísticos manualmente

**Criterios de aceptación:**
- CA1: Solo usuarios con permisos pueden ver estadísticas
- CA2: Las métricas deben calcularse correctamente
- CA3: El dashboard debe cargar correctamente
- CA4: Los datos deben reflejar la información actual

**Dependencias:** ISSUE-003, ISSUE-004  
**Notas técnicas:** Usar agregaciones básicas de MongoDB.

---

### ISSUE-009: Implementar gestión de usuarios

**ID interno:** ISSUE-009  
**Relacionado a:** RF-012  
**Área:** Backend | API  
**Prioridad:** Medium  
**Estimación:** 4d  

**Descripción:** Crear funcionalidad completa de gestión de usuarios (CRUD) con asignación de roles y validaciones de seguridad.

**Tareas concretas:**
- [ ] Implementar endpoint POST /api/usuarios (crear usuario)
- [ ] Implementar endpoint GET /api/usuarios (listar usuarios)
- [ ] Implementar endpoint PUT /api/usuarios/:id (editar usuario)
- [ ] Implementar endpoint DELETE /api/usuarios/:id (eliminar usuario)
- [ ] Agregar validaciones de email único
- [ ] Implementar cambio de contraseña
- [ ] Crear tests para gestión de usuarios

**Criterios de aceptación:**
- CA1: Solo admins pueden gestionar usuarios
- CA2: Los emails deben ser únicos en el sistema
- CA3: Las contraseñas deben cumplir políticas de seguridad
- CA4: No se puede eliminar el último usuario admin

**Dependencias:** ISSUE-001, ISSUE-004  
**Notas técnicas:** Validar email con regex, implementar políticas de contraseña (min 8 chars, mayúscula, número). Considerar activación por email.

---

### ISSUE-010: Crear sistema de turnos

**ID interno:** ISSUE-010  
**Relacionado a:** RF-013  
**Área:** Backend | DB  
**Prioridad:** Medium  
**Estimación:** 3d  

**Descripción:** Implementar modelo y lógica para gestión de turnos oficiales según los horarios definidos en el SRS.

**Tareas concretas:**
- [ ] Crear modelo de turnos en MongoDB
- [ ] Implementar lógica de cálculo de turno actual
- [ ] Crear endpoint GET /api/turnos
- [ ] Implementar asignación de personal a turnos
- [ ] Crear funciones helper para validar turnos
- [ ] Implementar tests para lógica de turnos

**Criterios de aceptación:**
- CA1: El sistema debe reconocer todos los turnos del SRS
- CA2: La lógica debe calcular correctamente el turno actual
- CA3: Los turnos deben diferenciarse entre prehospitalarios y urbanos
- CA4: El personal debe asignarse correctamente a turnos

**Dependencias:** ISSUE-002  
**Notas técnicas:** Turnos prehospitalarios: matutino, vespertino, nocturno con rotación. Urbanas: guardia continua 24/7. Usar moment.js para cálculos de fecha/hora.

---

### ISSUE-011: Implementar integración GPS (OPCIONAL)

**ID interno:** ISSUE-011  
**Relacionado a:** RF-014 / RNF-003  
**Área:** Frontend | Backend  
**Prioridad:** Low  
**Estimación:** 5d  

**Descripción:** Integrar funcionalidad GPS para captura automática de ubicación y visualización en mapa interactivo.

**NOTA:** Esta funcionalidad es opcional y podría no implementarse en el MVP final. Verificar disponibilidad y costos de APIs de mapas antes de proceder.

**Tareas concretas:**
- [ ] Evaluar APIs de mapas gratuitas disponibles
- [ ] Integrar API de geolocalización del navegador
- [ ] Implementar componente básico de mapa
- [ ] Crear validación de coordenadas GPS
- [ ] Probar funcionalidad en dispositivos móviles

**Criterios de aceptación:**
- CA1: El sistema debe capturar ubicación automáticamente
- CA2: Los usuarios deben poder ajustar la ubicación manualmente
- CA3: Las coordenadas deben validarse como válidas
- CA4: Debe funcionar sin costos adicionales

**Dependencias:** ISSUE-002, ISSUE-014  
**Notas técnicas:** Evaluar OpenStreetMap gratuito vs Google Maps (con costos). Considerar si es necesario para el MVP.

---

### ISSUE-012: Desarrollar API REST

**ID interno:** ISSUE-012  
**Relacionado a:** RNF-004  
**Área:** Backend | API  
**Prioridad:** High  
**Estimación:** 2d  

**Descripción:** Configurar estructura base de la API REST con Express.js y middleware básico.

**Tareas concretas:**
- [ ] Configurar Express.js con middleware básico
- [ ] Configurar manejo de errores global
- [ ] Implementar estructura de respuesta JSON consistente
- [ ] Probar API básica manualmente

**Criterios de aceptación:**
- CA1: La API debe seguir convenciones REST
- CA2: Los errores deben manejarse consistentemente
- CA3: Estructura de respuesta JSON consistente
- CA4: Servidor debe iniciar correctamente

**Dependencias:** Ninguna  
**Notas técnicas:** Usar Express.js básico. Estructura de respuesta JSON con status, data, message.

---

### ISSUE-013: Configurar base de datos MongoDB

**ID interno:** ISSUE-013  
**Relacionado a:** RNF-005  
**Área:** DB | DevOps  
**Prioridad:** High  
**Estimación:** 2d  

**Descripción:** Configurar MongoDB con Mongoose, crear conexión, índices y scripts de inicialización de datos.

**Tareas concretas:**
- [ ] Configurar conexión a MongoDB con Mongoose
- [ ] Crear scripts de migración/seeding
- [ ] Configurar índices para optimización
- [ ] Implementar backup automático
- [ ] Configurar variables de entorno
- [ ] Crear tests de conexión
- [ ] Documentar esquema de base de datos

**Criterios de aceptación:**
- CA1: La conexión debe ser estable y con retry automático
- CA2: Los índices deben optimizar las consultas principales
- CA3: Debe existir script de datos iniciales
- CA4: Las credenciales deben estar en variables de entorno

**Dependencias:** Ninguna  
**Notas técnicas:** Usar mongoose, crear índices en folio, fecha, turno, tipoEmergencia. Configurar connection pooling. Considerar MongoDB Atlas para producción.

---

### ISSUE-014: Implementar frontend con React Admin

**ID interno:** ISSUE-014  
**Relacionado a:** RF-015 / RNF-006  
**Área:** Frontend (React Admin)  
**Prioridad:** High  
**Estimación:** 6d  

**Descripción:** Desarrollar interfaz de usuario completa usando React Admin con todas las funcionalidades CRUD y dashboards.

**Tareas concretas:**
- [ ] Configurar React Admin con data provider (después de tener endpoints REST)
- [ ] Crear recursos para reportes, usuarios, turnos
- [ ] Implementar formularios de creación/edición
- [ ] Crear dashboard con estadísticas
- [ ] Implementar autenticación en frontend
- [ ] Configurar permisos por rol en UI
- [ ] Crear componentes personalizados para evidencias
- [ ] Probar interfaz manualmente

**Criterios de aceptación:**
- CA1: La interfaz debe ser responsive
- CA2: Los permisos deben reflejarse correctamente en la UI
- CA3: Los formularios deben validar datos antes de enviar
- CA4: El dashboard debe mostrar métricas correctamente

**Dependencias:** ISSUE-003, ISSUE-001  
**Notas técnicas:** Usar react-admin con el data provider express-mongoose-ra-json-server. Configurar después de tener los endpoints funcionando.

---



## Resumen de estimaciones

**Total estimado:** 43 días laborales

**Por área:**
- Backend/API: 25d
- Frontend: 6d  
- Base de datos: 2d
- GPS (opcional): 5d
- Testing: Manual (incluido en estimaciones)

**Por prioridad:**
- High: 20d
- Medium: 18d  
- Low: 5d (opcional)

**Sprints sugeridos (2 semanas cada uno):**
- Sprint 1: ISSUE-012, ISSUE-013, ISSUE-001 (9d)
- Sprint 2: ISSUE-002, ISSUE-004, ISSUE-003 (11d)  
- Sprint 3: ISSUE-014, ISSUE-009 (10d)
- Sprint 4: ISSUE-005, ISSUE-006, ISSUE-007 (8d)
- Sprint 5: ISSUE-008, ISSUE-010 (6d)
- Sprint 6: ISSUE-011 (5d - opcional)

## Cómo usar este documento

**Para Product Owners:**
1. Importar issues al tablero de proyecto (Jira, GitHub Projects, etc.)
2. Priorizar según necesidades del negocio
3. Asignar issues a sprints considerando dependencias
4. Revisar criterios de aceptación antes de marcar como Done

**Formato CSV para importación:**
```csv
ID,Title,Description,Priority,Estimation,Area,Dependencies
ISSUE-001,Implementar autenticación y autorización,Sistema JWT y roles,High,5d,Backend,ISSUE-013
```

**Nota importante:** Los endpoints REST (ISSUE-003) deben completarse antes de configurar el data provider de React Admin (ISSUE-014). El data provider necesita los endpoints funcionando para conectarse correctamente.

**Vinculación con historias de usuario:**
- Cada issue referencia requisitos funcionales específicos
- Los criterios de aceptación mapean directamente a las historias
- Las dependencias aseguran flujo lógico de desarrollo