import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/jetbrains-mono/400.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/theme.css';
import './styles/layout.css';
import './styles/data.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
