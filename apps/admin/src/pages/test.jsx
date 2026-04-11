import React, { useState, useEffect, useRef } from "react";
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
} from "@mui/material";
import { Link } from "react-router-dom";

// --- Icon Imports (Unchanged) ---
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// --- IMPORT YOUR NEW REUSABLE HOOKS ---
import {
  useSpringyHover,
  usePageEntranceAnimation,
  useStaggeredListAnimation,
} from "../components/animationHooks";

const AdminBookManagementPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Refs for Animation Targets ---
  const headerRef = useRef(null);
  const tableRef = useRef(null);

  // --- CALL THE REUSABLE ANIMATION HOOKS ---
  usePageEntranceAnimation([headerRef, tableRef], loading);
  const tableBodyRef = useStaggeredListAnimation(loading, books, "tr");
  const hoverHandlers = useSpringyHover({ scale: 1.2 });

  const fetchBooks = () => {
    setLoading(true);
    // Use the admin endpoint to fetch books
    axios
      .get("/api/books/")
      .then((response) => {
        setBooks(response.data.results || response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      // Use the correct admin endpoint for deleting
      axios
        .delete(`/api/books/${bookId}/`)
        .then(() => {
          alert("Book deleted successfully!");
          fetchBooks();
        })
        .catch((error) => {
          console.error("Error deleting book", error);
          alert("Failed to delete book.");
        });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        ref={headerRef}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Manage Books
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            borderRadius: "8px 0px",
            textTransform: "none",
            fontWeight: "bold",
          }}
          component={Link}
          to="/admin/books/new"
          startIcon={<AddIcon />}
          {...hoverHandlers}
        >
          Add New Book
        </Button>
      </Box>
      <TableContainer
        ref={tableRef}
        component={Paper}
        elevation={3}
        sx={{ borderRadius: "16px", opacity: 0 }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "action.hover" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: "100px" }}>
                Cover
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "80px" }}>
                ISBN
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "80px" }}>
                Book Title
              </TableCell>

              <TableCell sx={{ fontWeight: "bold", width: "80px" }}>
                Publication
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "80px" }}>
                Publication Date
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", width: "80px" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody ref={tableBodyRef}>
            {books.map((book) => (
              <TableRow
                key={book.id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Avatar
                    src={book.images?.[0]?.image || "https://placehold.co/100"}
                  />
                </TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                  {book.title}
                </TableCell>
                <TableCell>{book.publication.name}</TableCell>
                <TableCell>{book.publication_date}</TableCell>
                {/* <TableCell>₹{book.mrp}</TableCell> */}
                <TableCell align="right">
                  <Tooltip title="Edit Publication">
                    {/* Spread the hover handlers onto the button */}
                    <IconButton
                      color="primary"
                      component={Link}
                      to={`/admin/books/edit/${book.id}`}
                      {...hoverHandlers}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Publication">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(book.id)}
                      {...hoverHandlers}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminBookManagementPage;
