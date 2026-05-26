import React, { useState, useEffect } from 'react';
import taskService from '../../services/taskService';

const ApiStatus = () => {
  const [status, setStatus] = useState('checking'); // checking, online, offline

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await taskService.getHealth();
        setStatus('online');
      } catch (error) {
        setStatus('offline');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Recomprobar cada 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 mb-6">
      <div className={`w-2 h-2 rounded-full animate-pulse ${
        status === 'online' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 
        status === 'offline' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 
        'bg-yellow-400'
      }`}></div>
      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
        API Status: 
        <span className={`ml-2 ${
          status === 'online' ? 'text-emerald-400' : 
          status === 'offline' ? 'text-red-500' : 
          'text-yellow-400'
        }`}>
          {status === 'online' ? 'ONLINE' : status === 'offline' ? 'OFFLINE' : 'CHECKING...'}
        </span>
      </span>
    </div>
  );
};

export default ApiStatus;
