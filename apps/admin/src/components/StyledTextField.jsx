import React from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        // Use a subtle, theme-aware background color
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        borderRadius: '8px',
        transition: 'background-color 0.3s, box-shadow 0.3s',
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
        },
    },
    '& .MuiOutlinedInput-notchedOutline': {
        // Use the theme's standard divider color for the border
        borderColor: theme.palette.divider,
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
        // Use the theme's secondary color for the focus outline
        borderColor: theme.palette.secondary.main,
        boxShadow: `0 0 8px ${theme.palette.secondary.main}`,
    },
    '& .Mui-focused .MuiInputLabel-root': {
        // Use the theme's secondary color for the focused label
        color: theme.palette.secondary.main,
    },
}));

const StyledTextField = (props) => {
    return <CustomTextField {...props} fullWidth variant="outlined" />;
};

export default StyledTextField;