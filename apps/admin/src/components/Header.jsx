import React, { useRef, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Tooltip, IconButton, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { animate, stagger } from "motion";

// --- CUSTOM COMPONENT ---
import ThemeToggleButton from './ThemeToggleButton.jsx'; // <-- Import our new component

// --- ICONS ---
import Logout from '@mui/icons-material/Logout';

// --- AUTH HOOK ---
import { useAuth } from '../hooks/useAuth';

const Header = ({ isDarkMode, handleThemeToggle }) => {
    const { user, logout } = useAuth();
    const theme = useTheme();
    const headerItemsRef = useRef(null);

    // Staggered entrance animation for the header items
    useEffect(() => {
        const items = headerItemsRef.current.children;
        animate(
            items,
            { y: [-15, 0], opacity: [0, 1] },
            { delay: stagger(0.1), duration: 0.5, ease: "ease-out" }
        );
    }, []);

    const iconButtonSx = {
        transition: 'transform 0.2s ease-in-out',
        ':hover': { transform: 'scale(1.15)' }
    };

    return (
        <AppBar 
            position="fixed" 
            elevation={0}
            sx={{ 
                backgroundColor: 'transparent', 
                zIndex: (theme) => theme.zIndex.drawer - 1 
            }}
        >
            <Toolbar sx={{ justifyContent: 'flex-end', pt: 1, pr: 4 }}>
                 <Box 
                    ref={headerItemsRef}
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        backgroundColor: theme.palette.background.paper, 
                        px: 2, 
                        py: 1, 
                        borderRadius: '0.75rem', 
                        boxShadow: theme.shadows[2]
                    }}
                 >
                    {/* --- THE NEW TOGGLE BUTTON --- */}
                    {/* It is now the first item in our staggered animation */}
                    <ThemeToggleButton isDarkMode={isDarkMode} onClick={handleThemeToggle} />
                    
                    <Typography sx={{ fontWeight: 500, color: 'text.primary' }}>
                        {user?.email.toUpperCase()}
                    </Typography>

                    <Tooltip title="Logout">
                        <IconButton sx={{ ...iconButtonSx, p: 0 }} onClick={logout}>
                            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                                <Logout fontSize="small" />
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                 </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;