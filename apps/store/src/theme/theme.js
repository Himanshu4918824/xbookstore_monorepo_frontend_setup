// We import a tool from Material-UI that helps us create a theme.
import { createTheme } from '@mui/material/styles';

// This is our "Ice & Ink" color palette, defined in a way Material-UI understands.
const theme = createTheme({
  palette: {
    // --- PRIMARY COLORS ---
    // These are the main action colors for buttons, links, etc.
    primary: {
      main: '#406E86', // Slate Blue (for Light Mode)
      light: '#94B3CA',// Cornflower Blue (for Dark Mode accents)
    },

    // --- BACKGROUND COLORS ---
    background: {
      default: '#462C1D', // Silver Frost (Light Mode background)
      paper: '#462C1D',   // Deep Ocean Blue (Dark Mode background)
    },
    
    // --- TEXT COLORS ---
    text: {
      primary: '#162735',   // Deep Ocean Blue (Light Mode text)
      secondary: '#406E86', // Slate Blue (subtler text in Light Mode)
    },
  },

  // We can also define our default fonts here later.
  typography: {
    fontFamily: [
      // We can add a custom font like 'Inter' later. For now, it uses a default.
      'sans-serif',
    ].join(','),
  },
});

export default theme;