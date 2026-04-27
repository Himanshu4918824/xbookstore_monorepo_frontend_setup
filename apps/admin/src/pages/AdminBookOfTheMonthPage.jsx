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

const AdminBookOfTheMonthPage = () => {
    const [currentBook, setCurrentBook] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const fetchBookOfTheMonth = () => {
        setLoading(true);
        API.get('/api/books/?is_book_of_the_month=true')
            .then(response => {
                setCurrentBook(response.data.results?.[0] || null);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching Book of the Month", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchBookOfTheMonth();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm) return;
        setIsSearching(true);
        API.get(`/api/books/?search=${searchTerm}`)
            .then(response => {
                const newResults = response.data.results.filter(
                    result => result.id !== currentBook?.id
                );
                setSearchResults(newResults);
            })
            .finally(() => setIsSearching(false));
    };

    const setAsBookOfTheMonth = (book) => {
        API.patch(`/api/books/${book.id}/toggle-botm/`, { is_book_of_the_month: true })
            .then(() => {
                alert(`"${book.title}" is now the new Book of the Month.`);
                fetchBookOfTheMonth();
                setSearchTerm('');
                setSearchResults([]);
            });
    };

    const removeBookOfTheMonth = (book) => {
        API.patch(`/api/books/${book.id}/toggle-botm/`, { is_book_of_the_month: false })
            .then(() => {
                alert(`"${book.title}" is no longer the Book of the Month.`);
                setCurrentBook(null); // Optimistic update
            });
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Manage Book of the Month</Typography>

            <Paper sx={{ p: 2, mb: 4 }}>
                <Typography variant="h5" gutterBottom>Current Book of the Month</Typography>
                {loading ? <CircularProgress /> : (
                    currentBook ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, mt: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar src={currentBook.images?.[0]?.image || 'https://placehold.co/100'} />
                                <Box>
                                    <Typography fontWeight="bold">{currentBook.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{currentBook.authors?.map(a => a.user.first_name).join(', ')}</Typography>
                                </Box>
                            </Box>
                            <Button variant="outlined" color="error" size="small" onClick={() => removeBookOfTheMonth(currentBook)}>
                                Remove
                            </Button>
                        </Box>
                    ) : (
                        <Typography sx={{ mt: 2 }} color="text.secondary">No Book of the Month is currently set.</Typography>
                    )
                )}
            </Paper>

            <Paper sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>Set a New Book of the Month</Typography>
                <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Search by Title, ISBN, or Author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
                        }}
                    />
                    <Button type="submit" variant="contained" disabled={isSearching} sx={{ minWidth: 100 }}>
                        {isSearching ? <CircularProgress size={24} color="inherit" /> : 'Search'}
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
                            <Button variant="contained" color="success" size="small" onClick={() => setAsBookOfTheMonth(book)}>
                                Set as Book of the Month
                            </Button>
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminBookOfTheMonthPage;