# Documentación de la API de TaskFlow

Esta documentación detalla todos los endpoints disponibles en la API de TaskFlow, sus parámetros y ejemplos de uso.

## Información General
- **URL Base:** `http://localhost:3000` (por defecto)
- **Formato de datos:** JSON
- **Headers requeridos:** `Content-Type: application/json`

---

## Endpoints de Tareas (`/api/tasks`)

### 1. Obtener todas las tareas
Obtiene una lista de todas las tareas, permitiendo filtrar por estado, prioridad o usuario.

- **URL:** `/api/tasks`
- **Método:** `GET`
- **Parámetros de consulta (Query Params):**
    - `status` (opcional): Filtra por estado (`pending`, `in_progress`, `completed`).
    - `priority` (opcional): Filtra por prioridad (`low`, `medium`, `high`).
    - `user_id` (opcional): Filtra por el ID del usuario asignado.

**Ejemplo de Petición:**
`GET /api/tasks?status=pending&priority=high`

**Respuesta Exitosa (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "title": "Configurar servidor",
      "description": "Configurar el entorno de producción",
      "status": "pending",
      "priority": "high",
      "due_date": "2026-06-01T00:00:00.000Z",
      "created_at": "2026-05-19T10:00:00.000Z",
      "updated_at": "2026-05-19T10:00:00.000Z",
      "user_name": "Juan Pérez",
      "user_email": "juan@example.com",
      "user_avatar": "https://example.com/avatar.png"
    }
  ]
}
```

---

### 2. Obtener estadísticas
Obtiene un resumen del conteo de tareas por su estado.

- **URL:** `/api/tasks/stats`
- **Método:** `GET`

**Respuesta Exitosa (200 OK):**
```json
{
  "success": true,
  "data": {
    "pending": 5,
    "in_progress": 2,
    "completed": 10,
    "total": 17
  }
}
```

---

### 3. Obtener una tarea por ID
Obtiene los detalles de una tarea específica.

- **URL:** `/api/tasks/:id`
- **Método:** `GET`

**Respuesta Exitosa (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Configurar servidor",
    "description": "...",
    "status": "pending",
    "priority": "high",
    "user_name": "Juan Pérez",
    "user_avatar": "..."
  }
}
```

**Posibles Errores:**
- `404 Not Found`: Si la tarea con el ID especificado no existe.

---

### 4. Crear una tarea
Crea una nueva tarea en el sistema.

- **URL:** `/api/tasks`
- **Método:** `POST`
- **Cuerpo de la Petición (JSON):**
    - `title` (requerido): Título de la tarea.
    - `user_id` (requerido): ID del usuario que crea/asigna la tarea.
    - `description` (opcional): Descripción detallada.
    - `status` (opcional): Estado inicial (por defecto: `pending`).
    - `priority` (opcional): Prioridad (por defecto: `medium`).
    - `due_date` (opcional): Fecha de vencimiento.

**Ejemplo de Cuerpo:**
```json
{
  "title": "Nueva Tarea",
  "description": "Descripción de la tarea",
  "user_id": 1,
  "priority": "high"
}
```

**Respuesta Exitosa (201 Created):**
```json
{
  "success": true,
  "message": "Tarea creada exitosamente",
  "data": {
    "id": 18,
    "title": "Nueva Tarea",
    "description": "Descripción de la tarea",
    "status": "pending",
    "priority": "high",
    "user_id": 1,
    "due_date": null,
    "created_at": "2026-05-19T12:00:00.000Z",
    "updated_at": "2026-05-19T12:00:00.000Z"
  }
}
```

**Posibles Errores:**
- `400 Bad Request`: Si falta el `title` o el `user_id`.

---

### 5. Actualizar una tarea
Actualiza parcialmente una tarea existente.

- **URL:** `/api/tasks/:id`
- **Método:** `PUT`
- **Cuerpo de la Petición (JSON):** Todos los campos son opcionales.
    - `title`, `description`, `status`, `priority`, `due_date`.

**Respuesta Exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Tarea actualizada exitosamente",
  "data": { ... tarea actualizada ... }
}
```

**Posibles Errores:**
- `400 Bad Request`: Si el `title` enviado está vacío.
- `404 Not Found`: Si la tarea no existe.

---

### 6. Eliminar una tarea
Elimina una tarea del sistema.

- **URL:** `/api/tasks/:id`
- **Método:** `DELETE`

**Respuesta Exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Tarea \"Título de la tarea\" eliminada exitosamente"
}
```

---

## Otros Endpoints

### Health Check
Verifica si la API está funcionando correctamente.

- **URL:** `/health`
- **Método:** `GET`

**Respuesta Exitosa (200 OK):**
```json
{
  "status": "ok",
  "message": "TaskFlow API está funcionando",
  "timestamp": "2026-05-19T12:00:00.000Z"
}
```
