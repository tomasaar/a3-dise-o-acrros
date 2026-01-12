import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Ensure the body has a data-theme from the very start so CSS variables are consistent
const initialTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', initialTheme);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

serviceWorkerRegistration.register();
