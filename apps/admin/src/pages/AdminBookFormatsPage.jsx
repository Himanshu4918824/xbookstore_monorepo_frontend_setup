import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
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
  Card,
  CardContent,
  Divider,
  Stack,
  Chip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalculateIcon from "@mui/icons-material/Calculate";
import SaveIcon from "@mui/icons-material/Save";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import InventoryIcon from "@mui/icons-material/Inventory";
import API from "../utils/axiosConfig";

const AdminBookFormatsPage = () => {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [formats, setFormats] = useState([]);
  const [metaData, setMetaData] = useState({ paperSizes: [], languages: [], paper_quality: [], printing_quality: [] });

  const [newFormatData, setNewFormatData] = useState({
    paper_size: "",
    paper_quality: "",
    printing_quality: "",
    binding_type: "Paperback",
    language: "",
    weight_grams: 0,
    length_mm: 0,
    width_mm: 0,
    stock: 0,
  });

  const [calculatedMrp, setCalculatedMrp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [bookRes, metaRes] = await Promise.all([
        API.get(`/api/books/${id}/formats`),
        API.get(`/api/books-meta`)
      ]);
      setBook(bookRes.data);
      setFormats(bookRes.data.format || bookRes.data || []);

      const languages = metaRes.data.languages || [];
      setMetaData({
        paperSizes: metaRes.data.paper_sizes || [],
        languages: languages,
        paper_quality: metaRes.data.paper_qualities || [],
        printing_quality: metaRes.data.printing_qualities || []
      });

      if (languages.length > 0) {
        const englishLang = languages.find((lang) => lang.name === "English");
        setNewFormatData((prev) => ({
          ...prev,
          language: englishLang ? englishLang.id : languages[0].id
        }));
      }

    } catch (error) {
      console.error("Error loading layout metadata configuration:", error);
      alert("Failed to load page configuration details.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewFormatData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "paper_size" && value) {
        const matchingSize = metaData.paperSizes.find(s => s.id === value);
        if (matchingSize) {
          updated.length_mm = matchingSize.length_mm || updated.length_mm;
          updated.width_mm = matchingSize.width_mm || updated.width_mm;
        }
      }
      return updated;
    });
  };

  const handleCalculateMrp = async () => {
    const targetPages = parseInt(book?.pages, 10);

    if (!newFormatData.paper_size || !newFormatData.binding_type || isNaN(targetPages) || targetPages <= 0) {
      alert("Please ensure you have a selected Paper Size, Binding Type, and valid Page Count.");
      return;
    }
    setIsCalculating(true);
    try {
      const response = await API.post("/api/price/calculate/", {
        page_count: targetPages,
        paper_size_id: Number(newFormatData.paper_size),
        binding_type: newFormatData.binding_type,
        paper_quality_name: newFormatData.paper_quality,
        printing_quality_name: newFormatData.printing_quality,
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

    API.post(`/api/admin/book-formats/`, payload)
      .then(() => {
        alert("New format saved successfully!");
        fetchInitialData();
        setNewFormatData({
          paper_size: "",
          paper_quality: "",
          printing_quality: "",
          binding_type: "Paperback",
          language: newFormatData.language,
          weight_grams: 200,
          length_mm: 0,
          width_mm: 0,
          stock: 0,
        });
        setCalculatedMrp(null);
      })
      .catch((error) =>
        alert(`Failed to save format: ${JSON.stringify(error.response?.data || error.message)}`)
      )
      .finally(() => setIsSubmitting(false));
  };

  const handleDeleteFormat = (formatId) => {
    if (window.confirm("Are you sure you want to delete this format?")) {
      API.delete(`/api/admin/book-formats/${formatId}/`)
        .then(() => {
          alert("Format deleted.");
          fetchInitialData();
        })
        .catch(() => alert("Failed to delete format."));
    }
  };

  if (isLoading || !book)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={48} thickness={4} />
      </Box>
    );

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, margin: "0 auto" }}>
      {/* Top Action Header Bar */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Button
          component={RouterLink}
          to={`/admin/books/${id}`}
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          color="inherit"
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Back to Details
        </Button>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <MenuBookIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant={{ xs: "h6", md: "h5" }} fontWeight="800" color="text.primary">
            Formats: {book.title}
          </Typography>
        </Stack>
      </Stack>

      {/* Main Grid Wrapper */}
      <Grid container spacing={{ xs: 3, md: 4 }}>

        {/* Left Hand: Configured Elements Column */}
        <Grid item xs={12} lg={5}>
          <Typography variant="subtitle1" fontWeight="800" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            Configured Options <Chip label={formats.length} size="small" color="primary" />
          </Typography>

          <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxHeight: { xs: "auto", lg: "calc(100vh - 240px)" },
            overflowY: { xs: "visible", lg: "auto" },
            pr: { xs: 0, lg: 1 }
          }}>
            {formats.map((format) => (
              <Card
                key={format.id}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  transition: "all 0.2s ease",
                  "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderColor: "primary.main" }
                }}
              >
                <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                    <Box>
                      <Typography variant="body1" fontWeight="700" color="text.primary">
                        {format.format_name || `${format.binding_type}`}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                        <InventoryIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          Stock Availability: <strong>{format.stock} units</strong>
                        </Typography>
                      </Stack>
                    </Box>

                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Typography variant="h6" fontWeight="800" color="primary.main">
                        ₹{format.mrp}
                      </Typography>
                      <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
                      <IconButton
                        onClick={() => handleDeleteFormat(format.id)}
                        color="error"
                        size="small"
                        sx={{ border: '1px solid', borderColor: 'error.lighter', bgcolor: 'error.50' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}

            {formats.length === 0 && (
              <Paper variant="outlined" sx={{ p: 6, textAlign: "center", borderRadius: 3, borderStyle: "dashed" }}>
                <Typography color="text.secondary" fontWeight="500">No layout formats configured yet.</Typography>
              </Paper>
            )}
          </Box>
        </Grid>

        {/* Right Hand: Dynamic Generation Context Form Panel */}
        <Grid item xs={12} lg={7}>
          <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 4, bgcolor: "background.paper" }}>
            <Typography variant="subtitle1" fontWeight="800" sx={{ mb: 3 }}>
              Generate Format Instance Layout
            </Typography>

            <Box component="form" onSubmit={handleAddFormat}>
              <Grid container spacing={2.5}>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel shrink={newFormatData.paper_size !== ""}>Paper Size Dimension Blueprint</InputLabel>
                    <MuiSelect
                      name="paper_size"
                      value={newFormatData.paper_size}
                      label="Paper Size Dimension Blueprint"
                      onChange={handleChange}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Select Blueprint</MenuItem>
                      {metaData.paperSizes.map((s) => (
                        <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel shrink={newFormatData.paper_quality !== ""}>Paper Quality Core</InputLabel>
                    <MuiSelect
                      name="paper_quality"
                      value={newFormatData.paper_quality}
                      label="Paper Quality Core"
                      onChange={handleChange}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Select Quality GSM</MenuItem>
                      {metaData.paper_quality.map((s, i) => (
                        <MenuItem key={i} value={s}>{s}</MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel shrink={newFormatData.printing_quality !== ""}>Color & Print Matrix Profile</InputLabel>
                    <MuiSelect
                      name="printing_quality"
                      value={newFormatData.printing_quality}
                      label="Color & Print Matrix Profile"
                      onChange={handleChange}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Select Density Scale</MenuItem>
                      {metaData.printing_quality.map((s, i) => (
                        <MenuItem key={i} value={s}>{s}</MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Enclosure Structure Binding</InputLabel>
                    <MuiSelect
                      name="binding_type"
                      value={newFormatData.binding_type}
                      label="Enclosure Structure Binding"
                      onChange={handleChange}
                    >
                      <MenuItem value="Paperback">Paperback Option</MenuItem>
                      <MenuItem value="Hardcover">Hardcover Premium</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Localization Language Mapping</InputLabel>
                    <MuiSelect
                      name="language"
                      value={newFormatData.language}
                      label="Localization Language Mapping"
                      onChange={handleChange}
                    >
                      {metaData.languages.map((lang) => (
                        <MenuItem key={lang.id} value={lang.id}>{lang.name}</MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Physical Weight Metrics (grams)"
                    name="weight_grams"
                    type="number"
                    value={newFormatData.weight_grams}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Length (mm)"
                    name="length_mm"
                    type="number"
                    value={newFormatData.length_mm}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Width (mm)"
                    name="width_mm"
                    type="number"
                    value={newFormatData.width_mm}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Initial Stock"
                    name="stock"
                    type="number"
                    value={newFormatData.stock}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Computational Cost Assessment Field */}
                <Grid item xs={12}>
                  <Box sx={{
                    mt: 1, p: 2.5, borderRadius: 3,
                    backgroundColor: calculatedMrp !== null ? "rgba(25, 118, 210, 0.04)" : "action.hover",
                    border: "1px dashed", borderColor: calculatedMrp !== null ? "primary.main" : "divider",
                    display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2
                  }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ textTransform: 'uppercase', tracking: 0.5 }}>Calculated Retail Value</Typography>
                      <Typography variant="h4" fontWeight="900" color={calculatedMrp !== null ? "primary.main" : "text.disabled"}>
                        {calculatedMrp !== null ? `₹${calculatedMrp}` : "—"}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleCalculateMrp}
                      disabled={isCalculating}
                      startIcon={isCalculating ? <CircularProgress size={16} color="inherit" /> : <CalculateIcon />}
                      sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
                    >
                      Run Cost Computation
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isSubmitting || calculatedMrp === null}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    sx={{ py: 1.8, borderRadius: 3, textTransform: "none", fontWeight: "700", boxShadow: 'none' }}
                  >
                    Commit & Synchronize System Format
                  </Button>
                </Grid>

              </Grid>
            </Box>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default AdminBookFormatsPage;