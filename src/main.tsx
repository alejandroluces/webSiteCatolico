import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Verificar que el elemento root existe
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Eliminar el contenido de fallback
while (rootElement.firstChild) {
  rootElement.removeChild(rootElement.firstChild);
}

// Crear y renderizar la aplicación
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);