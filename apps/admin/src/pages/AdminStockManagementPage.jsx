import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Box, Typography, Paper, CircularProgress, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Tooltip, IconButton,
    Avatar, TextField, InputAdornment, TablePagination
} from '@mui/material';

// --- Icon Imports ---
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import API from '../utils/axiosConfig';

// ===================================================================
//  1. Reusable Sub-Component for an Editable Row
// ===================================================================
const StockRow = ({ format, onSaveStock }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [stockValue, setStockValue] = useState(format.stock);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            await onSaveStock(format.id, stockValue);
            setIsEditing(false); // Only exit edit mode on success
        } catch {
            // Error is alerted in parent, just stop submitting here
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Reset local state if the main data reloads
    useEffect(() => {
        setStockValue(format.stock);
    }, [format.stock]);

    return (
        <TableRow hover>
            <TableCell><Avatar src={format.cover_image || ''} variant="rounded" sx={{ width: 56, height: 80 }} /></TableCell>
            <TableCell>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{format.book_title}</Typography>
                <Typography variant="caption" color="text.secondary">{format.isbn}</Typography>
            </TableCell>
            <TableCell>{format.binding_type}</TableCell>
            <TableCell>{format.paper_quality}</TableCell>
            <TableCell>{format.page_size}</TableCell>
            <TableCell>₹{format.mrp}</TableCell>
            <TableCell>
                {isEditing ? (
                    <TextField
                        type="number"
                        size="small"
                        value={stockValue}
                        onChange={(e) => setStockValue(e.target.value)}
                        sx={{ width: '100px' }}
                        autoFocus
                    />
                ) : (
                    <Typography>{format.stock}</Typography>
                )}
            </TableCell>
            <TableCell>₹{format.stock_value.toFixed(2)}</TableCell>
            <TableCell align="right">
                {isEditing ? (
                    <Box sx={{ display: 'flex' }}>
                        <Tooltip title="Save Stock">
                            <IconButton color="success" onClick={handleSave} disabled={isSubmitting}>
                                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                            <IconButton color="default" onClick={() => setIsEditing(false)}>
                                <CancelIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ) : (
                    <Tooltip title="Edit Stock">
                        <IconButton color="primary" onClick={() => setIsEditing(true)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </TableCell>
        </TableRow>
    );
};

// ===================================================================
//  2. Main Page Component
// ===================================================================
const AdminStockManagementPage = () => {
    const [formats, setFormats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 0, rowsPerPage: 10, total: 0 });
    const [totalStockValue, setTotalStockValue] = useState(0);

    const fetchFormats = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams({
            page: pagination.page + 1,
            page_size: pagination.rowsPerPage,
        });

        API.get(`/api/admin/stock/?${params.toString()}`)
            .then(response => {
                setFormats(response.data.results);
                setPagination(prev => ({ ...prev, total: response.data.count }));
            })
            .catch(error => console.error("Error fetching stock data", error))
            .finally(() => setLoading(false));
    }, [pagination.page, pagination.rowsPerPage]);

    useEffect(() => {
        fetchFormats();
        API.get('/api/admin/stock/stats/')
            .then(response => {
                setTotalStockValue(response.data.total_stock_value);
            })
            .catch(error => console.error("Error fetching stock stats", error));

    }, [fetchFormats]);

    const handleSaveStock = async (formatId, newStock) => {
        try {
            await API.patch(`/api/admin/stock/${formatId}/`, { stock: newStock });
            // Refresh the list to show updated stock value and data
            fetchFormats();
        } catch (error) {
            alert(`Failed to update stock: ${error.response?.data?.stock || 'Unknown error'}`);
            // Re-throw the error so the child component knows the save failed
            throw error;
        }
    };
    
    const handleChangePage = (e, newPage) => setPagination(prev => ({ ...prev, page: newPage }));
    const handleChangeRowsPerPage = (e) => setPagination(prev => ({ ...prev, rowsPerPage: parseInt(e.target.value, 10), page: 0 }));

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>Stock Management</Typography>
                {/* You can add a button or other controls here if you want */}
            </Box>

            {/* +++ ADD THIS NEW DISPLAY BOX +++ */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                    <Typography variant="subtitle1">Total Stock Value: <b>₹ {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalStockValue)}</b></Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {/* Format the number to look like currency */}
                        
                    </Typography>
                </Paper>
            </Box>
            
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell>Cover</TableCell>
                                <TableCell>Book Title & ISBN</TableCell>
                                <TableCell>Binding</TableCell>
                                <TableCell>Paper Quality</TableCell>
                                <TableCell>Page Size</TableCell>
                                <TableCell>MRP</TableCell>
                                <TableCell>Stock</TableCell>
                                <TableCell>Stock Value</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={9} align="center"><CircularProgress /></TableCell></TableRow>
                            ) : (
                                formats.map((format) => (
                                    <StockRow key={format.id} format={format} onSaveStock={handleSaveStock} />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={pagination.total}
                    rowsPerPage={pagination.rowsPerPage}
                    page={pagination.page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
};

export default AdminStockManagementPage;