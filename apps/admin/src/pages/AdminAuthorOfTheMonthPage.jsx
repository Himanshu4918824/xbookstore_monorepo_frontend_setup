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

const AdminAuthorOfTheMonthPage = () => {
    const [currentAuthor, setCurrentAuthor] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const fetchAuthorOfTheMonth = () => {
        setLoading(true);
        axios.get('/api/admin/authors/?is_author_of_the_month=true')
            .then(response => {
                setCurrentAuthor(response.data.results?.[0] || null);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching Author of the Month", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchAuthorOfTheMonth();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm) return;
        setIsSearching(true);
        axios.get(`/api/admin/authors/?search=${searchTerm}`)
            .then(response => {
                const newResults = response.data.results.filter(
                    result => result.id !== currentAuthor?.id
                );
                setSearchResults(newResults);
            })
            .finally(() => setIsSearching(false));
    };

    const setAsAuthorOfTheMonth = (author) => {
        axios.patch(`/api/authors/${author.id}/toggle-aotm/`, { is_author_of_the_month: true })
            .then(() => {
                alert(`"${author.user.first_name} ${author.user.last_name}" is now the new Author of the Month.`);
                fetchAuthorOfTheMonth();
                setSearchTerm('');
                setSearchResults([]);
            })
            .catch(() => alert('Failed to set new Author of the Month.'));
    };

    const removeAuthorOfTheMonth = (author) => {
        axios.patch(`/api/authors/${author.id}/toggle-aotm/`, { is_author_of_the_month: false })
            .then(() => {
                alert(`"${author.user.first_name} ${author.user.last_name}" is no longer the Author of the Month.`);
                setCurrentAuthor(null);
            })
            .catch(() => alert('Failed to remove Author of the Month.'));
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Manage Author of the Month</Typography>

            <Paper sx={{ p: 2, mb: 4 }}>
                <Typography variant="h5" gutterBottom>Current Author of the Month</Typography>
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
                            <Button variant="outlined" color="error" size="small" onClick={() => removeAuthorOfTheMonth(currentAuthor)}>
                                Remove
                            </Button>
                        </Box>
                    ) : (
                        <Typography sx={{ mt: 2 }} color="text.secondary">No Author of the Month is currently set.</Typography>
                    )
                )}
            </Paper>

            <Paper sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>Set a New Author of the Month</Typography>
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
                            <Button variant="contained" color="success" size="small" onClick={() => setAsAuthorOfTheMonth(author)}>
                                Set as Author of the Month
                            </Button>
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminAuthorOfTheMonthPage;