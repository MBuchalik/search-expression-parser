// Import this css first so that Tailwind's definitions don't override ones we define in our components.
// eslint-disable-next-line import/order
import './theme/index.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
