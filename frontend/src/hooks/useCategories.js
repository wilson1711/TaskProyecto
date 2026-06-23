import { useState, useEffect, useCallback } from 'react';
import categoryService from '../services/categoryService';

/**
 * Hook personalizado para gestionar las categorías.
 */
export const useCategories = (autoFetch = false) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || 'Error cargando categorías');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchCategories();
    }
  }, [autoFetch, fetchCategories]);

  const createCategory = useCallback(async (categoryData) => {
    setLoading(true);
    setError(null);
    try {
      await categoryService.createCategory(categoryData);
      await fetchCategories();
      return true;
    } catch (err) {
      setError(err.message || 'Error al crear la categoría');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id, categoryData) => {
    setLoading(true);
    setError(null);
    try {
      await categoryService.updateCategory(id, categoryData);
      await fetchCategories();
      return true;
    } catch (err) {
      setError(err.message || 'Error al actualizar la categoría');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await categoryService.deleteCategory(id);
      await fetchCategories();
      return true;
    } catch (err) {
      setError(err.message || 'Error al eliminar la categoría');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    setError
  };
};
