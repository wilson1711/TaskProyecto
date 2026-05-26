import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-mono text-cyan-400 animate-pulse uppercase tracking-[0.2em]">
        Cargando datos...
      </span>
    </div>
  );
};

export default Loading;
