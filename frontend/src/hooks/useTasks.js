import { useState, useEffect, useCallback } from 'react';
import taskService from '../services/taskService';

/**
 * Hook personalizado para gestionar el estado de las tareas y las operaciones CRUD.
 * Centraliza la lógica para que los componentes sean más limpios y se centren en la UI.
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    user_id: ''
  });

  /**
   * Carga las tareas aplicando los filtros actuales.
   */
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Limpiamos filtros vacíos antes de enviar
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const data = await taskService.getTasks(activeFilters);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Carga las estadísticas globales.
   */
  const fetchStats = useCallback(async () => {
    try {
      const data = await taskService.getTaskStats();
      setStats(data);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  }, []);

  /**
   * Efecto para cargar datos iniciales y reaccionar a cambios en filtros.
   */
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  /**
   * Busca una tarea por ID.
   */
  const findTaskById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const task = await taskService.getTaskById(id);
      return task;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crea una nueva tarea y recarga la lista.
   */
  const createTask = async (taskData) => {
    setLoading(true);
    try {
      await taskService.createTask(taskData);
      await fetchTasks();
      await fetchStats();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza una tarea y recarga la lista.
   */
  const updateTask = async (id, taskData) => {
    setLoading(true);
    try {
      await taskService.updateTask(id, taskData);
      await fetchTasks();
      await fetchStats();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina una tarea y recarga la lista.
   */
  const deleteTask = async (id) => {
    setLoading(true);
    try {
      await taskService.deleteTask(id);
      await fetchTasks();
      await fetchStats();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza el estado de los filtros.
   */
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return {
    tasks,
    stats,
    loading,
    error,
    filters,
    fetchTasks,
    findTaskById,
    createTask,
    updateTask,
    deleteTask,
    handleFilterChange,
    setError
  };
};
