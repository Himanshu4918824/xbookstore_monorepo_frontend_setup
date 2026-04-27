import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    Button, 
    Paper, 
    Typography, 
    TextField, 
    Box, 
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch
} from '@mui/material';
import API from '../utils/axiosConfig';

const AdminCouponFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    
    const [formData, setFormData] = useState({
        code: '', value: '', discount_type: 'percentage', is_active: true,
        max_value: '', start_date: '', expiry_date: '', max_uses: 100,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEditing) {
            API.get(`/api/admin/coupons/${id}/`)
                .then(response => {
                    const data = response.data;
                    if (data.start_date) data.start_date = data.start_date.slice(0, 16);
                    if (data.expiry_date) data.expiry_date = data.expiry_date.slice(0, 16);
                    setFormData(data);
                });
        }
    }, [id, isEditing]);    

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const payload = { ...formData };
        if (!payload.max_value) delete payload.max_value;
        if (!payload.start_date) delete payload.start_date;
        if (!payload.expiry_date) delete payload.expiry_date;

        const request = isEditing
            ? API.patch(`/api/admin/coupons/${id}/`, payload)
            : API.post('/api/admin/coupons/', payload);

        request
            .then(() => {
                alert(`Coupon ${isEditing ? 'updated' : 'created'} successfully!`);
                navigate('/admin/coupons');
            })
            .catch(error => alert(`Failed: ${JSON.stringify(error.response.data)}`))
            .finally(() => setIsSubmitting(false));
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                {isEditing ? 'Edit Coupon' : 'Add New Coupon'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Coupon Code" name="code" value={formData.code} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Discount Type</InputLabel>
                            <Select name="discount_type" value={formData.discount_type} label="Discount Type" onChange={handleChange}>
                                <MenuItem value="percentage">Percentage (%)</MenuItem>
                                <MenuItem value="amount">Fixed Amount (₹)</MenuItem>
                                <MenuItem value="random_range">Random Range (₹)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {formData.discount_type === 'random_range' ? (
                        <>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Min Discount Value (₹)" name="value" type="number" value={formData.value} onChange={handleChange} required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Max Discount Value (₹)" name="max_value" type="number" value={formData.max_value} onChange={handleChange} required />
                            </Grid>
                        </>
                    ) : (
                        <Grid item xs={12}>
                            <TextField fullWidth label={`Discount Value (${formData.discount_type === 'percentage' ? '%' : '₹'})`} name="value" type="number" value={formData.value} onChange={handleChange} required />
                        </Grid>
                    )}

                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Start Date (Optional)" name="start_date" type="datetime-local" value={formData.start_date || ''} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Expiry Date (Optional)" name="expiry_date" type="datetime-local" value={formData.expiry_date || ''} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Total Usage Limit" name="max_uses" type="number" value={formData.max_uses} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Switch checked={formData.is_active} onChange={handleChange} name="is_active" />}
                            label="Coupon is Active"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" size="large" disabled={isSubmitting} fullWidth>
                            {isEditing ? 'Update Coupon' : 'Create Coupon'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default AdminCouponFormPage;