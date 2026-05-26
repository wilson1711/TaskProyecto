import React from 'react';

/**
 * Botón reutilizable con estilos ciberpunk.
 */
const Button = ({ children, variant = 'cyan', type = 'button', disabled, onClick, className = '' }) => {
  const variants = {
    cyan: 'cyber-button',
    primary: 'cyber-button-primary',
    fuchsia: 'cyber-button-fuchsia',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${variants[variant] || variants.cyan} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
