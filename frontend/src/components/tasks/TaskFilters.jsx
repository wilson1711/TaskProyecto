import Select from '../ui/Select';
import Input from '../ui/Input';
import { useCategories } from '../../hooks/useCategories';

const TaskFilters = ({ filters, onFilterChange }) => {
  const { categories } = useCategories(true);

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

  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    { value: 'null', label: 'Sin categoría' },
    ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
      <Select
        label="Filtrar por Categoría"
        name="category_id"
        value={filters.category_id}
        onChange={handleChange}
        options={categoryOptions}
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
