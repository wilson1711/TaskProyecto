import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const TaskForm = ({ onSubmit, loading }) => {
  const initialState = {
    title: '',
    description: '',
    user_id: '',
    priority: 'medium',
    status: 'pending',
    due_date: ''
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
    if (!formData.user_id) {
      setFormError('El ID de usuario es obligatorio.');
      return;
    }

    const success = await onSubmit({
      ...formData,
      user_id: parseInt(formData.user_id)
    });

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
          label="ID Usuario"
          name="user_id"
          type="number"
          value={formData.user_id}
          onChange={handleChange}
          placeholder="Ej: 1"
          required
        />
        <Input
          label="Vencimiento"
          name="due_date"
          type="date"
          value={formData.due_date}
          onChange={handleChange}
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
        <p className="text-xs text-fuchsia-500 font-bold uppercase">{formError}</p>
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
