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

const AdminAuthorOfTheYearPage = () => {
    const [currentAuthor, setCurrentAuthor] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const fetchAuthorOfTheYear = () => {
        setLoading(true);
        API.get('/api/admin/authors/?is_author_of_the_year=true')
            .then(response => {
                setCurrentAuthor(response.data.results?.[0] || null);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching Author of the Year", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchAuthorOfTheYear();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm) return;
        setIsSearching(true);
        API.get(`/api/admin/authors/?search=${searchTerm}`)
            .then(response => {
                const newResults = response.data.results.filter(
                    result => result.id !== currentAuthor?.id
                );
                setSearchResults(newResults);
            })
            .finally(() => setIsSearching(false));
    };

    const setAsAuthorOfTheYear = (author) => {
        API.patch(`/api/authors/${author.id}/toggle-aoty/`, { is_author_of_the_year: true })
            .then(() => {
                alert(`"${author.user.first_name} ${author.user.last_name}" is now the new Author of the Year.`);
                fetchAuthorOfTheYear();
                setSearchTerm('');
                setSearchResults([]);
            })
            .catch(() => alert('Failed to set new Author of the Year.'));
    };

    const removeAuthorOfTheYear = (author) => {
        API.patch(`/api/authors/${author.id}/toggle-aoty/`, { is_author_of_the_year: false })
            .then(() => {
                alert(`"${author.user.first_name} ${author.user.last_name}" is no longer the Author of the Year.`);
                setCurrentAuthor(null);
            })
            .catch(() => alert('Failed to remove Author of the Year.'));
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Manage Author of the Year</Typography>

            <Paper sx={{ p: 2, mb: 4 }}>
                <Typography variant="h5" gutterBottom>Current Author of the Year</Typography>
                {loading ? <CircularProgress /> : (
                    currentAuthor ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, mt: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar src={currentAuthor.image || 'https://placehold.co/100'} />
                                <Box>
                                    <Typography fontWeight="bold">{currentAuthor.user.first_name} {currentAuthor.user.last_name}</Typography>
                                    <Typography variant="body2" color="text.secondary">{currentAuthor.organization}</Typography>
                                </Box>
                            </Box>
                            <Button variant="outlined" color="error" size="small" onClick={() => removeAuthorOfTheYear(currentAuthor)}>
                                Remove
                            </Button>
                        </Box>
                    ) : (
                        <Typography sx={{ mt: 2 }} color="text.secondary">No Author of the Year is currently set.</Typography>
                    )
                )}
            </Paper>

            <Paper sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>Set a New Author of the Year</Typography>
                <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Search by Author Name or Organization..."
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
                    {searchResults.map(author => (
                        <Box key={author.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar src={author.image || 'https://placehold.co/100'} />
                                <Box>
                                    <Typography fontWeight="bold">{author.user.first_name} {author.user.last_name}</Typography>
                                    <Typography variant="body2" color="text.secondary">{author.organization}</Typography>
                                </Box>
                            </Box>
                            <Button variant="contained" color="success" size="small" onClick={() => setAsAuthorOfTheYear(author)}>
                                Set as Author of the Year
                            </Button>
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminAuthorOfTheYearPage;