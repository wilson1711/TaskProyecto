import React from 'react';
import HomePage from './pages/HomePage';

/**
 * Componente raíz de la aplicación.
 * En una aplicación más grande, aquí configuraríamos el Router o Context Providers.
 * Para este ejemplo, renderizamos directamente la página principal.
 */
function App() {
  return (
    <div className="App">
      <HomePage />
    </div>
  );
}

export default App;
