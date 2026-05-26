import React from 'react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { translateStatus, translatePriority, getStatusStyles, getPriorityStyles, formatDate } from '../../utils/formatters';

const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-950/40 border border-slate-800 hover:border-cyan-400/40 p-4 rounded-lg transition-all group flex flex-col h-full">
      <div className="flex justify-between items-start mb-2 h-14">
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-2 overflow-hidden">
          {task.title}
        </h3>
        <span className="text-[10px] font-mono text-slate-600 shrink-0 ml-2">ID: #{task.id}</span>
      </div>
      
      <p className="text-sm text-slate-400 mb-4 line-clamp-3 overflow-hidden flex-grow">
        {task.description || 'Sin descripción'}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge className={getStatusStyles(task.status)}>
          {translateStatus(task.status)}
        </Badge>
        <Badge className={getPriorityStyles(task.priority)}>
          {translatePriority(task.priority)}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-y-2 text-[11px] font-mono text-slate-500 uppercase tracking-tighter mb-4">
        <div>
          <span className="block text-slate-700">Usuario</span>
          <span className="text-slate-300">USR_{task.user_id?.toString().padStart(3, '0')}</span>
        </div>
        <div>
          <span className="block text-slate-700">Vencimiento</span>
          <span className="text-slate-300">{formatDate(task.due_date)}</span>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-slate-900">
        <button 
          onClick={() => onEdit(task)}
          className="text-[10px] font-bold text-cyan-500 hover:text-cyan-400 uppercase tracking-widest px-2 py-1"
        >
          Editar
        </button>
        <button 
          onClick={() => onDelete(task.id)}
          className="text-[10px] font-bold text-fuchsia-600 hover:text-fuchsia-500 uppercase tracking-widest px-2 py-1"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
