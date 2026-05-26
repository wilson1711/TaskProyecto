import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import TaskCard from './TaskCard';

const TaskSearchById = ({ onSearch, onEdit, onDelete, refreshTrigger, onSearchedIdChange }) => {
  const [searchId, setSearchId] = useState('');
  const [foundTask, setFoundTask] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  /**
   * Ejecuta la búsqueda de la tarea en la API.
   */
  const executeSearch = async (id) => {
    if (!id) return;
    setIsSearching(true);
    setSearchError(null);
    try {
      const task = await onSearch(id);
      if (task) {
        setFoundTask(task);
        if (onSearchedIdChange) onSearchedIdChange(task.id);
      } else {
        setFoundTask(null);
        setSearchError('No se encontró ninguna tarea con ese ID.');
      }
    } catch (err) {
      setFoundTask(null);
      setSearchError('Error al buscar la tarea.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    executeSearch(searchId);
  };

  /**
   * Efecto para reaccionar a cambios externos (como una edición exitosa)
   * que requieren refrescar la tarea buscada actualmente.
   */
  useEffect(() => {
    if (refreshTrigger && foundTask) {
      // Extraemos el ID numérico del trigger (que viene como ID_timestamp)
      const idToRefresh = refreshTrigger.toString().split('_')[0];
      if (idToRefresh === foundTask.id.toString()) {
        executeSearch(idToRefresh);
      }
    }
  }, [refreshTrigger]);

  return (
    <div className="mb-8">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-end gap-3 mb-4">
        <Input
          label="Buscar por ID"
          name="searchId"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="ID numérico..."
          type="number"
          className="flex-1"
        />
        <Button type="submit" disabled={isSearching || !searchId} className="w-full sm:w-auto">
          {isSearching ? 'Buscando...' : 'Buscar'}
        </Button>
      </form>

      {searchError && (
        <p className="text-xs text-fuchsia-500 font-bold uppercase mb-4">{searchError}</p>
      )}

      {foundTask && (
        <div className="border-2 border-fuchsia-500/30 rounded-lg p-1 bg-fuchsia-500/5">
          <div className="text-[10px] font-bold text-fuchsia-500 uppercase px-3 py-1">
            Resultado de búsqueda:
          </div>
          <TaskCard 
            task={foundTask} 
            onEdit={onEdit} 
            onDelete={() => {
              onDelete(foundTask.id);
              setFoundTask(null);
            }} 
          />
        </div>
      )}
    </div>
  );
};

export default TaskSearchById;
