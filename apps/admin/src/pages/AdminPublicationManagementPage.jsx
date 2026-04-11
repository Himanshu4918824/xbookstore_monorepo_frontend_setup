import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';

// --- Material-UI Imports (Unchanged) ---
import {
    Container, Box, Typography, Button, Paper, TableContainer, Table,
    TableHead, TableRow, TableCell, TableBody, CircularProgress,
    IconButton, Tooltip, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, Avatar
} from '@mui/material';

// --- Icon Imports (Unchanged) ---
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// --- IMPORT YOUR NEW REUSABLE HOOKS ---
import {
    useSpringyHover,
    usePageEntranceAnimation,
    useStaggeredListAnimation
} from '../components/animationHooks';

const AdminPublicationManagementPage = () => {
    // --- State for data and dialog (Unchanged) ---
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [publicationToDelete, setPublicationToDelete] = useState(null);

    // --- Refs for Animation Targets ---
    const headerRef = useRef(null);
    const tableRef = useRef(null);

    // --- CALL THE REUSABLE ANIMATION HOOKS ---
    usePageEntranceAnimation([headerRef, tableRef], loading);
    const tableBodyRef = useStaggeredListAnimation(loading, publications, 'tr');
    const hoverHandlers = useSpringyHover({ scale: 1.2 });

    // --- Data fetching and dialog logic (Unchanged) ---
    useEffect(() => {
        fetchPublications();
    }, []);

    const fetchPublications = () => {
        setLoading(true);
        axios.get('/api/admin/publications/')
            .then(response => {
                setPublications(response.data.results || response.data);
            })
            .catch(error => console.error("Error fetching publications", error))
            .finally(() => setLoading(false));
    };

    const handleOpenDialog = (pubId) => {
        setPublicationToDelete(pubId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setPublicationToDelete(null);
        setOpenDialog(false);
    };

    const handleConfirmDelete = () => {
        if (!publicationToDelete) return;
        axios.delete(`/api/admin/publications/${publicationToDelete}/`)
            .then(() => fetchPublications())
            .catch(error => console.error("Error deleting publication:", error))
            .finally(() => handleCloseDialog());
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress size={60} /></Box>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* --- Page Header --- */}
            <Box ref={headerRef} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, opacity: 0 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Publication Management
                </Typography>
                <Button variant="contained" component={RouterLink} to="/admin/publications/new" startIcon={<AddIcon />} color="secondary" sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 'bold' }} {...hoverHandlers}>
                    Add New Publication
                </Button>
            </Box>

            {/* --- Publications Table --- */}
            <TableContainer ref={tableRef} component={Paper} elevation={3} sx={{ borderRadius: '16px', opacity: 0 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell sx={{ fontWeight: 'bold', width: '80px' }}>Logo</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Publication Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Director</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nature of Publication</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    {/* Attach the ref from the hook to the parent of the list items */}
                    <TableBody ref={tableBodyRef}>
                        {publications.map((pub) => (
                            <TableRow key={pub.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell><Avatar src={pub.logo} /></TableCell>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>{pub.name}</TableCell>
                                <TableCell>{pub.director || 'N/A'}</TableCell>
                                <TableCell>{pub.nature_of_publication || 'N/A'}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Edit Publication">
                                        {/* Spread the hover handlers onto the button */}
                                        <IconButton color="primary" component={RouterLink} to={`/admin/publications/edit/${pub.id}`} {...hoverHandlers}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Publication">
                                        <IconButton color="error" onClick={() => handleOpenDialog(pub.id)} {...hoverHandlers}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* --- Delete Confirmation Dialog (Unchanged) --- */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this publication? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>Delete</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminPublicationManagementPage;