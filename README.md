# TaskFlow System

> **Sistema de Gestión de Tareas Full-Stack con Autenticación JWT y Sistema de Roles**

---

## 👨‍💻 Información del Estudiante

| Campo | Detalle |
|---|---|
| **Nombre** | Wilson Javier Alfonso Borja |
| **Proyecto** | TaskFlow — Sistema de Gestión de Tareas Api|
| **Stack** | Node.js · Express · PostgreSQL · React · Vite |

---

## 📋 Descripción de la Funcionalidad Implementada

**TaskFlow** es una aplicación web de gestión de tareas que implementa una arquitectura cliente-servidor completa con las siguientes funcionalidades:

### 🔐 Autenticación y Seguridad
- **Registro e inicio de sesión** de usuarios con contraseñas encriptadas mediante `bcryptjs`.
- **Sistema JWT dual** con `accessToken` (corta duración: 5 min) y `refreshToken` (larga duración: 1 hora).
- **Silent Refresh con Cola de Peticiones:** El cliente detecta tokens expirados (HTTP 401/403) automáticamente. Si múltiples peticiones fallan simultáneamente, solo se realiza una llamada de refresco y las demás se encolan, evitando condiciones de carrera.
- **Validación de Sesión Remota (SID):** Cada `accessToken` lleva un `sid` que se valida contra la tabla `refresh_tokens` en cada petición, permitiendo revocar sesiones desde el servidor de forma inmediata.
- **Cierre de sesión global:** Al expirar el refresh token, el sistema limpia el estado de autenticación sin recargar la página.

### 👥 Sistema de Roles
- Roles diferenciados: `user` (por defecto) y `admin`.
- El rol se incluye en el payload del JWT para decisiones de interfaz.
- **RoleGuard** en el frontend para proteger rutas exclusivas (ej. `/admin`).
- El panel de administración permite gestionar usuarios, ver sesiones activas y revocarlas.

### ✅ Gestión de Tareas (CRUD Completo)
- Crear, leer, actualizar y eliminar tareas.
- Cada tarea tiene `título`, `descripción`, `estado`, `prioridad`, `fecha de vencimiento` y `categoría`.
- Filtrado por `status`, `priority` y `user_id`.
- Estadísticas en tiempo real del estado de las tareas.
- Actualización automática del campo `updated_at` mediante un trigger de PostgreSQL.
- Búsqueda de tareas por ID con actualización en tiempo real mediante sistema de _triggers_ con marcas de tiempo.

### 🗂️ Gestión de Categorías (CRUD Completo)
- Los usuarios pueden crear, leer, actualizar y eliminar sus propias categorías.
- Las categorías están vinculadas al usuario propietario (`user_id`).
- Las tareas pueden asociarse a una categoría; al eliminarse la categoría, las tareas quedan sin categoría (`SET NULL`).

### ⚡ Optimizaciones de Rendimiento (Frontend)
- Uso extensivo de `useCallback` en hooks y componentes para evitar re-renders innecesarios.
- Componentes memorizados con `React.memo` para mejorar el rendimiento.
- Header dinámico que adapta el menú según el estado de autenticación y el rol del usuario.

### 🌐 Configuración de Red y Despliegue
- **Soporte Multi-Origen (CORS):** Permite múltiples URLs en `FRONTEND_URL` separadas por comas, facilitando el acceso simultáneo desde `localhost` y desde IPs de red local.
- **Detección dinámica de API:** El cliente detecta automáticamente si se accede mediante una IP de red y ajusta la URL de la API correspondientemente.
- **Acceso externo:** Tanto el backend (`HOST=0.0.0.0`) como el frontend (`server: { host: true }` en Vite) aceptan conexiones desde otros dispositivos de la misma red.

---

## 🗄️ Estructura de la Base de Datos

La base de datos se llama `taskflow_db` y utiliza **PostgreSQL**. A continuación se describen las tablas implementadas:

### Tipos ENUM personalizados

```sql
task_status  → ('pending', 'in_progress', 'completed')
task_priority → ('low', 'medium', 'high')
```

---

