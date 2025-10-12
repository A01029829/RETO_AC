## Flujo Completo del Sistema
### Escenario 1: Admin crea un usuario
1. Admin hace login → authProvider guarda { tipo: "administrador" } en sessionStorage
2. Frontend muestra menú "Gestión de Usuarios" → Solo si permissions === 'administrador'
3. Admin llena formulario en UsuarioCreate → Click en "Guardar"
4. Frontend hace POST /registrarse con token JWT
5. Backend ejecuta requirePermission('gestionar_usuarios')
6. Verifica que rolePermissions.administrador.gestionar_usuarios === true 
7. Hashea la contraseña con argon2
8. Inserta usuario en usuarios402 con tipo y turno
9. Responde 201 Created
10. Frontend muestra notificación de éxito
### Escenario 2: Operador intenta ver todos los reportes
1. Operador hace login → authProvider guarda { tipo: "operador", usuario: "operador1" }
2. Frontend NO muestra menú "Gestión de Usuarios" (no es admin)
3. Operador va a "Reportes Emergencias Hospitalarias"
4. Frontend hace GET /reportesEH?_start=0&_end=10
5. Backend decodifica el token JWT → { tipo: "operador", usuario: "operador1" }
6. Llama a getReportFilter({ tipo: "operador", usuario: "operador1" })
7. Devuelve filtro: { creado_por: "operador1" }
8. MongoDB ejecuta: db.reportesEH.find({ creado_por: "operador1" })
9. Solo devuelve reportes creados por operador1
10. Frontend muestra solo esos reportes
### Escenario 3: Jefe de Turno ve reportes de su turno
1. Jefe hace login → { tipo: "jefeDeTurno", turno: "matutino" }
2. Va a reportes → GET /reportesEH
3. getReportFilter devuelve: { turno: "matutino" }
4. Ve todos los reportes del turno matutino (de todos los operadores de ese turno)