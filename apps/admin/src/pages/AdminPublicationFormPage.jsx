import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Button,
    Typography,
    CircularProgress,
    Box,
    Grid,
    Alert,
    Divider,
    MenuItem
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { animate } from "motion";

// Import our preserved design component
import TwoColumnFormLayout from '../components/TwoColumnFormLayout';
import StyledTextField from '../components/StyledTextField';
import StyledDropdown from '../components/StyledDropdown';

// A default placeholder image for the uploader
const placeholderImageUrl = 'https://images.unsplash.com/photo-1549492423-400259a5e5a4?q=80&w=1974&auto=format&fit=crop';

const AdminPublicationFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    const createButtonRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        director: '',
        website: '',
        about: '',
        nature_of_publication: '',
        social_media_handles: '',
        publication_address_primary: '',
        publication_address_second: '',
    });

    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [currentLogoUrl, setCurrentLogoUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(isEditing);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditing) {
            axios.get(`/api/admin/publications/${id}/`)
                .then(response => {
                    setFormData(response.data);
                    setCurrentLogoUrl(response.data.logo);
                })
                .catch(err => {
                    console.error("Failed to fetch publication data:", err);
                    setError("Could not load publication data.");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [id, isEditing]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const previewUrl = URL.createObjectURL(file);
            setLogoPreview(previewUrl);
        }
    };

    const handleButtonHover = (ref, scale) => {
        if (ref.current) {
            animate(ref.current, { scale }, { type: "spring", stiffness: 400, damping: 15 });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        const postData = new FormData();

        Object.keys(formData).forEach(key => {
            if (key !== 'logo' && formData[key] !== null) {
                postData.append(key, formData[key]);
            }
        });

        if (logoFile) {
            postData.append('logo', logoFile);
        }

        const request = isEditing
            ? axios.patch(`/api/admin/publications/${id}/`, postData)
            : axios.post('/api/admin/publications/', postData);

        request
            .then(() => {
                navigate('/admin/publications');
            })
            .catch(err => {
                const errorData = err.response?.data;
                const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : 'An unknown error occurred.';
                setError(`Submission failed: ${errorMessage}`);
            })
            .finally(() => setIsSubmitting(false));
    };

    // --- LEFT COLUMN CONTENT: The Logo Uploader ---
    const leftColumnContent = (
        <Box
            component="label"
            m={4}
            sx={{
                width: '100%',
                maxWidth: '350px',
                color: 'white',
                aspectRatio: '1 / 1',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: '12px',
                bgcolor: 'action.hover',
                backgroundImage: `url(${logoPreview || currentLogoUrl || placeholderImageUrl})`,
                backgroundSize: (logoPreview || currentLogoUrl) ? 'contain' : 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                position: 'relative',
            }}
        >
            <input type="file" hidden onChange={handleFileChange} accept="image/*" />
            <Box
                className="upload-overlay"
                sx={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    transition: 'background-color 0.3s ease-in-out',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'center',

                    // --- THE FIX ---
                    // If a real logo exists, the background is transparent by default.
                    // If no logo exists, the background is semi-transparent, which REVEALS the placeholder behind it.
                    backgroundColor: (logoPreview || currentLogoUrl) ? 'transparent' : 'rgba(0,0,0,0.5)',

                    // The hover effect now simply ensures the dark background appears when needed.
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }
                }}
            >
                <CloudUploadIcon sx={{ fontSize: 40 }} />
                <Typography>{currentLogoUrl ? 'Change Logo' : 'Upload Logo'}</Typography>
            </Box>
        </Box>
    );

    // --- RIGHT COLUMN CONTENT: The Form Fields (Unchanged) ---
    const rightColumnContent = (
        <>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                {isEditing ? 'Edit Publication' : 'Create New Publication'}
            </Typography>
            <Grid container spacing={2}>
                <Grid item size={{ xs: 12, md: 12 }}>
                    <StyledTextField fullWidth label="Publication Name" name="name" value={formData.name} onChange={handleChange} required />
                </Grid>
                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledTextField fullWidth label="Director" name="director" value={formData.director} onChange={handleChange} />
                </Grid>
                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledTextField fullWidth label="Website URL" name="website" type="url" value={formData.website} onChange={handleChange} />
                </Grid>
                 <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledDropdown
                        label="Nature of Publication"
                        name="nature_of_publication"
                        value={formData.nature_of_publication || ''}
                        onChange={handleChange}
                    >
                        <MenuItem value={"National"}>National</MenuItem>
                        <MenuItem value={"International"}>International</MenuItem>
                    </StyledDropdown>
                </Grid>
                {/* <Grid item xs={12}>
                    <StyledTextField fullWidth label="Social Media" name="social_media_handles" value={formData.social_media_handles} onChange={handleChange} />
                </Grid> */}
                <Grid item size={{ xs: 12, md: 12 }}>
                    <StyledTextField fullWidth label="Primary Address" name="publication_address_primary" value={formData.publication_address_primary} onChange={handleChange} />
                </Grid>
                <Grid item size={{ xs: 12, md: 12 }}>
                    <StyledTextField fullWidth label="Secondary Address" name="publication_address_second" value={formData.publication_address_second} onChange={handleChange} />
                </Grid>
                <Grid item size={{ xs: 12, md: 12 }}>
                    <StyledTextField multiline rows={4} fullWidth label="About Publication" name="about" value={formData.about} onChange={handleChange} />
                </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
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
                    onMouseLeave={() => handleButtonHover(createButtonRef, 1)}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 'bold' }}
                >
                    {isSubmitting ? 'Saving...' : (isEditing ? 'Update Publication' : 'Create Publication')}
                </Button>
            </Box>
        </>
    );

    return (
        <TwoColumnFormLayout
            backTo="/admin/publications"
            backToText="Back to Publications"
            title={isEditing ? `Editing: ${formData.name}` : 'New Publication'}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            leftColumn={leftColumnContent}
            rightColumn={rightColumnContent}
        />
    );
};

export default AdminPublicationFormPage;