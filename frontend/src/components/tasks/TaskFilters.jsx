import React from 'react';
import Select from '../ui/Select';
import Input from '../ui/Input';

const TaskFilters = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    onFilterChange(e.target.name, e.target.value);
  };

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En progreso' },
    { value: 'completed', label: 'Completada' },
  ];

  const priorityOptions = [
    { value: '', label: 'Todas las prioridades' },
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Select
        label="Filtrar por Estado"
        name="status"
        value={filters.status}
        onChange={handleChange}
        options={statusOptions}
      />
      <Select
        label="Filtrar por Prioridad"
        name="priority"
        value={filters.priority}
        onChange={handleChange}
        options={priorityOptions}
      />
      <Input
        label="ID de Usuario"
        name="user_id"
        value={filters.user_id}
        onChange={handleChange}
        placeholder="Ej: 1"
        type="number"
      />
    </div>
  );
};

export default TaskFilters;
