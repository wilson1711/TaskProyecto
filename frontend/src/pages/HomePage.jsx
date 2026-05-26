import React, { useState } from 'react';
import Header from '../components/layout/Header';
import SectionCard from '../components/layout/SectionCard';
import ApiStatus from '../components/status/ApiStatus';
import TaskStats from '../components/tasks/TaskStats';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskSearchById from '../components/tasks/TaskSearchById';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import TaskEditForm from '../components/tasks/TaskEditForm';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmModal from '../components/common/ConfirmModal';
import { useTasks } from '../hooks/useTasks';

const HomePage = () => {
  const {
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
    handleFilterChange
  } = useTasks();

  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [lastSearchedId, setLastSearchedId] = useState(null);

  const handleEditClick = (task) => {
    setEditingTask(task);
  };

  const handleUpdate = async (id, data) => {
    const success = await updateTask(id, data);
    if (success) {
      setEditingTask(null);
      // Si la tarea editada es la que se buscó por ID, activamos una recarga
      // para que TaskSearchById sepa que debe volver a buscarla
      if (lastSearchedId === id) {
        setLastSearchedId(id + '_' + Date.now()); 
      }
    }
  };

  const handleDeleteClick = (id) => {
    setTaskToDelete(id);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      const success = await deleteTask(taskToDelete);
      if (success) {
        setTaskToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setTaskToDelete(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Header />
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Panel Lateral Izquierdo: Estado y Creación */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <SectionCard title="Terminal de Estado">
            <ApiStatus />
            <TaskStats stats={stats} />
          </SectionCard>

          <SectionCard title="Nuevo Registro">
            <TaskForm onSubmit={createTask} loading={loading} />
          </SectionCard>
        </div>

        {/* Panel Central: Filtros, Búsqueda y Lista */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <SectionCard title="Panel de Control">
            <TaskSearchById 
              onSearch={findTaskById} 
              onEdit={handleEditClick} 
              onDelete={handleDeleteClick}
              refreshTrigger={lastSearchedId}
              onSearchedIdChange={setLastSearchedId}
            />
            
            <div className="border-t border-slate-800 pt-6 mt-2">
              <TaskFilters 
                filters={filters} 
                onFilterChange={handleFilterChange} 
              />
            </div>
          </SectionCard>

          {error && <ErrorMessage message={error} />}

          <SectionCard title="Base de Datos de Tareas">
            <TaskList 
              tasks={tasks} 
              loading={loading} 
              onEdit={handleEditClick} 
              onDelete={handleDeleteClick} 
            />
          </SectionCard>
        </div>
      </div>

      {/* Modales */}
      {editingTask && (
        <TaskEditForm 
          task={editingTask}
          onSubmit={handleUpdate}
          onCancel={() => setEditingTask(null)}
          loading={loading}
        />
      )}

      <ConfirmModal 
        isOpen={!!taskToDelete}
        title="¿Confirmas la eliminación definitiva de este registro?"
        message="Esta acción purgará los datos de forma permanente en el sistema."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        loading={loading}
      />

      <footer className="mt-16 text-center text-slate-700 text-[10px] font-mono uppercase tracking-[0.3em]">
        © 2026 TaskFlow System // Universidad Tecnológica de Datos
      </footer>
    </div>
  );
};

export default HomePage;
