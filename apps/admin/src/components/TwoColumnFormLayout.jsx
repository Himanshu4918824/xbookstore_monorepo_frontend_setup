import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Paper, Box, Button, Typography, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * A reusable layout component for forms with a header and a two-column design.
 * @param {object} props
 * @param {string} props.backTo - The URL for the "Back" button.
 * @param {string} props.backToText - The text for the "Back" button.
 * @param {string} props.title - The main title for the form page.
 * @param {React.ReactNode} props.leftColumn - The JSX content for the left column.
 * @param {React.ReactNode} props.rightColumn - The JSX content for the right column.
 * @param {function} props.onSubmit - The function to handle the form's submission.
 * @param {boolean} [props.isLoading=false] - If true, displays a loading spinner instead of the form.
 */
const TwoColumnFormLayout = ({
    backTo,
    backToText,
    title,
    leftColumn,
    rightColumn,
    onSubmit,
    isLoading = false
}) => {
    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
            <Paper elevation={3} sx={{ borderRadius: '16px', overflow: 'hidden', bgcolor: 'background.paper' }}>
                {/* --- HEADER --- */}
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Button component={RouterLink} to={backTo} startIcon={<ArrowBackIcon />} sx={{ mr: 2 }}>
                        {backToText}
                    </Button>
                    <Typography variant="h6" component="h1">
                        {title}
                    </Typography>
                </Box>

                {/* --- FORM GRID --- */}
                <Paper
                    component="form"
                    onSubmit={onSubmit}
                    elevation={0}
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '40% 60%' },
                        bgcolor: 'transparent'
                    }}
                >
                    {/* --- LEFT COLUMN --- */}
                    <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                        {leftColumn}
                    </Box>

                    {/* --- RIGHT COLUMN --- */}
                    <Box sx={{ p: { xs: 2, md: 3 } }}>
                        {rightColumn}
                    </Box>
                </Paper>
            </Paper>
        </Container>
    );
};

export default TwoColumnFormLayout;