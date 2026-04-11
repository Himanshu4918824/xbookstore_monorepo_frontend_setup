import React from 'react';
import Select from 'react-select';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

const CustomStyledReactSelect = ({ label, ...props }) => {
    const theme = useTheme();

    const customStyles = {
        // All your existing, working styles remain the same
        control: (provided, state) => ({
            ...provided,
            minHeight: '56px',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            border: `1px solid ${state.isFocused ? theme.palette.secondary.main : theme.palette.divider}`,
            borderRadius: '8px',
            boxShadow: state.isFocused ? `0 0 4px ${theme.palette.secondary.main}` : 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            '&:hover': {
                borderColor: state.isFocused ? theme.palette.secondary.main : theme.palette.text.primary,
            },
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: '2px 8px',
        }),
        input: (provided) => ({
            ...provided,
            margin: '0 2px',
            color: theme.palette.text.primary,
        }),
        placeholder: (provided) => ({
            ...provided,
            color: theme.palette.text.secondary,
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: theme.palette.action.selected,
            borderRadius: '4px',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: theme.palette.text.primary,
            fontSize: '0.9em',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '8px',
            boxShadow: theme.shadows[3],
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? theme.palette.secondary.main
                : state.isFocused
                ? theme.palette.action.hover
                : 'transparent',
            color: state.isSelected ? theme.palette.secondary.contrastText : theme.palette.text.primary,
            '&:active': {
                backgroundColor: theme.palette.action.selected,
            },
        }),

        // --- FIX #1: Add this new style key for the portal ---
        // This targets the menu's portal container and gives it a high z-index.
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999, // Ensures menu is on top of the dialog (which is ~1300)
        }),
    };

    return (
        <Box sx={{ my: 1 }}>
            {label && (
                <Typography variant="caption" sx={{ color: 'text.secondary', ml: '2px', display: 'block', mb: '2px' }}>
                    {label}
                </Typography>
            )}
            <Select
                styles={customStyles}
                {...props}
                // --- FIX #2: Add the portal target prop ---
                // This tells react-select to render the menu at the document body.
                menuPortalTarget={document.body}
                
                // --- FIX #3: Add the menu positioning prop ---
                // This helps position the menu correctly when it's in a portal.
                menuPosition={'fixed'}
            />
        </Box>
    );
};

export default CustomStyledReactSelect;