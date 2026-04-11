import React, { useState, useMemo } from 'react';
import { Box, Typography, Container, Breadcrumbs, Link as MuiLink, ToggleButtonGroup, ToggleButton, TextField, InputAdornment } from '@mui/material';
import { Link } from 'react-router-dom';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import SearchIcon from '@mui/icons-material/Search';
import BookFilter from '../components/book/BookFilter';
import BookDisplay from '../components/book/BookDisplay'; // We will still use this for clean code
import { useContext } from 'react';
// import the actual context object or hook, not the provider component
import { ApiContext } from '../context/ApiProvider';
import { useEffect } from 'react';
// alternatively you could use: import { useApi } from '../context/ApiProvider';

// --- MOCK DATA (no changes here) ---
const mockBooks = [];
const mockPublishers = [{ id: 1, name: 'Starlight Press' }, { id: 2, name: 'Quantum Books' }, { id: 3, name: 'Heritage Publishing' }, { id: 4, name: 'Crimson Quill' }];
const mockCategories = [{ id: 1, name: 'Books', level: 0, children: [{ id: 2, name: 'Test Preparation', level: 1, children: [{ id: 3, name: 'Engineering Entrance', level: 2, children: [] }, { id: 4, name: 'Medical Entrance', level: 2, children: [] },] }, { id: 5, name: 'Literature & Fiction', level: 1, children: [] }] }];
const mockBindings = ['Paperback', 'Hardcover', 'Spiral Binding'];
const mockPaperSizes = ['A4', 'A5', 'B5'];
const mockPaperQualities = ['70GSM', '80GSM Matte', '120GSM Glossy'];
// --- END MOCK DATA ---

function StorePage() {
  // ---import functions from context and api service (no changes here)---

  const { books, fetchAllBooks } = useContext(ApiContext);
  // const { fetchAllBooks } = useApi(); // if you prefer the hook

  // fetchAllBooks returns a promise – log when it resolves
  useEffect(() => {
    fetchAllBooks()
  }, []);
  // console.log(books)

  // --- STATE MANAGEMENT (no changes here) ---
  const [layout, setLayout] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const [rating, setRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const handleLayoutChange = (event, newLayout) => { if (newLayout !== null) setLayout(newLayout); };
  const handlePriceChange = (event, newValue) => { setPriceRange(newValue); };
  const handlePublisherChange = (event) => { const { name, checked } = event.target; setSelectedPublishers(prev => checked ? [...prev, name] : prev.filter(pub => pub !== name)); };
  const handleRatingChange = (newRating) => { setRating(prev => prev === newRating ? 0 : newRating); };
  const handleSearchChange = (event) => { setSearchTerm(event.target.value); };
  // prefer `books` from context but fall back to mock data while loading
  const dataBooks = (books && books.length) ? books : mockBooks;

  const filteredBooks = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return dataBooks
      .filter(book => book.price >= priceRange[0] && book.price <= priceRange[1])
      .filter(book => selectedPublishers.length === 0 || selectedPublishers.includes(book.publisher))
      .filter(book => book.rating >= rating)
      .filter(book => searchTerm === '' || book.title.toLowerCase().includes(lowercasedSearchTerm) || book.author.toLowerCase().includes(lowercasedSearchTerm));
  }, [dataBooks, priceRange, selectedPublishers, rating, searchTerm]);


  // --- END STATE MANAGEMENT ---
  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {/* This is our new, stable, flexbox-based two-column layout. It cannot wrap. */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>

        {/* Column 1: Filter Sidebar */}
        {/* We give it a specific width and tell it not to shrink. */}
        <Box sx={{ width: { xs: '100%', md: '25%' }, flexShrink: 0 }}>
          <BookFilter categories={mockCategories} priceRange={priceRange} onPriceChange={handlePriceChange} publishers={mockPublishers} selectedPublishers={selectedPublishers} onPublisherChange={handlePublisherChange} rating={rating} onRatingChange={handleRatingChange} bindings={mockBindings} paperSizes={mockPaperSizes} paperQualities={mockPaperQualities} />
        </Box>

        {/* Column 2: Main Content Area */}
        {/* This box will automatically grow to fill the remaining space. */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}> {/* minWidth: 0 is a flexbox trick to prevent overflow */}
          {/* Header section (Breadcrumbs, Search, Toggles) */}
          <Box sx={{ mb: 2 }}>
            <Breadcrumbs aria-label="breadcrumb">
              <MuiLink component={Link} sx={{ color:"#D8CFC2"}} to="/" color="inherit">Home</MuiLink>
              <Typography color="white">Books</Typography>
            </Breadcrumbs>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mt: 2}}>
              


              <TextField
                variant="outlined"
                placeholder="Search by Title, Author, ISBN..."
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{
                  flexGrow: 1,

                  /* Outer field */
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    transition: 'all 0.3s ease',

                    /* Default border */
                    '& fieldset': {
                      borderColor: 'divider',
                    },

                    /* Hover */
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },

                    /* Focus */
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: '2px',
                      boxShadow: (theme) =>
                        theme.palette.mode === 'dark'
                          ? '0 0 0 3px rgba(212, 183, 104, 0.25)'  // warm gold glow
                          : '0 0 0 3px rgba(75, 46, 43, 0.15)',   // walnut glow
                    },
                  },

                  /* Placeholder */
                  '& .MuiInputBase-input::placeholder': {
                    color: 'text.secondary',
                    opacity: 0.7,
                  },

                  /* Icon color */
                  '& .MuiInputAdornment-root svg': {
                    color: 'text.secondary',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />



              <ToggleButtonGroup
                value={layout}
                exclusive
                onChange={handleLayoutChange}
                sx={{
                  backgroundColor: 'background.paper',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: 'divider',
                  overflow: 'hidden',

                  '& .MuiToggleButtonGroup-grouped': {
                    border: 'none',
                  },
                }}
              >
                <ToggleButton
                  value="grid"
                  sx={{
                    px: 2,
                    py: 1,
                    transition: 'all 0.3s ease',
                    color: 'text.secondary',

                    '&.Mui-selected': {
                      color: 'primary.contrastText',
                      backgroundColor: 'primary.main',
                    },

                    '&.Mui-selected:hover': {
                      backgroundColor: 'primary.main',
                    },

                    '&:hover': {
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(212, 183, 104, 0.08)'
                          : 'rgba(75, 46, 43, 0.08)',
                    },
                  }}
                >
                  <ViewModuleIcon />
                </ToggleButton>

                <ToggleButton
                  value="list"
                  sx={{
                    px: 2,
                    py: 1,
                    transition: 'all 0.3s ease',
                    color: 'text.secondary',

                    '&.Mui-selected': {
                      color: 'primary.contrastText',
                      backgroundColor: 'primary.main',
                    },

                    '&.Mui-selected:hover': {
                      backgroundColor: 'primary.main',
                    },

                    '&:hover': {
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(212, 183, 104, 0.08)'
                          : 'rgba(75, 46, 43, 0.08)',
                    },
                  }}
                >
                  <ViewListIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Typography component="p" color="#D8CFC2" sx={{ mt: 1 }}>
              Showing {filteredBooks.length} products
            </Typography>
          </Box>

          {/* We render our isolated BookDisplay component here */}
          <BookDisplay books={filteredBooks} layout={layout} />
        </Box>
      </Box>
    </Container>
  );
}

export default StorePage;