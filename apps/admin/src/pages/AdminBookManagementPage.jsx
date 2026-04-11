import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
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
  Tooltip,
  IconButton,
  Avatar,
  Collapse,
  TextField,
  InputAdornment,
  TablePagination,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Grid,
  Drawer,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { format } from "date-fns";

import {
  useSpringyHover,
  usePageEntranceAnimation,
  useStaggeredListAnimation,
} from "../components/animationHooks";

// --- Icon Imports ---
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

// ===================================================================
//  1. Reusable Sub-Component for the Collapsible Row (Unchanged)
// ===================================================================
const BookRow = ({ book, onDelete }) => {
  const [open, setOpen] = useState(false);
  const getParticipantNames = (participants, role) =>
    participants
      ?.filter((p) => p.role === role)
      .sort((a, b) => a.order - b.order)
      .map((p) => `${p.author.user.first_name} ${p.author.user.last_name}`)
      .join(", ") || "N/A";
  return (
    <React.Fragment>
      <TableRow hover sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Avatar src={book.cover_image || ""} variant="rounded" />
        </TableCell>
        <TableCell component="th" scope="row">
          {book.title}
        </TableCell>
        <TableCell>{book.isbn}</TableCell>
        <TableCell>{book.publication?.name || "N/A"}</TableCell>
        <TableCell align="right">
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              component={Link}
              to={`/admin/books/edit/${book.id}`}
              
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => onDelete(book.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 1, p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Authors:</Typography>
                  <Typography variant="body2">
                    {getParticipantNames(book.participants, "author")}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Editors:</Typography>
                  <Typography variant="body2">
                    {getParticipantNames(book.participants, "editor")}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Pages:</Typography>
                  <Typography variant="body2">{book.pages}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Pub. Date:</Typography>
                  <Typography variant="body2">
                    {book.publication_date}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

// ===================================================================
//  2. Main Page Component
// ===================================================================
const AdminBookManagementPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metaData, setMetaData] = useState({
    publications: [],
    categories: [],
  });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // --- Refs for Animation Targets ---
    const headerRef = useRef(null);
    const tableRef = useRef(null);
  
    // --- CALL THE REUSABLE ANIMATION HOOKS ---
    usePageEntranceAnimation([headerRef, tableRef], loading);
    const tableBodyRef = useStaggeredListAnimation(loading, books, "tr");
    const hoverHandlers = useSpringyHover({ scale: 1.2 });

  // --- State for All Filters, Search, and Pagination ---
  const [filters, setFilters] = useState({
    title: "",
    isbn: "",
    participant_name: "",
    publication: "",
    category: "",
    book_type: "",
    publication_date_after: "",
    publication_date_before: "",
    pages_min: "",
    pages_max: "",
  });
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    totalBooks: 0,
  });
  const [debouncedFilters] = useDebounce(filters, 500);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetFilters = () => {
    setFilters({
      title: "",
      isbn: "",
      participant_name: "",
      publication: "",
      category: "",
      book_type: "",
      publication_date_after: "",
      publication_date_before: "",
      pages_min: "",
      pages_max: "",
    });
  };

  const fetchBooks = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: pagination.page + 1,
      page_size: pagination.rowsPerPage,
    });

    // Add active filters to params
    Object.entries(debouncedFilters).forEach(([key, value]) => {
      if (value) {
        // Only add if the filter has a value
        let paramValue = value;
        if (
          ["publication_date_after", "publication_date_before"].includes(key) &&
          value
        ) {
          paramValue = format(new Date(value), "yyyy-MM-dd");
        }
        params.append(key, paramValue);
      }
    });

    axios
      .get(`/api/books/?${params.toString()}`)
      .then((response) => {
        setBooks(response.data.results);
        setPagination((prev) => ({ ...prev, totalBooks: response.data.count }));
      })
      .catch((error) => console.error("Error fetching books", error))
      .finally(() => setLoading(false));
  }, [pagination.page, pagination.rowsPerPage, debouncedFilters]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    axios.get("/api/books-meta/").then((res) => {
      setMetaData({
        publications: res.data.publications || [],
        // Fetch categories from its own endpoint if needed
      });
    });
    axios.get("/api/categories/").then((res) => {
      setMetaData((prev) => ({
        ...prev,
        categories: res.data.results || res.data || [],
      }));
    });
  }, []);

  const handleDelete = (bookId) => {
    if (window.confirm("Are you sure?")) {
      axios
        .delete(`/api/books/${bookId}/`)
        .then(() => {
          alert("Book deleted!");
          fetchBooks();
        })
        .catch(() => alert("Failed to delete book."));
    }
  };

  const handleChangePage = (e, newPage) =>
    setPagination((prev) => ({ ...prev, page: newPage }));
  const handleChangeRowsPerPage = (e) =>
    setPagination((prev) => ({
      ...prev,
      rowsPerPage: parseInt(e.target.value, 10),
      page: 0,
    }));

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Book Management</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setFilterDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            Filters
          </Button>
          <Button
            variant="contained"
            component={Link}
            to="/admin/books/new"
            startIcon={<AddIcon />}
            {...hoverHandlers}
          >
            Add New Book
          </Button>
        </Box>
      </Box>

      {/* --- Filter Drawer --- */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      >
        <Box sx={{ width: 350, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filter Books
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="title"
                label="Title"
                value={filters.title}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="isbn"
                label="ISBN"
                value={filters.isbn}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="participant_name"
                label="Author/Editor Name"
                value={filters.participant_name}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Publication</InputLabel>
                <Select
                  name="publication"
                  value={filters.publication}
                  label="Publication"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">
                    <em>Any</em>
                  </MenuItem>
                  {metaData.publications?.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={filters.category}
                  label="Category"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">
                    <em>Any</em>
                  </MenuItem>
                  {metaData.categories?.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Book Type</InputLabel>
                <Select
                  name="book_type"
                  value={filters.book_type}
                  label="Book Type"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">
                    <em>Any</em>
                  </MenuItem>
                  <MenuItem value="authored">Authored</MenuItem>
                  <MenuItem value="edited">Edited</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="pages_min"
                label="Min Pages"
                type="number"
                value={filters.pages_min}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="pages_max"
                label="Max Pages"
                type="number"
                value={filters.pages_max}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="publication_date_after"
                label="Published After"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={filters.publication_date_after}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="publication_date_before"
                label="Published Before"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={filters.publication_date_before}
                onChange={handleFilterChange}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Button onClick={resetFilters} fullWidth>
              Reset Filters
            </Button>
          </Box>
        </Box>
      </Drawer>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <TableContainer ref={tableBodyRef}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "action.hover" }}>
                  <TableCell sx={{ width: "5%" }} />
                  <TableCell>Cover</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>ISBN</TableCell>
                  <TableCell>Publication</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.map((book) => (
                  <BookRow key={book.id} book={book} onDelete={handleDelete} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={pagination.totalBooks}
            rowsPerPage={pagination.rowsPerPage}
            page={pagination.page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
};

export default AdminBookManagementPage;
