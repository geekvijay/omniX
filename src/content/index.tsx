import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { documentReady } from '../utils/documentReady';
import css from '../index.css?inline';

const root = () => {
  const APP_NAME = 'omnix';

  const host = document.createElement('div');
  host.id = `${APP_NAME}-host`;
  document.body.append(host);

  const shadowHost = host.attachShadow({ mode: 'open' });

  const root = document.createElement('div');
  root.id = `${APP_NAME}-root`;
  shadowHost.append(root);

  return root;
};

documentReady(() => {
  createRoot(root()).render(
    <StrictMode>
      <style type="text/css">{css}</style>
      <App />
    </StrictMode>,
  );
});
