import React from 'react';

const Header = () => {
  return (
    <header className="mb-8 border-b border-cyan-400/30 pb-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 uppercase tracking-tighter italic">
            TaskFlow API
          </h1>
          <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.2em]">
            Sistema de Gestión de Tareas v1.0 // Ciberpunk Edition
          </p>
        </div>
        <div className="hidden md:block">
          <div className="text-right text-[10px] font-mono text-cyan-400/50 uppercase">
            Sistema operativo: React_Vite_OS
            <br />
            Estado de red: Conectado
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
