const { pool } = require('./src/config/db');

const schema = `
-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  avatar     VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tipos ENUM para status y prioridad
DO $$ BEGIN
    CREATE TYPE task_status   AS ENUM ('pending', 'in_progress', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de tareas
CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  status      task_status   DEFAULT 'pending',
  priority    task_priority DEFAULT 'medium',
  due_date    DATE,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Función que actualiza updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger que llama a la función en cada UPDATE
DO $$ BEGIN
    CREATE TRIGGER update_tasks_updated_at
      BEFORE UPDATE ON tasks
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Insertar usuarios de prueba
INSERT INTO users (name, email, avatar) VALUES
  ('Ana García',    'ana@taskflow.com',    'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana'),
  ('Carlos López',  'carlos@taskflow.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos'),
  ('María Rodríguez','maria@taskflow.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria')
ON CONFLICT (email) DO NOTHING;

-- Insertar categorías de prueba
INSERT INTO categories (id, name, description, user_id) VALUES
  (1, 'Trabajo', 'Tareas relacionadas con el entorno laboral profesional', 1),
  (2, 'Estudios', 'Asignaturas, cursos y material de aprendizaje', 1),
  (3, 'Personal', 'Proyectos personales y hobbies', 1),
  (4, 'Trabajo', 'Tareas relacionadas con el entorno laboral profesional', 2),
  (5, 'Personal', 'Proyectos personales y hobbies', 2),
  (6, 'Estudios', 'Asignaturas, cursos y material de aprendizaje', 3)
ON CONFLICT (id) DO NOTHING;

-- Ajustar la secuencia de ID de categorías
SELECT setval('categories_id_seq', COALESCE((SELECT MAX(id) FROM categories), 1));

-- Insertar tareas de ejemplo
INSERT INTO tasks (title, description, status, priority, due_date, user_id, category_id) VALUES
  ('Diseñar mockup del dashboard',   'Crear wireframes en Figma para el nuevo dashboard',    'completed',   'high',   '2024-01-15', 1, 1),
  ('Configurar base de datos',       'Instalar PostgreSQL y crear esquema inicial',           'completed',   'high',   '2024-01-16', 1, 1),
  ('Desarrollar API REST',           'Implementar endpoints CRUD con Express.js',             'in_progress', 'high',   '2024-01-20', 2, 4),
  ('Crear componentes React',        'Desarrollar TaskCard, Form y StatsBar',                'in_progress', 'medium', '2024-01-22', 2, 5),
  ('Escribir tests unitarios',       'Tests con Jest para los controladores',                 'pending',     'medium', '2024-01-25', 3, 6),
  ('Deploy en producción',           'Subir el proyecto a Railway o Render',                 'pending',     'low',    '2024-01-30', 3, 6),
  ('Documentar la API',              'Crear documentación con Swagger',                       'pending',     'low',    '2024-02-01', 1, 2),
  ('Optimizar consultas SQL',        'Agregar índices para mejorar rendimiento',              'pending',     'medium', '2024-01-28', 2, 4)
ON CONFLICT DO NOTHING;
`;

async function setup() {
    try {
        await pool.query(schema);
        console.log('Database schema and data initialized successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error setting up database:', err);
        process.exit(1);
    }
}

setup();
