// Importamos el pool de conexiones a la base de datos
const { pool } = require('../config/db');

// ─────────────────────────────────────────────────────────────
// GET /api/tasks — Obtener TODAS las tareas
// ─────────────────────────────────────────────────────────────
const getAllTasks = async (req, res) => {
  try {
    // Extraemos parámetros de consulta opcionales de la URL
    // Ejemplo: GET /api/tasks?status=pending&priority=high
    const { status, priority, user_id } = req.query;
    
    // Construimos la query dinámicamente según los filtros
    let query  = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.due_date,
        t.user_id,
        t.created_at,
        t.updated_at,
        u.name  AS user_name,
        u.email AS user_email,
        u.avatar AS user_avatar
      FROM tasks t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    // '1=1' es un truco para poder agregar 'AND' condicionalmente
    
    const params = [];  // Array de valores para la query (evita SQL Injection)
    let   idx    = 1;   // Contador de parámetros ($1, $2, etc.)
    
    // Si pasaron ?status=..., lo agregamos como filtro
    if (status) {
      query += ` AND t.status = $${idx}`;
      params.push(status);
      idx++;
    }
    
    // Si pasaron ?priority=..., lo agregamos como filtro
    if (priority) {
      query += ` AND t.priority = $${idx}`;
      params.push(priority);
      idx++;
    }
    
    // Si pasaron ?user_id=..., filtramos por usuario
    if (user_id) {
      query += ` AND t.user_id = $${idx}`;
      params.push(user_id);
      idx++;
    }
    
    // Ordenamos: primero las de alta prioridad, luego por fecha de creación
    query += ` ORDER BY 
      CASE t.priority 
        WHEN 'high'   THEN 1 
        WHEN 'medium' THEN 2 
        WHEN 'low'    THEN 3 
      END,
      t.created_at DESC`;
    
    // Ejecutamos la query en PostgreSQL
    const result = await pool.query(query, params);
    
    // Respondemos con las tareas en formato JSON
    res.json({
      success: true,
      count: result.rows.length,   // Cuántas tareas devuelve
      data:  result.rows            // Array con todas las tareas
    });
    
  } catch (error) {
    // Si algo falla, enviamos error 500
    console.error('Error en getAllTasks:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las tareas' });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/tasks/:id — Obtener UNA tarea por su ID
// ─────────────────────────────────────────────────────────────
const getTaskById = async (req, res) => {
  try {
    // req.params.id es el valor dinámico de la URL (ej: /api/tasks/3 → id=3)
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT t.*, u.name AS user_name, u.avatar AS user_avatar
       FROM tasks t
       LEFT JOIN users u ON t.user_id = u.id
       WHERE t.id = $1`,
      [id]   // $1 se reemplaza con el valor de 'id'
    );
    
    // Si no encontró nada, rows estará vacío
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontró la tarea con ID ${id}`
      });
    }
    
    res.json({ success: true, data: result.rows[0] });
    
  } catch (error) {
    console.error('Error en getTaskById:', error);
    res.status(500).json({ success: false, message: 'Error al obtener la tarea' });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/tasks — Crear una NUEVA tarea
// ─────────────────────────────────────────────────────────────
const createTask = async (req, res) => {
  try {
    // req.body contiene los datos enviados en el body de la petición
    const { title, description, status, priority, due_date, user_id } = req.body;
    
    // Validaciones básicas (verificamos que los campos requeridos estén presentes)
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El título de la tarea es obligatorio'
      });
    }
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'Se debe especificar un usuario (user_id)'
      });
    }
    
    // INSERT: insertamos la nueva tarea
    // RETURNING * → PostgreSQL nos devuelve el registro recién creado
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, due_date, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        title.trim(),
        description || null,               // Si no hay descripción, guardamos NULL
        status   || 'pending',             // Default: 'pending'
        priority || 'medium',              // Default: 'medium'
        due_date || null,
        user_id
      ]
    );
    
    // Respondemos con el código 201 (Created) y la tarea creada
    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error en createTask:', error);
    res.status(500).json({ success: false, message: 'Error al crear la tarea' });
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/tasks/:id — Actualizar una tarea existente
// ─────────────────────────────────────────────────────────────
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, due_date, user_id } = req.body;
    
    // Validamos que el título no sea una cadena vacía si se envía
    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El título de la tarea no puede estar vacío'
      });
    }
    
    // Verificamos que la tarea existe antes de actualizar
    const taskExists = await pool.query('SELECT id FROM tasks WHERE id = $1', [id]);
    if (taskExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontró la tarea con ID ${id}`
      });
    }
    
    // Actualizamos solo los campos enviados (COALESCE mantiene el valor actual
    // si el nuevo valor es NULL — así podemos hacer actualizaciones parciales)
    const result = await pool.query(
      `UPDATE tasks SET
        title       = COALESCE($1, title),
        description = COALESCE($2, description),
        status      = COALESCE($3, status),
        priority    = COALESCE($4, priority),
        due_date    = COALESCE($5, due_date),
        user_id     = COALESCE($6, user_id),
        updated_at  = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [title, description, status, priority, due_date, user_id, id]
    );
    
    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error en updateTask:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar la tarea' });
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/tasks/:id — Eliminar una tarea
// ─────────────────────────────────────────────────────────────
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    // DELETE y RETURNING para confirmar qué se eliminó
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING id, title',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontró la tarea con ID ${id}`
      });
    }
    
    res.json({
      success: true,
      message: `Tarea "${result.rows[0].title}" eliminada exitosamente`
    });
    
  } catch (error) {
    console.error('Error en deleteTask:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar la tarea' });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/tasks/stats — Estadísticas generales
// ─────────────────────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    // Consulta que agrupa y cuenta por status
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'pending')     AS pending,
        COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress,
        COUNT(*) FILTER (WHERE status = 'completed')   AS completed,
        COUNT(*)                                        AS total
      FROM tasks
    `);
    
    res.json({ success: true, data: result.rows[0] });
    
  } catch (error) {
    console.error('Error en getStats:', error);
    res.status(500).json({ success: false, message: 'Error al obtener estadísticas' });
  }
};

// Exportamos todas las funciones para usarlas en las rutas
module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask, getStats };