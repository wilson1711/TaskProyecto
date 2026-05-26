import React from 'react';

/**
 * Selector desplegable reutilizable con estilos ciberpunk.
 */
const Select = ({ label, name, value, onChange, options = [], className = '' }) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="cyber-input appearance-none cursor-pointer"
        style={{ backgroundImage: 'linear-gradient(45deg, transparent 50%, #00f2ff 50%), linear-gradient(135deg, #00f2ff 50%, transparent 50%)', backgroundPosition: 'calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px)', backgroundSize: '5px 5px, 5px 5px', backgroundRepeat: 'no-repeat' }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
