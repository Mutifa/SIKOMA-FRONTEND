import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

const rootEl = document.getElementById('root')
const root = createRoot(rootEl)


root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)


