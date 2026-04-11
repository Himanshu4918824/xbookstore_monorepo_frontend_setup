import React from 'react';
import { FormControl, InputLabel, Select } from '@mui/material';
import { styled } from '@mui/material/styles';

// We style the FormControl as it's the wrapper for the label and the select input
const StyledFormControl = styled(FormControl)(({ theme }) => ({
    '& .MuiInputBase-root': {
        // Use a subtle, theme-aware background color
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        borderRadius: '8px', // This will apply to the Select's container
        transition: 'background-color 0.3s, box-shadow 0.3s',
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
        },
    },
    '& .MuiOutlinedInput-notchedOutline': {
        // Use the theme's standard divider color for the border
        borderColor: theme.palette.divider,
    },
    
    // When the FormControl is focused, apply these styles
    '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
            // Use the theme's secondary color for the focus outline
            borderColor: theme.palette.secondary.main,
            boxShadow: `0 0 8px ${theme.palette.secondary.main}`,
        },
        '& .MuiInputLabel-root': {
            // Use the theme's secondary color for the focused label
            color: theme.palette.secondary.main,
        },
    },
}));

/**
 * A styled dropdown component that encapsulates FormControl, InputLabel, and Select.
 * It mirrors the design of StyledTextField.
 * @param {object} props
 * @param {string} props.label - The text for the floating label.
 * @param {string} props.name - The name of the input, used for state and IDs.
 * @param {any} props.value - The currently selected value.
 * @param {function} props.onChange - The callback function when a new item is selected.
 * @param {React.ReactNode} props.children - The <MenuItem> components to be rendered as options.
 */
const StyledDropdown = ({ label, name, value, onChange, children, ...props }) => {
    const labelId = `${name}-label`;

    return (
        <StyledFormControl {...props} fullWidth variant="outlined">
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
                labelId={labelId}
                id={`${name}-select`}
                name={name}
                value={value}
                label={label} // This is crucial for the outline to notch correctly
                onChange={onChange}
            >
                {children}
            </Select>
        </StyledFormControl>
    );
};

export default StyledDropdown;