import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Requirement: Login pages initially open in light theme. After login, user preference is saved.
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('sma_theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('sma_theme', theme);
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    // If user is logged in, sync with backend database
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.put('/auth/theme', { theme: newTheme });
      } catch (err) {
        // Silently ignore network sync errors for theme
      }
    }
  };

  const setExplicitTheme = (newTheme) => {
    if (['light', 'dark'].includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setExplicitTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
