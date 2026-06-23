const { pool } = require('../config/db');

// ─────────────────────────────────────────────────────────────
// GET /api/categories — Obtener todas las categorías del usuario
// ─────────────────────────────────────────────────────────────
const getAllCategories = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const result = await pool.query(
      `SELECT id, name, description, user_id FROM categories WHERE user_id = $1 ORDER BY name ASC`,
      [user_id]
    );
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error en getAllCategories:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las categorías' });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/categories/:id — Obtener una categoría por ID
// ─────────────────────────────────────────────────────────────
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    const result = await pool.query(
      `SELECT id, name, description, user_id FROM categories WHERE id = $1 AND user_id = $2`,
      [id, user_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró la categoría o no tienes permiso'
      });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error en getCategoryById:', error);
    res.status(500).json({ success: false, message: 'Error al obtener la categoría' });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/categories — Crear una nueva categoría
// ─────────────────────────────────────────────────────────────
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const user_id = req.user.id;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la categoría es obligatorio'
      });
    }
    
    const result = await pool.query(
      `INSERT INTO categories (name, description, user_id) VALUES ($1, $2, $3) RETURNING *`,
      [name.trim(), description || null, user_id]
    );
    
    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error en createCategory:', error);
    res.status(500).json({ success: false, message: 'Error al crear la categoría' });
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/categories/:id — Actualizar una categoría
// ─────────────────────────────────────────────────────────────
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const user_id = req.user.id;
    
    if (name !== undefined && name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la categoría no puede estar vacío'
      });
    }
    
    // Verificar pertenencia
    const catCheck = await pool.query(
      'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );
    
    if (catCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró la categoría o no tienes permiso'
      });
    }
    
    const result = await pool.query(
      `UPDATE categories SET
        name        = COALESCE($1, name),
        description = COALESCE($2, description)
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [name !== undefined ? name.trim() : null, description !== undefined ? description : null, id, user_id]
    );
    
    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error en updateCategory:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar la categoría' });
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/categories/:id — Eliminar una categoría
// ─────────────────────────────────────────────────────────────
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING id, name',
      [id, user_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró la categoría o no tienes permiso'
      });
    }
    
    res.json({
      success: true,
      message: `Categoría "${result.rows[0].name}" eliminada exitosamente`
    });
  } catch (error) {
    console.error('Error en deleteCategory:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar la categoría' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
