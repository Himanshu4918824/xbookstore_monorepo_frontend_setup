import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Paper,
    Typography,
    Box,
    Grid,
    Alert,
    Container,
    Breadcrumbs,
    Link,
    CircularProgress,
} from '@mui/material';

// Import our trusted components and hooks
import CategoryColumn from '../components/CategoryColumn';
import CategoryDialog from '../components/CategoryDialog';
import { usePageEntranceAnimation } from '../components/animationHooks';
import API from '../utils/axiosConfig';

const AdminCategoryManagementPage = () => {
    // --- STATE MANAGEMENT ---
    // A single source of truth for all categories
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for the currently selected category in each column
    // We store the whole object now, which is cleaner than just the ID
    const [selectedCol1, setSelectedCol1] = useState(null);
    const [selectedCol2, setSelectedCol2] = useState(null);

    // State for managing the "Add New" dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [parentForDialog, setParentForDialog] = useState(null);

    // --- ANIMATIONS ---
    const paperRef = useRef(null);
    usePageEntranceAnimation([paperRef], loading);

    // --- DATA FETCHING ---
    const fetchCategories = () => {
        setLoading(true);
        API.get('/api/categories/')
            .then(response => {
                setAllCategories(response.data.results || response.data);
            })
            .catch(err => {
                console.error("Error fetching categories", err);
                setError('Failed to fetch categories.');
            })
            .finally(() => setLoading(false));
    };

    // Fetch data only once on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // --- EVENT HANDLERS ---
    const handleSelectCol1 = (category) => {
        setSelectedCol1(category);
        setSelectedCol2(null); // IMPORTANT: Reset the child column selection
    };

    const handleSelectCol2 = (category) => {
        setSelectedCol2(category);
    };

    const handleOpenDialog = (parentCategory) => {
        setError(''); // Clear any previous errors
        setParentForDialog(parentCategory);
        setDialogOpen(true);
    };

    const handleDialogSave = async (payload) => {
        try {
            await API.post('/api/categories/', payload);
            setDialogOpen(false);
            // On successful save, deselect everything to show the new top-level item
            setSelectedCol1(null);
            setSelectedCol2(null);
            fetchCategories(); // Refresh the entire category tree
        } catch (err) {
            const errorMsg = err.response?.data?.name?.[0] || `Failed to add category.`;
            setError(errorMsg);
            throw err; // Re-throw to keep dialog open and signal failure
        }
    };

    // --- DERIVED DATA & LAYOUT LOGIC ---
    // This logic now cleanly determines the content and visibility of each column
    const col1Data = allCategories;
    const col2Data = selectedCol1 ? (selectedCol1.children || []) : [];
    const col3Data = selectedCol2 ? (selectedCol2.children || []) : [];
    
    // Dynamically calculate grid width for responsive columns
    const gridWidth = selectedCol1 ? (selectedCol2 ? 4 : 6) : 12;

    return (
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Manage Book Categories
                </Typography>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={() => { setSelectedCol1(null); setSelectedCol2(null); }}>
                        All Categories
                    </Link>
                    {selectedCol1 && <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={() => setSelectedCol2(null)}>{selectedCol1.name}</Link>}
                    {selectedCol2 && <Typography color="text.primary">{selectedCol2.name}</Typography>}
                </Breadcrumbs>
            </Box>

            {error && !dialogOpen && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>
            ) : (
                <Paper ref={paperRef} elevation={3} sx={{ borderRadius: '16px', maxHeight: '70vh', minHeight: '400px', display: 'flex', opacity: 0 }}>
                    <Grid container sx={{ height: '100%' }}>
                        {/* --- COLUMN 1 (Always Visible) --- */}
                        <Grid item xs={12} md={gridWidth} sx={{ borderRight: 1, borderColor: 'divider', height: '100%' }}>
                            <CategoryColumn
                                title="Categories"
                                items={col1Data}
                                selectedId={selectedCol1?.id}
                                onItemSelect={handleSelectCol1}
                                onAdd={() => handleOpenDialog(null)}
                            />
                        </Grid>

                        {/* --- COLUMN 2 (Conditionally Visible) --- */}
                        {selectedCol1 && (
                            <Grid item xs={12} md={gridWidth} sx={{ borderRight: 1, borderColor: 'divider', height: '100%' }}>
                                <CategoryColumn
                                    title={selectedCol1.name}
                                    items={col2Data}
                                    selectedId={selectedCol2?.id}
                                    onItemSelect={handleSelectCol2}
                                    onAdd={() => handleOpenDialog(selectedCol1)}
                                />
                            </Grid>
                        )}

                        {/* --- COLUMN 3 (Conditionally Visible) --- */}
                        {selectedCol2 && (
                            <Grid item xs={12} md={gridWidth} sx={{ height: '100%' }}>
                                <CategoryColumn
                                    title={selectedCol2.name}
                                    items={col3Data}
                                    // No selection or selectedId needed for the last column
                                    onItemSelect={() => {}} 
                                    onAdd={() => handleOpenDialog(selectedCol2)}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            )}

            <CategoryDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSave={handleDialogSave}
                parentCategory={parentForDialog}
            />
        </Container>
    );
};

export default AdminCategoryManagementPage;