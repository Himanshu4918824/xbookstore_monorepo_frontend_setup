import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Paper,
  Typography,
  TextField,
  CircularProgress,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AdminBookFormatsPage = () => {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [formats, setFormats] = useState([]);
  const [metaData, setMetaData] = useState({ paperSizes: [], languages: [] });
  
  const [newFormatData, setNewFormatData] = useState({
    paper_size: "",
    binding_type: "Paperback",
    language: "", // Initial language ID is an empty string
    weight_grams: 200,
    length_mm: 210,
    width_mm: 148,
    stock: 0,
  });

  const [calculatedMrp, setCalculatedMrp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBookData = useCallback(() => {
    setIsLoading(true);
    axios.get(`/api/books/${id}/`).then((res) => {
      setBook(res.data);
      setFormats(res.data.formats);
      setIsLoading(false);
    });
  }, [id]);

  useEffect(() => {
    axios.get("/api/books-meta/").then((res) => {
      const languages = res.data.languages || [];
      setMetaData({ 
        paperSizes: res.data.paper_sizes || [],
        languages: languages
      });

      // After fetching languages, find "English" and set its ID as the default
      // for the 'Add New Format' form.
      if (languages.length > 0) {
        const englishLang = languages.find(lang => lang.name === "English");
        if (englishLang) {
          setNewFormatData(prev => ({ ...prev, language: englishLang.id }));
        } else {
          // If "English" isn't found, default to the first language in the list
          setNewFormatData(prev => ({ ...prev, language: languages[0].id }));
        }
      }
    });
    fetchBookData();
  }, [fetchBookData]);

  const handleChange = (e) =>
    setNewFormatData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCalculateMrp = async () => {
    if (!newFormatData.paper_size || !newFormatData.binding_type || !book?.pages) {
      alert("Please select a Paper Size and Binding Type.");
      return;
    }
    setIsCalculating(true);
    try {
      const response = await axios.post("/api/price/calculate/", {
        page_count: book.pages,
        paper_size_id: newFormatData.paper_size,
        binding_type: newFormatData.binding_type,
      });
      setCalculatedMrp(response.data.mrp);
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || "Could not calculate price."}`);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleAddFormat = (e) => {
    e.preventDefault();
    if (calculatedMrp === null) {
      alert("Please calculate the MRP before saving.");
      return;
    }
    setIsSubmitting(true);
    const payload = { ...newFormatData, mrp: calculatedMrp, book: id };

    axios
      .post(`/api/admin/book-formats/`, payload)
      .then(() => {
        alert("New format saved successfully!");
        fetchBookData(); // Refresh all data
        // Reset the form, keeping the default language ID
        const defaultLangId = newFormatData.language;
        setNewFormatData({
          paper_size: "",
          binding_type: "Paperback",
          language: defaultLangId,
          weight_grams: 200,
          length_mm: 210,
          width_mm: 148,
          stock: 0,
        });
        setCalculatedMrp(null);
      })
      .catch((error) =>
        alert(`Failed to save format: ${JSON.stringify(error.response.data)}`)
      )
      .finally(() => setIsSubmitting(false));
  };

  const handleDeleteFormat = (formatId) => {
    if (window.confirm("Are you sure you want to delete this format?")) {
      axios
        .delete(`/api/admin/book-formats/${formatId}/`)
        .then(() => {
          alert("Format deleted.");
          fetchBookData();
        })
        .catch(() => alert("Failed to delete format."));
    }
  };

  if (isLoading || !book)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Paper sx={{ p: 3, borderRadius: 4 }}>
      <Button component={RouterLink} to={`/admin/books/${id}`} startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Core Book Details
      </Button>

      <Typography variant="h4" gutterBottom>Manage Formats for "{book.title}"</Typography>
      
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Existing Formats</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {formats.map((format) => (
          <Paper key={format.id} variant="outlined" sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography fontWeight="bold">{format.format_name}</Typography>
              <Typography variant="body2" color="text.secondary">MRP: ₹{format.mrp} | Stock: {format.stock}</Typography>
            </Box>
            <Box>
              <IconButton disabled><EditIcon /></IconButton>
              <IconButton onClick={() => handleDeleteFormat(format.id)}><DeleteIcon color="error" /></IconButton>
            </Box>
          </Paper>
        ))}
        {formats.length === 0 && (<Typography color="text.secondary">No formats have been added yet.</Typography>)}
      </Box>

      <Box component="form" onSubmit={handleAddFormat} sx={{ mt: 4, borderTop: 1, borderColor: 'divider', pt: 4 }}>
        <Typography variant="h6" gutterBottom>Add New Format</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth required>
              <InputLabel>Paper Size & Quality</InputLabel>
              <MuiSelect name="paper_size" value={newFormatData.paper_size} label="Paper Size & Quality" onChange={handleChange}>
                {metaData.paperSizes.map((s) => (<MenuItem key={s.id} value={s.id}>{s.display_name}</MenuItem>))}
              </MuiSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Binding Type</InputLabel>
              <MuiSelect name="binding_type" value={newFormatData.binding_type} label="Binding Type" onChange={handleChange}>
                <MenuItem value="Paperback">Paperback</MenuItem>
                <MenuItem value="Hardcover">Hardcover</MenuItem>
              </MuiSelect>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth required>
              <InputLabel>Language</InputLabel>
              <MuiSelect
                name="language"
                value={newFormatData.language}
                label="Language"
                onChange={handleChange}
              >
                {metaData.languages.map((lang) => (
                  <MenuItem key={lang.id} value={lang.id}>
                    {lang.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}><TextField fullWidth label="Weight (g)" name="weight_grams" type="number" value={newFormatData.weight_grams} onChange={handleChange}/></Grid>
          <Grid item xs={12} sm={3}><TextField fullWidth label="Length (mm)" name="length_mm" type="number" value={newFormatData.length_mm} onChange={handleChange}/></Grid>
          <Grid item xs={12} sm={3}><TextField fullWidth label="Width (mm)" name="width_mm" type="number" value={newFormatData.width_mm} onChange={handleChange}/></Grid>
          <Grid item xs={12} sm={3}><TextField fullWidth label="Initial Stock" name="stock" type="number" value={newFormatData.stock} onChange={handleChange}/></Grid>
          
          <Grid item xs={12}>
            <Button variant="outlined" onClick={handleCalculateMrp} disabled={isCalculating}>
              {isCalculating ? <CircularProgress size={24} /> : "Calculate MRP"}
            </Button>
          </Grid>
          {calculatedMrp !== null && (
            <Grid item xs={12}>
              <Typography variant="h6" color="primary">Calculated MRP: ₹{calculatedMrp}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" disabled={isSubmitting || calculatedMrp === null}>
              Save New Format
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AdminBookFormatsPage;