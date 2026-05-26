# TaskFlow System 🚀

**TaskFlow System** es una aplicación de gestión de tareas real, diseñada con una estética **minimalista ciberpunk**, desarrollada como ejemplo educativo para estudiantes universitarios.

Este proyecto demuestra la integración de un frontend moderno en React con un backend en Node.js/PostgreSQL, utilizando las mejores prácticas de arquitectura y diseño.

---

## 🛠️ Tecnologías Utilizadas

- **React**: Biblioteca para la interfaz de usuario.
- **Vite**: Herramienta de construcción (build tool) ultra rápida para el desarrollo.
- **Tailwind CSS**: Framework de CSS para diseño rápido con utilidades.
- **Axios**: Cliente HTTP para consumir la TaskFlow API.
- **JavaScript**: Lenguaje base del proyecto (sin TypeScript para simplificar el aprendizaje inicial).

---

## 📂 Estructura del Proyecto (Frontend)

La arquitectura sigue un patrón modular para facilitar el mantenimiento y la escalabilidad:

### `src/api/`
- **`axiosClient.js`**: Configuración central de Axios. Aquí se define la `baseURL`, los tiempos de espera (timeout) y los **interceptores**. Los interceptores capturan errores de red o del servidor (404, 500, etc.) antes de que lleguen al componente, permitiendo un manejo de errores unificado.

### `src/services/`
- **`taskService.js`**: Capa de abstracción de datos. Contiene funciones asíncronas (`getTasks`, `createTask`, etc.) que llaman al `axiosClient`. **Regla de oro:** Los componentes nunca llaman a Axios directamente; siempre usan un servicio.

### `src/hooks/`
- **`useTasks.js`**: Hook personalizado que centraliza la lógica de estado. Gestiona las tareas, estadísticas, estados de carga (`loading`) y errores. Permite que la UI sea "tonta" y solo se encargue de mostrar datos.

### `src/components/`
Organizado por responsabilidad:
- **`layout/`**: Componentes de estructura global como el `Header` y `SectionCard` (contenedores con bordes neón).
- **`common/`**: Componentes de utilidad general como mensajes de error, carga (`Loading`) y el `ConfirmModal`.
- **`tasks/`**: Componentes específicos del dominio de tareas (`TaskList`, `TaskCard`, `TaskForm`, `TaskSearchById`).
- **`status/`**: Componentes para mostrar el estado del sistema (`ApiStatus`).
- **`ui/`**: Componentes básicos y reutilizables (Atómic Design) como `Button`, `Input`, `Select` y `Badge`.

### `src/pages/`
- **`HomePage.jsx`**: La vista principal que orquesta todos los componentes. Aquí se inicializa el hook `useTasks` y se distribuyen los datos.

### `src/utils/`
- **`formatters.js`**: Funciones de ayuda para traducir estados (pending -> Pendiente), formatear fechas y asignar colores dinámicos de Tailwind según la prioridad.

---

## 🎨 Estética Ciberpunk

La aplicación utiliza un tema oscuro con acentos de neón (Cyan y Fuchsia). En el archivo `index.css` se definen clases reutilizables:

- `.cyber-card`: Contenedores con fondo oscuro y bordes semitransparentes.
- `.cyber-input`: Inputs oscuros con focos de luz neón.
- `.cyber-button`: Botones con efectos de "glow" (brillo) al pasar el cursor.

---

## ⚙️ Configuración y Ejecución

1. **Variables de Entorno**: Crea un archivo `.env` en la raíz de la carpeta `frontend/`:
   ```env
   VITE_API_URL=http://localhost:3001
   ```
   *Nota: En Vite, solo las variables que empiezan con `VITE_` son expuestas al código del cliente.*

2. **Instalación**:
   ```bash
   npm install
   ```

3. **Desarrollo**:
   ```bash
   npm run dev
   ```

4. **Construcción (Producción)**:
   ```bash
   npm run build
   ```

---

## 📚 Notas Educativas

- **Async/Await**: Se utiliza en todos los servicios y hooks para manejar la asincronía de forma legible.
- **Formularios Controlados**: Se usa el estado de React para manejar cada input del usuario.
- **Validaciones**: Se implementan validaciones tanto en frontend (evitar campos vacíos) como en backend (integridad de datos).