### Tabla `users`
Almacena la información de los usuarios registrados en el sistema.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Identificador único autoincremental |
| `name` | `VARCHAR(255)` | `NOT NULL` | Nombre del usuario |
| `email` | `VARCHAR(255)` | `UNIQUE NOT NULL` | Correo electrónico (identificador de login) |
| `password` | `VARCHAR(255)` | `NOT NULL` | Contraseña encriptada con bcrypt |
| `avatar` | `VARCHAR(255)` | — | URL de la imagen de perfil |
| `role` | `VARCHAR(50)` | `DEFAULT 'user'` | Rol del usuario (`user` / `admin`) |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` | Fecha de registro |

---

### Tabla `categories`
Almacena las categorías creadas por cada usuario para organizar sus tareas.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Identificador único autoincremental |
| `name` | `VARCHAR(255)` | `NOT NULL` | Nombre de la categoría |
| `description` | `TEXT` | — | Descripción opcional |
| `user_id` | `INTEGER` | `FK → users(id) ON DELETE CASCADE` | Usuario propietario de la categoría |

---

### Tabla `tasks`
Almacena las tareas del sistema con sus metadatos.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Identificador único autoincremental |
| `title` | `VARCHAR(255)` | `NOT NULL` | Título de la tarea |
| `description` | `TEXT` | — | Descripción detallada |
| `status` | `task_status` | `DEFAULT 'pending'` | Estado: `pending`, `in_progress`, `completed` |
| `priority` | `task_priority` | `DEFAULT 'medium'` | Prioridad: `low`, `medium`, `high` |
| `due_date` | `DATE` | — | Fecha límite de la tarea |
| `user_id` | `INTEGER` | `FK → users(id) ON DELETE CASCADE` | Usuario asignado a la tarea |
| `category_id` | `INTEGER` | `FK → categories(id) ON DELETE SET NULL` | Categoría de la tarea (opcional) |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` | Fecha de creación |
| `updated_at` | `TIMESTAMP` | `DEFAULT NOW()` | Fecha de última modificación (auto-update via trigger) |

> **Trigger:** `update_tasks_updated_at` — Se ejecuta automáticamente en cada `UPDATE` sobre la tabla `tasks` para mantener `updated_at` al día.

---

### Tabla `refresh_tokens`
Gestiona los tokens de refresco activos, permitiendo la rotación y revocación de sesiones.

| Columna | Tipo | Restricciones | Descripción |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Identificador único autoincremental |
| `user_id` | `INTEGER` | `NOT NULL FK → users(id) ON DELETE CASCADE` | Usuario propietario del token |
| `token` | `TEXT` | `NOT NULL` | Valor del refresh token (JWT) |
| `expires_at` | `TIMESTAMP` | `NOT NULL` | Fecha y hora de expiración |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` | Fecha de creación |

> **Índice:** `idx_refresh_tokens_token` — Optimiza las búsquedas por token para mejorar el rendimiento de la validación de sesiones.

---

## 🔌 Endpoints Creados

**URL Base del Backend:** `http://localhost:4000`  
**Formato de datos:** JSON  
**Autenticación:** Bearer Token (JWT en header `Authorization` o cookie `accessToken`)

---

### 🔑 Autenticación — `/api/auth`

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ Público | Registrar un nuevo usuario |
| `POST` | `/api/auth/login` | ❌ Público | Iniciar sesión, retorna tokens |
| `POST` | `/api/auth/refresh` | ❌ Público | Renovar el access token usando el refresh token |
| `POST` | `/api/auth/logout` | ❌ Público | Cerrar sesión y revocar refresh token |
| `GET` | `/api/auth/me` | ✅ Privado | Obtener datos del usuario autenticado |

---

### ✅ Tareas — `/api/tasks`
> Todas las rutas requieren autenticación.

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/tasks` | Obtener todas las tareas (soporta filtros: `status`, `priority`, `user_id`) |
| `GET` | `/api/tasks/stats` | Obtener estadísticas de tareas por estado |
| `GET` | `/api/tasks/:id` | Obtener una tarea específica por su ID |
| `POST` | `/api/tasks` | Crear una nueva tarea |
| `PUT` | `/api/tasks/:id` | Actualizar una tarea existente |
| `DELETE` | `/api/tasks/:id` | Eliminar una tarea |

**Ejemplo — Crear tarea (`POST /api/tasks`):**
```json
{
  "title": "Implementar autenticación",
  "description": "Configurar JWT con refresh token",
  "user_id": 1,
  "priority": "high",
  "due_date": "2026-07-01",
  "category_id": 2
}
```

---

### 🗂️ Categorías — `/api/categories`
> Todas las rutas requieren autenticación.

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/categories` | Obtener todas las categorías del usuario |
| `GET` | `/api/categories/:id` | Obtener una categoría por su ID |
| `POST` | `/api/categories` | Crear una nueva categoría |
| `PUT` | `/api/categories/:id` | Actualizar una categoría |
| `DELETE` | `/api/categories/:id` | Eliminar una categoría |

---

### 👥 Usuarios — `/api/users`
> Todas las rutas requieren autenticación. Las marcadas como `Admin` requieren rol `admin`.

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/users` | 🔒 Admin | Obtener todos los usuarios del sistema |
| `GET` | `/api/users/:id/sessions` | 🔒 Admin | Ver sesiones activas de un usuario |
| `DELETE` | `/api/users/sessions/:sessionId` | 🔒 Admin | Revocar una sesión específica |
| `PUT` | `/api/users/:id` | ✅ Privado | Actualizar datos de un usuario |

---

### 🩺 Health Check

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/health` | Verificar que la API está en funcionamiento |

---

## 🚀 Instrucciones para Ejecutar el Proyecto

### Prerrequisitos

