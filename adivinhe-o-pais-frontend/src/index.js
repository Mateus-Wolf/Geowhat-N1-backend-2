import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AchievementProvider } from './context/AchievementContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AchievementProvider>
        <App />
      </AchievementProvider>
    </ThemeProvider>
  </React.StrictMode>
);