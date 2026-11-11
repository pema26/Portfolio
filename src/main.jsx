// ============================================================================
//  src/main.jsx  —  the entry point: where React starts
// ============================================================================
//
//  index.html loads this file. It finds <div id="root"> and tells React to
//  render the <App /> component inside it.
//
//  <BrowserRouter> (from React Router) is wrapped around the app so that any
//  component can read the current URL and link between pages without a full
//  page reload. The routes themselves are listed in src/App.jsx.
// ============================================================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';

import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
