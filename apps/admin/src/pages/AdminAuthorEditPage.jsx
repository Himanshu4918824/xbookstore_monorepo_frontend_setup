import React, { useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { animate } from "motion";

// --- Material-UI Imports ---
import {
    Box, Typography, Button, Paper, Grid, Divider,
    CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Alert, IconButton
} from '@mui/material';

// --- Icon Imports ---
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// --- Custom Component & Hook Imports ---
import StyledTextField from '../components/StyledTextField';
import { useAuthorEditForm } from '../hooks/useAuthorEditForm';
import TwoColumnFormLayout from '../components/TwoColumnFormLayout'; // Import the new layout

const AdminAuthorEditPage = () => {
    // All logic and state are managed by the custom hook
    const {
        userData, authorData, history, isLoading, isSubmitting, error,
        imgSrc, croppedImagePreview, crop, openCropDialog, imgRef,
        handleUserChange, handleAuthorChange, addHistoryRow, removeHistoryRow,
        handleHistoryChange, handleFileChange, setCrop, setCompletedCrop,
        onImageLoad, handleSaveCrop, setOpenCropDialog, handleSubmit
    } = useAuthorEditForm();

    const createButtonRef = useRef(null);

    const handleButtonHover = (ref, scale) => {
        if (ref.current) {
            animate(ref.current, { scale }, { type: "spring", stiffness: 400, damping: 15 });
        }
    };

    // --- LEFT COLUMN CONTENT: The Image Uploader ---
    const leftColumnContent = (
        <Box
            component="label"
            m={4}
            sx={{
                width: '100%',
                maxWidth: '350px', // Set a max-width for better aesthetics
                color: 'white',
                aspectRatio: '3 / 4',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: '12px',
                bgcolor: 'action.hover',
                backgroundImage: `url(${croppedImagePreview})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                '&:hover .upload-overlay': { opacity: 1 },
            }}
        >
            <input type="file" hidden onChange={handleFileChange} accept="image/*" />
            <Box
                className="upload-overlay"
                sx={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    bgcolor: 'rgba(0,0,0,0.5)', zIndex: 2, opacity: 0,
                    transition: 'opacity 0.3s ease-in-out',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'center'
                }}
            >
                <EditIcon sx={{ fontSize: 40 }} />
                <Typography>Change Image</Typography>
            </Box>
        </Box>
    );

    // --- RIGHT COLUMN CONTENT: All Form Fields and Buttons ---
    const rightColumnContent = (
        <>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Edit Author Details</Typography>

            {/* User Details */}
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>User Account Details</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}><StyledTextField label="First Name" name="first_name" value={userData.first_name} onChange={handleUserChange} /></Grid>
                <Grid item xs={12} md={6}><StyledTextField label="Last Name" name="last_name" value={userData.last_name} onChange={handleUserChange} /></Grid>
                <Grid item xs={12}><StyledTextField label="Email Address" name="email" type="email" value={userData.email} onChange={handleUserChange} /></Grid>
                <Grid item xs={12} md={6}><StyledTextField label="Username" name="username" value={userData.username} onChange={handleUserChange} /></Grid>
            </Grid>

            {/* Author Profile Details */}
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', pt: 2 }}>Author Profile</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}><StyledTextField label="ORCID" name="orcid" value={authorData.orcid || ''} onChange={handleAuthorChange} /></Grid>
                <Grid item xs={12} md={6}><StyledTextField label="Social Media URL" name="social_media_profile" value={authorData.social_media_profile || ''} onChange={handleAuthorChange} /></Grid>
            </Grid>

            {/* Professional History */}
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>Professional History</Typography>
            {history.map((record, index) => (
                <Paper key={index} variant="outlined" sx={{ p: 2, mt: 1, position: 'relative', width: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}><StyledTextField label="Designation" name="designation" value={record.designation} onChange={(e) => handleHistoryChange(index, e)} required /></Grid>
                        <Grid item xs={12} md={6}><StyledTextField label="Organization" name="organization" value={record.organization} onChange={(e) => handleHistoryChange(index, e)} required /></Grid>
                        <Grid item xs={12} md={6}><StyledTextField label="Start Date" name="start_date" type="date" value={record.start_date || ''} onChange={(e) => handleHistoryChange(index, e)} InputLabelProps={{ shrink: true }} required /></Grid>
                        <Grid item xs={12} md={6}><StyledTextField label="End Date" name="end_date" type="date" value={record.end_date || ''} onChange={(e) => handleHistoryChange(index, e)} InputLabelProps={{ shrink: true }} /></Grid>
                        <Grid item xs={12}><StyledTextField multiline rows={4} label="Biography" name="bio" value={record.bio || ''} onChange={(e) => handleHistoryChange(index, e)} /></Grid>
                    </Grid>
                    {history.length > 1 && <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={() => removeHistoryRow(index)}><DeleteIcon color="error" /></IconButton>}
                </Paper>
            ))}
            <Button variant="outlined" startIcon={<AddIcon />} onClick={addHistoryRow} sx={{ mt: 2 }}>Add History Record</Button>

            <Divider sx={{ my: 3 }} />

            {/* Submission Area */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    ref={createButtonRef}
                    type="submit"
                    variant="contained"
                    size="large"
                    color="secondary"
                    disabled={isSubmitting}
                    onMouseEnter={() => handleButtonHover(createButtonRef, 1.05)}
                    onMouseLeave={() => handleButtonHover(createButtonRef, 1)} // Corrected the typo here
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 'bold' }}
                >
                    {isSubmitting ? 'Saving...' : 'Save All Changes'}
                </Button>
            </Box>
        </>
    );

    return (
        <>
            <TwoColumnFormLayout
                backTo="/admin/authors"
                backToText="Back to Authors"
                title={`Edit Author: ${userData.first_name || ''} ${userData.last_name || ''}`}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                leftColumn={leftColumnContent}
                rightColumn={rightColumnContent}
            />

            {/* The Dialog is page-specific UI, so it stays here */}
            <Dialog open={openCropDialog} onClose={() => setOpenCropDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Crop Profile Picture</DialogTitle>
                <DialogContent>
                    {imgSrc && (
                        <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompletedCrop(c)} aspect={3 / 4}>
                            <img ref={imgRef} src={imgSrc} onLoad={onImageLoad} style={{ maxHeight: '70vh' }} alt="Crop Preview"/>
                        </ReactCrop>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCropDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveCrop} variant="contained">Save Crop</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminAuthorEditPage;