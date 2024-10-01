import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import css from '../index.css?inline';

const init = () => {
  const host = document.createElement('div');
  host.id = 'omnix-host';
  document.body.append(host);

  const shadowHost = host.attachShadow({ mode: 'open' });

  const root = document.createElement('div');
  root.id = 'omnix-root';
  shadowHost.append(root);

  createRoot(root).render(
    <StrictMode>
      <style type="text/css">{css}</style>
      <App />
    </StrictMode>,
  );
};

if (document.readyState === 'complete') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
