import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper, Grid, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * A reusable layout component for creating and editing pages.
 * It provides a consistent header, a two-panel grid system, and an actions footer.
 * @param {object} props
 * @param {string} props.title - The title to display in the header.
 * @param {string} props.backLinkUrl - The URL for the "Back to..." button.
 * @param {string} props.backLinkText - The text for the "Back to..." button.
 * @param {React.ReactNode} props.leftPanelContent - The JSX content for the left panel.
 * @param {React.ReactNode} props.rightPanelContent - The JSX content for the right panel.
 * @param {React.ReactNode} props.actionsContent - The JSX for the final action buttons.
 * @param {function} props.onSubmit - The function to call when the form is submitted.
 */
const FormPageLayout = ({
    title,
    backLinkUrl,
    backLinkText,
    leftPanelContent,
    rightPanelContent,
    actionsContent,
    onSubmit
}) => {
    return (
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
            {/* The main Paper component now acts as the single form */}
            <Paper
                component="form"
                onSubmit={onSubmit}
                elevation={3}
                sx={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    bgcolor: 'background.paper'
                }}
            >
                {/* --- HEADER SECTION --- */}
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Button component={RouterLink} to={backLinkUrl} startIcon={<ArrowBackIcon />} sx={{ mr: 2, color: 'text.secondary', textTransform: 'none' }}>
                        {backLinkText}
                    </Button>
                    <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>
                        {title}
                    </Typography>
                </Box>

                {/* --- MAIN CONTENT GRID --- */}
                <Grid container spacing={4} sx={{ p: { xs: 2, md: 3 } }}>
                    {/* --- LEFT PANEL --- */}
                    <Grid item xs={12} md={4} lg={3}>
                        {leftPanelContent}
                    </Grid>
                    
                    {/* --- RIGHT PANEL --- */}
                    <Grid item xs={12} md={8} lg={9}>
                        {rightPanelContent}
                    </Grid>
                </Grid>

                {/* --- ACTIONS FOOTER --- */}
                <Box sx={{ p: 3, pt: 1 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {actionsContent}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default FormPageLayout;