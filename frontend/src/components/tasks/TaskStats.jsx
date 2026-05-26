import React from 'react';

const TaskStats = ({ stats }) => {
  if (!stats) return null;

  const statItems = [
    { label: 'Total', value: stats.total ?? 0, color: 'text-cyan-400' },
    { label: 'Pendientes', value: stats.by_status?.pending ?? 0, color: 'text-yellow-500' },
    { label: 'Progreso', value: stats.by_status?.in_progress ?? 0, color: 'text-blue-500' },
    { label: 'Completas', value: stats.by_status?.completed ?? 0, color: 'text-emerald-500' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, index) => (
        <div key={index} className="cyber-card py-4 flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            {item.label}
          </span>
          <span className={`text-2xl font-black ${item.color} font-mono`}>
            {item.value.toString().padStart(2, '0')}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;
