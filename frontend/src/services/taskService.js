import axiosClient from '../api/axiosClient';

/**
 * Servicio encargado de gestionar las peticiones relacionadas con las tareas.
 * Centralizamos las llamadas a la API aquí para que los componentes no dependan directamente de Axios.
 */
const taskService = {
  /**
   * Comprueba el estado de la conexión con el backend.
   * @returns {Promise} Resultado de la petición GET /health
   */
  getHealth: async () => {
    const response = await axiosClient.get('/health');
    return response.data;
  },

  /**
   * Obtiene la lista de tareas filtrada.
   * @param {Object} filters Objeto con status, priority o user_id
   * @returns {Promise} Lista de tareas
   */
  getTasks: async (filters = {}) => {
    const response = await axiosClient.get('/api/tasks', { params: filters });
    // La API devuelve { success: true, count: X, data: [...] }
    return response.data.data || [];
  },

  /**
   * Obtiene estadísticas generales de las tareas.
   * @returns {Promise} Objeto con estadísticas
   */
  getTaskStats: async () => {
    const response = await axiosClient.get('/api/tasks/stats');
    // La API devuelve { success: true, data: { ...Stats } }
    return response.data.data || null;
  },

  /**
   * Busca una tarea específica por su ID.
   * @param {number|string} id ID de la tarea
   * @returns {Promise} Datos de la tarea
   */
  getTaskById: async (id) => {
    const response = await axiosClient.get(`/api/tasks/${id}`);
    // La API devuelve { success: true, data: { ...Task } }
    return response.data.data;
  },

  /**
   * Crea una nueva tarea en el sistema.
   * @param {Object} taskData Datos de la tarea (title, user_id, etc.)
   * @returns {Promise} Tarea creada
   */
  createTask: async (taskData) => {
    const response = await axiosClient.post('/api/tasks', taskData);
    // La API devuelve { success: true, message: '...', data: { ...Task } }
    return response.data.data;
  },

  /**
   * Actualiza una tarea existente.
   * @param {number|string} id ID de la tarea a editar
   * @param {Object} taskData Nuevos datos de la tarea
   * @returns {Promise} Tarea actualizada
   */
  updateTask: async (id, taskData) => {
    const response = await axiosClient.put(`/api/tasks/${id}`, taskData);
    // La API devuelve { success: true, message: '...', data: { ...Task } }
    return response.data.data;
  },

  /**
   * Elimina una tarea del sistema.
   * @param {number|string} id ID de la tarea a borrar
   * @returns {Promise} Resultado de la operación
   */
  deleteTask: async (id) => {
    const response = await axiosClient.delete(`/api/tasks/${id}`);
    return response.data;
  }
};

export default taskService;
