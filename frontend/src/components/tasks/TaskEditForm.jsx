import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useCategories } from '../../hooks/useCategories';

const TaskEditForm = ({ task, onSubmit, onCancel, loading }) => {
  const { categories } = useCategories(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    due_date: '',
    category_id: ''
  });

  useEffect(() => {
    if (task) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        category_id: task.category_id ? task.category_id.toString() : ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task.id, formData);
  };

  const priorityOptions = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En progreso' },
    { value: 'completed', label: 'Completada' },
  ];

  const categoryOptions = [
    { value: '', label: 'Sin categoría' },
    ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
  ];

  return (
    <div className="fixed inset-0 bg-[var(--bg-primary)]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="cyber-card w-full max-w-lg border-[var(--accent-secondary)]/50 shadow-cyber-fuchsia">
        <h2 className="text-xl font-black text-[var(--accent-secondary)] uppercase tracking-widest mb-6 italic">
          Modificar Registro_ID #{task.id}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Título"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <Input
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Vencimiento"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleChange}
            />
            <Select
              label="Categoría"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              options={categoryOptions}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Prioridad"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={priorityOptions}
            />
            <Select
              label="Estado"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="fuchsia" 
              disabled={loading} 
              className="flex-1"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditForm;
