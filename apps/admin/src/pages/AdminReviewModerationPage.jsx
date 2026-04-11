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
    Chip,
    Rating
} from '@mui/material';

const AdminReviewModerationPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = () => {
        setLoading(true);
        axios.get('/api/admin/reviews/')
            .then(response => {
                setReviews(response.data.results || response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching reviews", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleApprove = (reviewId) => {
        axios.patch(`/api/admin/reviews/${reviewId}/`, { is_approved: true })
            .then(() => {
                alert('Review approved!');
                fetchReviews();
            })
            .catch(() => alert('Failed to approve review.'));
    };

    const handleDelete = (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            axios.delete(`/api/admin/reviews/${reviewId}/`)
                .then(() => {
                    alert('Review deleted!');
                    fetchReviews();
                })
                .catch(() => alert('Failed to delete review.'));
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Review Moderation</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Book</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Comment</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reviews.map((review) => (
                            <TableRow key={review.id}>
                                <TableCell>{review.book_title || 'N/A'}</TableCell>
                                <TableCell>{review.user}</TableCell>
                                <TableCell>
                                    <Rating value={review.rating} readOnly />
                                </TableCell>
                                <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {review.comment}
                                </TableCell>
                                <TableCell>
                                    {review.is_approved
                                        ? <Chip label="Approved" color="success" size="small" />
                                        : <Chip label="Pending" color="warning" size="small" />
                                    }
                                </TableCell>
                                <TableCell align="right">
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                        {!review.is_approved && (
                                            <Button size="small" variant="contained" color="success" onClick={() => handleApprove(review.id)}>
                                                Approve
                                            </Button>
                                        )}
                                        <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(review.id)}>
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

export default AdminReviewModerationPage;