Asegúrate de tener instalado:
- **Node.js** v18 o superior → [nodejs.org](https://nodejs.org)
- **PostgreSQL** v14 o superior → [postgresql.org](https://www.postgresql.org)
- **npm** (incluido con Node.js)

---

### Paso 1 — Clonar el Repositorio

```bash
git clone https://github.com/wilson1711/TaskProyecto.git
cd TaskProyecto
```

---

### Paso 2 — Configurar la Base de Datos

1. Abre **pgAdmin** o la terminal de PostgreSQL.
2. Crea la base de datos:
```sql
CREATE DATABASE taskflow_db;
```
3. Ejecuta el script de esquema:
```bash
psql -U postgres -d taskflow_db -f backend/database.sql
```
> Si usas pgAdmin, abre el archivo `backend/database.sql` y ejecútalo con la herramienta *Query Tool*.

---

### Paso 3 — Configurar Variables de Entorno del Backend

El archivo `backend/.env` ya contiene una configuración de ejemplo. Revisa y ajusta según tu entorno:

```env
# Servidor
PORT=4000
HOST=0.0.0.0
NODE_ENV=development

# Base de Datos PostgreSQL
DB_USER=postgres
DB_PASSWORD=TU_CONTRASEÑA_AQUI
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskflow_db

# JWT — Genera tus propias claves con:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_ACCESS_SECRET=tu_clave_secreta_de_acceso
JWT_ACCESS_EXPIRES=5m
JWT_REFRESH_SECRET=tu_clave_secreta_de_refresco
JWT_REFRESH_EXPIRES=1h

# CORS — URLs del frontend permitidas (separar con comas)
FRONTEND_URL=http://localhost:5173
```

---

### Paso 4 — Configurar Variables de Entorno del Frontend

Copia el template y crea tu archivo de entorno:

```bash
copy frontend\.env.template frontend\.env
```

Por defecto el frontend detecta la URL del backend automáticamente. Si necesitas configurarla manualmente, edita `frontend/.env`:

```env
VITE_API_URL=http://localhost:4000
```

---

### Paso 5 — Instalar Dependencias

Instala todas las dependencias del proyecto (raíz, backend y frontend) con un solo comando:

```bash
npm run install-all
```

---

### Paso 6 — Ejecutar el Proyecto

Levanta el **backend** (puerto 4000) y el **frontend** (puerto 5173) simultáneamente:

```bash
npm run dev
```

Este comando usa `concurrently` para gestionar ambos procesos en una sola terminal:
- 🟡 `[BACKEND]` → `http://localhost:4000`
- 🔵 `[FRONTEND]` → `http://localhost:5173`

---

### Comandos Individuales (Opcional)

Si necesitas ejecutar cada servicio por separado:

```bash
# Solo el backend
cd backend
npm run dev

# Solo el frontend (en otra terminal)
cd frontend
npm run dev
```

---

### Verificar que el Sistema Funciona

Una vez levantado el proyecto, puedes verificar la API con:

```bash
curl http://localhost:4000/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "message": "TaskFlow API está funcionando",
  "timestamp": "2026-06-23T..."
}
```

Luego abre el navegador en: **[http://localhost:5173](http://localhost:5173)**

---

## 🗂️ Estructura del Proyecto

```
TaskProyecto/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Lógica de negocio (auth, tasks, categories, users)
│   │   ├── routes/           # Definición de rutas de la API
│   │   ├── middleware/       # authMiddleware, roleMiddleware
│   │   ├── config/           # Configuración de la base de datos
│   │   ├── app.js            # Configuración de Express y CORS
│   │   └── server.js         # Punto de entrada del servidor
│   ├── database.sql          # Script de creación del esquema de BD
│   ├── .env                  # Variables de entorno del backend
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes reutilizables de React
│   │   ├── pages/            # Páginas: HomePage, AdminDashboard, ProfilePage
│   │   ├── hooks/            # Custom hooks (useTasks, useAuth, etc.)
│   │   ├── context/          # AuthContext para estado global
│   │   └── App.jsx           # Rutas y navegación principal
│   ├── index.html
│   └── package.json
├── package.json              # Scripts raíz (dev, install-all)
└── README.md
```

---

## 🛠️ Tecnologías Utilizadas

| Capa | Tecnología | Versión |
|---|---|---|
| **Runtime** | Node.js | ≥ 18 |
| **Framework Backend** | Express | ^5.2.1 |
| **Base de Datos** | PostgreSQL | ≥ 14 |
| **ORM / Driver** | pg (node-postgres) | ^8.20.0 |
| **Autenticación** | jsonwebtoken | ^9.0.3 |
| **Encriptación** | bcryptjs | ^3.0.3 |
| **Framework Frontend** | React + Vite | Latest |
| **Estilos** | TailwindCSS | Latest |
| **Gestor de procesos** | concurrently | ^8.2.2 |
| **Hot Reload (dev)** | nodemon | ^3.1.14 |
