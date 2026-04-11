import React, { createContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,

    ...(mode === 'light'
      ? {
        /* ================= LIGHT MODE ================= */
        primary: {
          main: '#4B2E2B', // Deep Walnut
          contrastText: '#FFFFFF',
        },

        secondary: {
          main: '#C8A951', // Antique Gold
        },

        background: {
          default: '#F5F1E8', // Paper tone
          paper: '#FFFFFF',
        },

        text: {
          primary: '#000000',      // Darker, higher contrast
          secondary: '#3E2A23',    // Stronger readable brown
          disabled: '#7A6A63',
        },
       
        divider: '#D8CFC2',

        action: {
          hover: 'rgba(75, 46, 43, 0.08)',
          selected: 'rgba(75, 46, 43, 0.16)',
        },
      }
      : {
        /* ================= DARK MODE ================= */
        primary: {
          main: '#D4B768', // Warm Gold
          contrastText: '#1C1A18',
        },

        secondary: {
          main: '#4C6A67', // Soft Teal
        },

        background: {
          default: '#1C1A18', // Proper dark library background
          paper: '#2F2A27',
        },

        text: {
          primary: '#F1EDE6',
          secondary: '#C9C1B6',
        },

        divider: '#3A3431',

        action: {
          hover: 'rgba(212, 183, 104, 0.08)',
          selected: 'rgba(212, 183, 104, 0.16)',
        },
      }),
  },

  typography: {
    fontFamily: ['sans-serif'].join(','), // better for library theme
  },

  /* SAFE custom section (not inside palette) */
  custom: {
    scrollbar:
      mode === 'light'
        ? {
          track: '#EAE3D5',
          thumb: '#4B2E2B',
          thumbHover: '#5C3A36',
        }
        : {
          track: '#252220',
          thumb: '#D4B768',
          thumbHover: '#E2C980',
        },
  },
});

export const ThemeContext = createContext({
  toggleColorMode: () => { },
});

export function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState('dark'); // Better default for bookstore

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeContext.Provider value={colorMode}>
      {children(theme)}
    </ThemeContext.Provider>
  );
}