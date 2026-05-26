import React from 'react';
import Button from '../ui/Button';

/**
 * Modal de confirmación con estética ciberpunk.
 * Se utiliza para acciones destructivas como eliminar tareas.
 */
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
      {/* Contenedor del Modal con borde neón fuchsia para advertencia */}
      <div className="cyber-card w-full max-w-md border-fuchsia-500 shadow-cyber-fuchsia animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-8 bg-fuchsia-600 shadow-glow-fuchsia"></div>
          <h2 className="text-xl font-black text-fuchsia-500 uppercase tracking-widest italic">
            Confirmar Acción
          </h2>
        </div>
        
        <div className="mb-8">
          <h3 className="text-slate-200 font-bold mb-2">{title}</h3>
          <p className="text-slate-400 text-sm font-mono">
            {message || '¿Estás seguro de que deseas proceder? Esta acción no se puede deshacer.'}
          </p>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={onCancel}
            variant="secondary"
            className="flex-1"
            disabled={loading}
          >
            Abortar
          </Button>
          <Button 
            onClick={onConfirm}
            variant="fuchsia"
            className="flex-1 shadow-glow-fuchsia"
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Confirmar'}
          </Button>
        </div>
        
        {/* Decoración ciberpunk en las esquinas */}
        <div className="absolute top-0 right-0 p-2 opacity-20">
          <span className="text-[10px] font-mono text-fuchsia-500 uppercase">SYS_ERR_REQ</span>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
