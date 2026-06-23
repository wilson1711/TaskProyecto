import { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useCategories } from '../../hooks/useCategories';

const TaskForm = ({ onSubmit, loading }) => {
  const { categories } = useCategories(true);

  const initialState = {
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    due_date: '',
    category_id: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validación básica en frontend
    if (!formData.title.trim()) {
      setFormError('El título es obligatorio.');
      return;
    }

    const success = await onSubmit(formData);

    if (success) {
      setFormData(initialState);
    }
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Título"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Nombre de la tarea"
        required
      />
      <Input
        label="Descripción"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Detalles adicionales..."
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

      {formError && (
        <p className="text-xs text-[var(--accent-secondary)] font-bold uppercase">{formError}</p>
      )}

      <Button 
        type="submit" 
        variant="primary" 
        disabled={loading} 
        className="w-full mt-4"
      >
        {loading ? 'Procesando...' : 'Crear Tarea'}
      </Button>
    </form>
  );
};

export default TaskForm;
