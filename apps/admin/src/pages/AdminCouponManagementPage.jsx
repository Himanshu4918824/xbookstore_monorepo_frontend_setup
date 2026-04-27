import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Switch,
    Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import API from '../utils/axiosConfig';

const AdminCouponManagementPage = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCoupons = () => {
        setLoading(true);
        API.get('/api/admin/coupons/')
            .then(response => {
                setCoupons(response.data.results || response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching coupons", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleDelete = (couponId) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            API.delete(`/api/admin/coupons/${couponId}/`)
                .then(() => {
                    alert('Coupon deleted successfully!');
                    fetchCoupons();
                })
                .catch(() => alert('Failed to delete coupon.'));
        }
    };

    const handleToggleActive = (coupon) => {
        API.patch(`/api/admin/coupons/${coupon.id}/`, { is_active: !coupon.is_active })
            .then(() => {
                fetchCoupons();
            })
            .catch(() => alert('Failed to update coupon status.'));
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>Manage Coupons</Typography>
                <Button
                    variant="contained"
                    component={Link}
                    to="/admin/coupons/new"
                    startIcon={<AddIcon />}
                >
                    Add New Coupon
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Code</TableCell>
                            <TableCell>Value</TableCell>
                            <TableCell>Usage</TableCell>
                            <TableCell>Active (Pause/Resume)</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {coupons.map((coupon) => (
                            <TableRow key={coupon.id}>
                                <TableCell component="th" scope="row">
                                    <Typography variant="body1" fontWeight="bold">{coupon.code}</Typography>
                                    <Typography variant="caption" color="text.secondary">{coupon.discount_type}</Typography>
                                </TableCell>
                                <TableCell>
                                    {coupon.discount_type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                                </TableCell>
                                <TableCell>{coupon.times_used} / {coupon.max_uses}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={coupon.is_active}
                                        onChange={() => handleToggleActive(coupon)}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                    {coupon.is_active ? <Chip label="Active" color="success" size="small" /> : <Chip label="Paused" size="small" />}
                                </TableCell>
                                <TableCell align="right">
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                        <Button size="small" variant="outlined" component={Link} to={`/admin/coupons/edit/${coupon.id}`}>
                                            Edit
                                        </Button>
                                        <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(coupon.id)}>
                                            Delete
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminCouponManagementPage;