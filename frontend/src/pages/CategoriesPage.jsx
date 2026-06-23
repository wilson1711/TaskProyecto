import { useState, useCallback } from 'react';
import SectionCard from '../components/layout/SectionCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmModal from '../components/common/ConfirmModal';
import { useCategories } from '../hooks/useCategories';

const CategoriesPage = () => {
  const {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory
  } = useCategories(true);

  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setFormError('');
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: ''
    });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('El nombre de la categoría es obligatorio.');
      return;
    }

    let success = false;
    if (editingCategory) {
      success = await updateCategory(editingCategory.id, formData);
    } else {
      success = await createCategory(formData);
    }

    if (success) {
      handleCancelEdit();
    }
  };

  const handleDeleteClick = (id) => {
    setCategoryToDelete(id);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      const success = await deleteCategory(categoryToDelete);
      if (success) {
        setCategoryToDelete(null);
        // Si estábamos editando la categoría que acabamos de borrar, cancelamos la edición
        if (editingCategory && editingCategory.id === categoryToDelete) {
          handleCancelEdit();
        }
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl flex-grow flex flex-col justify-between">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Panel Lateral Izquierdo: Formulario Nueva/Actualizar Categoría */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <SectionCard title={editingCategory ? "Actualizar Categoría" : "Nueva Categoría"}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Trabajo, Personal, etc."
                required
              />
              <Input
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detalles adicionales opcionales..."
              />

              {formError && (
                <p className="text-xs text-[var(--accent-secondary)] font-bold uppercase">{formError}</p>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                {editingCategory && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={handleCancelEdit}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                )}
                <Button 
                  type="submit" 
                  variant={editingCategory ? "fuchsia" : "primary"} 
                  disabled={loading} 
                  className="flex-1"
                >
                  {loading ? 'Procesando...' : (editingCategory ? 'ACTUALIZAR' : 'CREAR CATEGORÍA')}
                </Button>
              </div>
            </form>
          </SectionCard>
        </div>

        {/* Panel Central/Derecho: Tabla Lista de Categorías */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          {error && <ErrorMessage message={error} />}

          <SectionCard title="Lista de Categorías">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase font-mono tracking-widest text-[var(--text-muted)]">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Nombre</th>
                    <th className="py-3 px-4">Descripción</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/50">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                        No se encontraron categorías registradas.
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat) => (
                      <tr 
                        key={cat.id} 
                        className={`hover:bg-slate-900/20 transition-colors ${editingCategory?.id === cat.id ? 'bg-cyber-cyan/5 border-l-2 border-cyber-cyan' : ''}`}
                      >
                        <td className="py-3 px-4 font-mono text-xs text-[var(--text-muted)]">#{cat.id}</td>
                        <td className="py-3 px-4 font-bold text-sm text-[var(--text-primary)]">{cat.name}</td>
                        <td className="py-3 px-4 text-xs text-[var(--text-secondary)] line-clamp-1 truncate max-w-xs">
                          {cat.description || <span className="italic text-[var(--text-muted)]">Sin descripción</span>}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => handleEditClick(cat)}
                              className="text-xs font-bold text-cyber-cyan hover:text-cyber-fuchsia transition-colors uppercase tracking-widest"
                              title="Editar categoría"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteClick(cat.id)}
                              className="text-xs font-bold text-[var(--accent-secondary)] hover:opacity-80 transition-colors uppercase tracking-widest"
                              title="Eliminar categoría"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      </div>

      <ConfirmModal 
        isOpen={!!categoryToDelete}
        title="¿Confirmas la eliminación definitiva de esta categoría?"
        message="Esta acción desasociará todas las tareas vinculadas, las cuales pasarán a estar 'Sin categoría'. No se eliminarán las tareas."
        onConfirm={confirmDelete}
        onCancel={() => setCategoryToDelete(null)}
        loading={loading}
      />

      <footer className="mt-16 text-center text-[var(--text-muted)] text-[10px] font-mono uppercase tracking-[0.3em]">
        © 2026 TaskFlow System // Universidad Tecnológica de Datos
      </footer>
    </div>
  );
};

export default CategoriesPage;
