import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    Paper,
    Typography,
    TextField,
    CircularProgress,
    Avatar,
    Box,
    InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import API from '../utils/axiosConfig';

const AdminFeaturedBooksPage = () => {
    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const fetchFeaturedBooks = () => {
        setLoading(true);
        API.get('/api/books/?is_featured=true')
            .then(response => {
                setFeaturedBooks(response.data.results || response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching featured books", error));
    };

    useEffect(() => {
        fetchFeaturedBooks();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm) return;
        setIsSearching(true);
        API.get(`/api/books/?search=${searchTerm}`)
            .then(response => {
                const newResults = response.data.results.filter(
                    result => !featuredBooks.some(featured => featured.id === result.id)
                );
                setSearchResults(newResults);
            })
            .finally(() => setIsSearching(false));
    };

    const toggleFeaturedStatus = (book, isFeatured) => {
        API.patch(`/api/books/${book.id}/toggle-feature/`, { is_featured: isFeatured })
            .then(() => {
                alert(`Book "${book.title}" has been ${isFeatured ? 'featured' : 'un-featured'}.`);
                if (isFeatured) {
                    setFeaturedBooks(prev => [book, ...prev]);
                    setSearchResults(prev => prev.filter(b => b.id !== book.id));
                } else {
                    setFeaturedBooks(prev => prev.filter(b => b.id !== book.id));
                    setSearchResults(prev => [book, ...prev]);
                }
            })
            .catch(() => alert('Failed to update book status.'));
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Manage Featured Books</Typography>

            <Paper sx={{ p: 2, mb: 4 }}>
                <Typography variant="h5" gutterBottom>Currently Featured ({featuredBooks.length})</Typography>
                {loading ? <CircularProgress /> : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        {featuredBooks.map(book => (
                            <Box key={book.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar src={book.images?.[0]?.image || 'https://placehold.co/100'} />
                                    <Box>
                                        <Typography fontWeight="bold">{book.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">{book.authors?.map(a => a.user.first_name).join(', ')}</Typography>
                                    </Box>
                                </Box>
                                <Button variant="outlined" color="warning" size="small" onClick={() => toggleFeaturedStatus(book, false)}>
                                    Un-feature
                                </Button>
                            </Box>
                        ))}
                    </Box>
                )}
            </Paper>

            <Paper sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>Add a Book to Featured</Typography>
                <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Search by Title, ISBN, or Author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: ( <InputAdornment position="start"><SearchIcon /></InputAdornment> ),
                        }}
                    />
                    <Button type="submit" variant="contained" disabled={isSearching} sx={{ minWidth: 100 }}>
                        {isSearching ? <CircularProgress size={24} color="inherit"/> : 'Search'}
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, maxHeight: 400, overflowY: 'auto' }}>
                    {searchResults.map(book => (
                        <Box key={book.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar src={book.images?.[0]?.image || 'https://placehold.co/100'} />
                                <Box>
                                    <Typography fontWeight="bold">{book.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{book.authors?.map(a => a.user.first_name).join(', ')}</Typography>
                                </Box>
                            </Box>
                            <Button variant="contained" color="success" size="small" onClick={() => toggleFeaturedStatus(book, true)}>
                                + Feature this Book
                            </Button>
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminFeaturedBooksPage;