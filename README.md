# Integrantes del Equipo 
- Luis Emilio Veledíaz Flores A01029829
- Diego de la Vega Saishio A01420632
- Santiago Coronado Hernández A01785558
- Héctor Lugo Gabino A01029811
- Katia Abigail Álvarez Contreras A01781097

# Sistema de Gestión de Emergencias - Protección Civil

Sistema integral para la gestión de emergencias urbanas y hospitalarias, desarrollado para mejorar la coordinación y respuesta ante situaciones de emergencia. El sistema permite registrar, monitorear y gestionar reportes de emergencias con diferentes niveles de acceso según el rol del usuario.

##  Descripción del Proyecto

Este sistema está diseñado para:
- **Gestión de Reportes**: Registro y seguimiento de emergencias urbanas y hospitalarias
- **Control de Acceso por Roles**: Administradores, jefes de turno, operadores EH (Emergencias Hospitalarias) y operadores EU (Emergencias Urbanas)
- **Dashboard en Tiempo Real**: Visualización de estadísticas y métricas de emergencias
- **Gestión de Turnos**: Sistema de turnos automático para operadores
- **Geolocalización**: Integración con mapas para ubicación de emergencias
- **Sistema de Notas**: Comunicación y seguimiento entre operadores
- **Logs de Auditoría**: Registro completo de todas las acciones en el sistema

##  Tecnologías Utilizadas

### Frontend
- **React** - Framework de interfaz de usuario
- **React Admin** - Framework de administración
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Material-UI (MUI)** - Componentes de interfaz
- **React Leaflet** - Mapas interactivos
- **Recharts** - Gráficas y visualizaciones
- **React Router** - Navegación
- **HTTPS** - Protocolo seguro con certificados autofirmados

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **JWT (jsonwebtoken)** - Autenticación basada en tokens
- **Argon2** - Hash seguro de contraseñas
- **CORS** - Manejo de peticiones entre dominios
- **HTTPS** - Servidor seguro con certificados SSL

##  Instalación

### Prerrequisitos
- Node.js (v20)
- MongoDB 
- npm o pnpm

### 1. Clonar el Repositorio
```bash
git clone https://github.com/A01029829/RETO_AC.git
cd RETO_AC
```

### 2. Instalar Dependencias

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd backEnd
npm install
```

### 3.  Descargar Base de datos y Configurar Base de Datos 

En linux para descargar MongoDB:
```bash
sudo apt update
sudo apt-get install gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] http://repo.mongodb.org/apt/debian bookworm/mongodb-org/8.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

Dentro de la carpeta RETO_AC/backEnd para inicializar la base de datos en terminal de linux o windows escribe el siguiente comando:

```bash
cd backEnd
node setupDB.js
```

Este comando creará las colecciones necesarias y usuarios predeterminados:
- **Admin**: usuario: `admin`, password: `admin123`
- **Operador EH**: usuario: `operador1`, password: `operador123`
- **Operador EU**: usuario: `operatorU1`, password: `operatorU123`
- **Jefe de Turno**: usuario: `jefeTurno1`, password: `jefe123`

### 4. Configurar Variables de Entorno

#### Backend
Crea un archivo `.env` en la carpeta `backEnd` (si no existe):

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=tu_secreto_jwt_seguro
```

#### Frontend
Crea un archivo `.env` en la carpeta raíz del proyecto (RETO_AC):

```env
VITE_JSON_SERVER_URL=https://localhost:3000
```

**Nota:** Si estás usando túneles SSH o la aplicación en VMs, el `VITE_JSON_SERVER_URL` debe apuntar a `https://localhost:3000` ya que el túnel redirige el tráfico localmente.

##  Ejecución Local con HTTPS

### Certificados SSL

El proyecto incluye certificados autofirmados para HTTPS:
- Frontend: `frontend.crt` y `frontend.key`
- Backend: `backEnd/backend.crt` y `backEnd/backend.key`

Para generar nuevos certificados autofirmados:

```powershell
# Frontend

openssl genrsa -out frontend.key 4096
openssl req -x509 -new -key frontend.key -out frontend.crt -days 365 

# Backend
cd backEnd
openssl genrsa -out backend.key 4096
openssl req -x509 -new -key backend.key -out backend.crt -days 365 
```

### Iniciar la Aplicación

