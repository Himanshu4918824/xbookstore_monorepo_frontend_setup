import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { animate } from 'motion';

// --- Helper Components for Visuals ---

// Creates a single star at a specific position
const Star = ({ top, left, scale = 1 }) => (
    <Box
        sx={{
            position: 'absolute',
            top,
            left,
            width: `${4 * scale}px`,
            height: `${4 * scale}px`,
            backgroundColor: 'white',
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        }}
    />
);

// Renders all the stars for the night mode
const Stars = () => (
    <>
        <Star top="30%" left="20%" scale={1.2} />
        <Star top="60%" left="10%" scale={0.8} />
        <Star top="50%" left="35%" scale={0.9} />
    </>
);

// Renders the clouds for the day mode
const Clouds = () => (
    <Box
        sx={{
            position: 'absolute',
            top: '50%',
            right: '-15px',
            width: '40px',
            height: '25px',
            backgroundColor: 'white',
            borderRadius: '20px',
            '&::before, &::after': {
                content: '""',
                position: 'absolute',
                backgroundColor: 'white',
                borderRadius: '50%',
            },
            '&::before': {
                width: '25px',
                height: '25px',
                top: '-12px',
                right: '5px',
            },
            '&::after': {
                width: '20px',
                height: '20px',
                top: '-8px',
                right: '25px',
            },
        }}
    />
);


// --- THE MAIN TOGGLE BUTTON COMPONENT ---

const ThemeToggleButton = ({ isDarkMode, onClick }) => {
    // Refs to target specific DOM elements for animation
    const containerRef = useRef(null);
    const thumbRef = useRef(null);
    const sunRef = useRef(null);
    const moonRef = useRef(null);
    const starsRef = useRef(null);
    const cloudsRef = useRef(null);

    // This effect runs all the animations whenever the 'isDarkMode' state changes
    useEffect(() => {
        const springTransition = { type: "spring", stiffness: 400, damping: 25 };

        // Animate the background color of the container
        animate(containerRef.current, {
            background: isDarkMode ? 'linear-gradient(to right, #0d1a44, #415187)' : 'linear-gradient(to right, #63a4ff, #87CEEB)',
        }, { duration: 0.5 });

        // Animate the thumb (the sun/moon container) sliding left and right
        animate(thumbRef.current, {
            transform: isDarkMode ? 'translateX(38px)' : 'translateX(4px)'
        }, springTransition);

        // Animate the sun and moon fading in/out and rotating
        animate(sunRef.current, { opacity: isDarkMode ? 0 : 1, rotate: isDarkMode ? -90 : 0 }, springTransition);
        animate(moonRef.current, { opacity: isDarkMode ? 1 : 0, rotate: isDarkMode ? 0 : 90 }, springTransition);
        
        // Animate the stars and clouds fading in/out
        animate(starsRef.current, { opacity: isDarkMode ? 1 : 0 }, { duration: 0.5 });
        animate(cloudsRef.current, { opacity: isDarkMode ? 0 : 1 }, { duration: 0.5 });

    }, [isDarkMode]);

    return (
        <Box
            ref={containerRef}
            onClick={onClick}
            sx={{
                position: 'relative',
                width: '70px',
                height: '32px',
                borderRadius: '16px',
                cursor: 'pointer',
                overflow: 'hidden',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
            }}
        >
            {/* --- Static elements that will be faded in/out --- */}
            <Box ref={starsRef} sx={{ opacity: 0 }}><Stars /></Box>
            <Box ref={cloudsRef} sx={{ opacity: 1 }}><Clouds /></Box>
            
            {/* --- The sliding thumb --- */}
            <Box ref={thumbRef} sx={{ position: 'absolute', top: '4px' }}>
                {/* The Sun */}
                <Box
                    ref={sunRef}
                    sx={{
                        position: 'absolute',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#FFD700',
                        boxShadow: '0 0 10px #FFD700',
                    }}
                />
                {/* The Moon */}
                <Box
                    ref={moonRef}
                    sx={{
                        position: 'absolute',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#E0E0E0',
                        boxShadow: 'inset -3px 2px 0px 0px #A9A9A9',
                        opacity: 0,
                    }}
                />
            </Box>
        </Box>
    );
};

export default ThemeToggleButton;