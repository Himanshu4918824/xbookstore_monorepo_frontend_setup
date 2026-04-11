import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar, ThemeProvider, createTheme } from '@mui/material';

// Import our isolated components
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

const CLOSED_DRAWER_WIDTH = 75;

// --- THEME DEFINITIONS ---
const lightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#eef2f6',
            paper: '#ffffff', // Explicitly define paper color
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#121212',
            paper: '#1e1e1e', // Explicitly define paper color
        },
    },
});

const AdminLayout = () => {
    // State for the sidebar, as before
    const [open, setOpen] = useState(true);

    // State to manage the theme
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Function to toggle the theme, passed to the Header
    const handleThemeToggle = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Select the theme object based on the current state
    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        // ThemeProvider makes the theme available to all children
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
                <CssBaseline />
                
                {/* Pass the state and the toggle function down to the Header */}
                <Header isDarkMode={isDarkMode} handleThemeToggle={handleThemeToggle} />
                
                <Sidebar open={open} setOpen={setOpen} />

                <Box component="main" sx={{ flexGrow: 1, p: 3, pl: `calc(${CLOSED_DRAWER_WIDTH}px + 1rem)` }}>
                    <Toolbar /> 
                    <Outlet />
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default AdminLayout;