#### 1. Iniciar MongoDB
```powershell
# Comando para entrar a mongo
mongosh
```
**1.1 Revisar si mongo esta activo**
```powershell
# Comando para verificar el estado de mongo en linux
sudo systemctl status mongod
```
**1.2 Sí está apagado entonces ejecuta el siguiente comando:**
```powershell
# Comando para activar mongo
sudo systemctl start mongod
```

#### 2. Iniciar el Backend (Terminal 1)
```powershell
cd backEnd
npm run dev
```
El backend estará disponible en: `https://localhost:3000`

#### 3. Iniciar el Frontend (Terminal 2)
```powershell
npm run dev
```
El frontend estará disponible en: `https://localhost:5173`

### Acceder a la Aplicación

1. Abre tu navegador en `https://localhost:5173`
2. Acepta el certificado autofirmado (es seguro en desarrollo local)
3. Inicia sesión con las credenciales predeterminadas

##  Ejecución en Máquinas Virtuales con SSH Tunneling

Para acceder a la aplicación corriendo en máquinas virtuales remotas mediante SSH jump host y túneles.

### Arquitectura
```
Tu Máquina Local → Jump Host → VM Backend (Puerto 3000)
                             → VM Frontend (Puerto 5173)
```

### Paso 1: Configurar SSH Jump

Edita tu archivo SSH config (`~/.ssh/config`):
- Agrega la llave para acceder al servidor de Jump

### Paso 2: Crear Túneles SSH

#### Túneles en Terminales Separadas

**Terminal 1 - Túnel para Backend:**
```powershell
ssh -L 3000:<Ip de la computadora Virtual del backend>:3000 jump@<IP del servidor del jump para accerder a la Maquina Virtual>
```

**Terminal 2 - Túnel para Frontend:**
```powershell
ssh -L 5173:<Ip de la computadora Virtual del frontend>:5173 jump@<IP del servidor del jump para accerder a la Maquina Virtual>
```


### Paso 3: Acceder a la Aplicación

Una vez establecidos los túneles:
1. Abre `https://localhost:5173` en tu navegador
2. Abre `https://localhost:3000` (ej. `https://localhost:3000/reportesEH`), para permitir la conexion del backend en tu computadora.
3. El frontend se comunicará automáticamente con el backend a través del túnel

### Cerrar Túneles

Para cerrar los túneles, simplemente cierra las terminales o presiona `Ctrl+C` en cada una.

##  Estructura del Proyecto

- /backend:
    - index.mjs : inicio de servidor y endpoints
    - setupDB.js : script para inicializar la base de daots
    - /autenticacion
        - Authenticacion.mjs : middleware de permisos
- /src:
    - /components:
        - GeoAutofillOnMount.tsx
        - Map.tsx
    - /utils:
        - getUserAddress.tsx
        - getUserLocation.tsx
    - App.tsx : donde de llama a toda las partes de la apliación
    - dataProvider.ts : conexion de backend con react-admin
    - authProvider.ts : autentificador de usuario


##  Roles y Permisos

- **Administrador**: Acceso completo, gestión de usuarios
- **Jefe de Turno**: Supervisión y edición de todos los reportes
- **Operador EH**: Crear y visualizar reportes de emergencias hospitalarias
- **Operador EU**: Crear y visualizar reportes de emergencias urbanas

##  Seguridad

- Autenticación basada en JWT
- Contraseñas hasheadas con Argon2
- Comunicación HTTPS en frontend y backend
- Validación de permisos por rol
- Sistema de logs para auditoría

##  Troubleshooting

### Error de certificado SSL
Si el navegador bloquea el certificado autofirmado:
1. Firefox: Haz clic en "Avanzado" → "Aceptar el riesgo y continuar"

### MongoDB no conecta
```powershell
# Verificar que MongoDB esté corriendo
Get-Process mongod
```

### Puerto ya en uso
```powershell
# Encontrar y cerrar proceso en puerto 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Túneles SSH no funcionan
```powershell
# Verificar conectividad SSH
ssh jump-host "echo 'Conexión exitosa'"
ssh backend-vm "echo 'Conexión exitosa'"
```

##  Scripts Disponibles

### Frontend
- `npm run dev` - Inicia servidor de desarrollo

### Backend
- `npm run dev` - Inicia servidor con nodemon
- `node index.mjs` - Inicia servidor con nodemon
- `node setupDB.js` - Inicializa la base de datos



### **Desarrollado para Protección Civil de Alcaldia Cuajimalpa** 

