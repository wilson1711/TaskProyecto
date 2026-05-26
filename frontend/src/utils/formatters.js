/**
 * Traduce el estado de la tarea del inglés al español.
 */
export const translateStatus = (status) => {
  const statuses = {
    pending: 'Pendiente',
    in_progress: 'En progreso',
    completed: 'Completada',
  };
  return statuses[status] || status;
};

/**
 * Traduce la prioridad de la tarea del inglés al español.
 */
export const translatePriority = (priority) => {
  const priorities = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
  };
  return priorities[priority] || priority;
};

/**
 * Devuelve clases de Tailwind según el estado para usar en el componente Badge.
 */
export const getStatusStyles = (status) => {
  const styles = {
    pending: 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10',
    in_progress: 'border-blue-500/50 text-blue-500 bg-blue-500/10',
    completed: 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10',
  };
  return styles[status] || 'border-slate-500 text-slate-500';
};

/**
 * Devuelve clases de Tailwind según la prioridad.
 */
export const getPriorityStyles = (priority) => {
  const styles = {
    low: 'border-slate-500/50 text-slate-400 bg-slate-500/10',
    medium: 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10',
    high: 'border-fuchsia-500/50 text-fuchsia-500 bg-fuchsia-500/10',
  };
  return styles[priority] || 'border-slate-500 text-slate-500';
};

/**
 * Formatea una fecha a un string legible.
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Sin fecha';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};
