import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-md flex items-start gap-3 my-4">
      <div className="text-red-500 mt-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <div>
        <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Error de Sistema</p>
        <p className="text-sm text-red-200">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
