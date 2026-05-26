import React from 'react';

/**
 * Etiqueta pequeña (badge) para mostrar estados o prioridades con colores dinámicos.
 */
const Badge = ({ children, className = '' }) => {
  return (
    <span className={`cyber-badge ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
