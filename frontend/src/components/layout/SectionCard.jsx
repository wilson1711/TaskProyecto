import React from 'react';

const SectionCard = ({ title, children, className = '' }) => {
  return (
    <section className={`cyber-card h-full ${className}`}>
      {title && (
        <h2 className="text-sm font-black text-cyan-400 uppercase tracking-widest mb-4 border-l-2 border-fuchsia-500 pl-2">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
};

export default SectionCard;
