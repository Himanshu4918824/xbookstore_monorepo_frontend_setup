import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
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
  Avatar,
  Container,
  Tooltip,
} from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import StyledDropdown from "../components/StyledDropdown";

import Select from "react-select";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";

import StyledTextField from "../components/StyledTextField";
import StyledReactSelect from "../components/StyledReactSelect"; // <-- IMPORT YOUR NEW COMPONENT

const initialImageRow = { title: "", file: null, preview: "" };
const initialContribution = { contributor: "", chapter_title: "" };

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AdminBookFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // --- STATE MANAGEMENT ---
  const [metaData, setMetaData] = useState({
    publications: [],
    allAuthors: [],
  });
  const [bookType, setBookType] = useState("authored");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isbn: "",
    pages: 0,
    publication: "",
    authors: [],
    editors: [],
  });
  const [contributions, setContributions] = useState([
    { ...initialContribution },
  ]);
  const [imageRows, setImageRows] = useState([
    { title: "Cover Image", file: null, preview: "" },
    { title: "Back Cover", file: null, preview: "" },
    { title: "Side View", file: null, preview: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [headingType, setHeadingType] = useState("Chapter");
  const [numberingStyle, setNumberingStyle] = useState("arabic");

  // --- NEW: State for Category Cascading Dropdowns ---
  const [categoryTree, setCategoryTree] = useState([]);
  const [selectedMainCat, setSelectedMainCat] = useState("");
  const [selectedSubCat, setSelectedSubCat] = useState("");
  const [selectedSubSubCat, setSelectedSubSubCat] = useState("");

  const [open, setOpen] = React.useState(false);

  // --- DATA FETCHING ---
  useEffect(() => {
    setIsLoading(true);
    const fetchMeta = async () => {
      try {
        // Now also fetches categories
        const [metaRes, catRes] = await Promise.all([
          axios.get("/api/books-meta/"),
          axios.get("/api/categories/"),
        ]);
        const authorOptions = metaRes.data.authors.map((author) => ({
          value: author.id,
          label: `${author.author_id} ${author.user.first_name} ${author.user.last_name}`,
        }));
        setMetaData({
          publications: metaRes.data.publications,
          allAuthors: authorOptions,
        });
        setCategoryTree(catRes.data.results || catRes.data);
      } catch (error) {
        console.error("Failed to fetch metadata", error);
      }
    };
    fetchMeta();

    if (isEditing) {
      axios.get(`/api/books/${id}/`).then((response) => {
        const book = response.data;
        const isEditedBook = book.editors && book.editors.length > 0;
        setBookType(isEditedBook ? "edited" : "authored");
        setFormData({
          title: book.title,
          description: book.description,
          isbn: book.isbn,
          pages: book.pages,
          publication: book.publication?.id || "",
          authors: book.authors.map((a) => a.id),
          editors: book.editors.map((e) => e.id),
        });
        if (isEditedBook && book.contributions) {
          setContributions(
            book.contributions.map((c) => ({
              contributor: c.contributor.id,
              chapter_title: c.chapter_title,
            }))
          );
        }
        const existingImages = book.images.map((img) => ({
          title: img.title,
          file: null,
          preview: img.image,
        }));
        if (existingImages.length > 0) setImageRows(existingImages);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [id, isEditing]);

  // --- EVENT HANDLERS ---
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMultiSelectChange = (options, action) =>
    setFormData((prev) => ({
      ...prev,
      [action.name]: options ? options.map((opt) => opt.value) : [],
    }));
  const handleContributionChange = (index, field, value) => {
    const updated = [...contributions];
    updated[index][field] = value;
    setContributions(updated);
  };
  const addContributionRow = () =>
    setContributions([...contributions, { ...initialContribution }]);
  const removeContributionRow = (index) =>
    setContributions(contributions.filter((_, i) => i !== index));
  const handleImageFileChange = (index, file) => {
    const updated = [...imageRows];
    updated[index].file = file;
    updated[index].preview = URL.createObjectURL(file);
    setImageRows(updated);
  };
  const handleImageTitleChange = (index, title) => {
    const updated = [...imageRows];
    updated[index].title = title;
    setImageRows(updated);
  };
  const addImageRow = () =>
    setImageRows([...imageRows, { ...initialImageRow }]);
  const removeImageRow = (index) => {
    if (index > 2) setImageRows(imageRows.filter((_, i) => i !== index));
  };
  const generateNumber = (style, number) => {
    const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    const hindi = [
      "एक",
      "दो",
      "तीन",
      "चार",
      "पाँच",
      "छह",
      "सात",
      "आठ",
      "नौ",
      "दस",
    ];
    if (style === "roman") return roman[number - 1] || number;
    if (style === "hindi") return hindi[number - 1] || number;
    return number;
  };

  // --- NEW: Handlers for Category Dropdowns ---
  const handleMainCatChange = (e) => {
    setSelectedMainCat(e.target.value);
    setSelectedSubCat("");
    setSelectedSubSubCat("");
  };
  const handleSubCatChange = (e) => {
    setSelectedSubCat(e.target.value);
    setSelectedSubSubCat("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // const postData = new FormData();
    const postData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (!["authors", "editors"].includes(key) && formData[key] !== null)
        postData.append(key, formData[key]);
    });

    if (bookType === "authored") {
      formData.authors.forEach((id) => postData.append("authors", id));
    } else {
      formData.editors.forEach((id) => postData.append("editors", id));
      const finalContributions = contributions.flatMap((chapter, index) => {
        const fullChapterTitle = `${headingType} ${generateNumber(
          numberingStyle,
          index + 1
        )}: ${chapter.chapter_title}`;

        // Ensure chapter.contributors is an array before trying to map it
        if (!Array.isArray(chapter.contributors)) {
          return []; // Return an empty array if no contributors are selected for this chapter
        }

        // Create a separate object for each contributor in this chapter
        return chapter.contributors.map((contributorId) => ({
          contributor: contributorId,
          chapter_title: fullChapterTitle,
        }));
      });
      postData.append("contributions", JSON.stringify(finalContributions));
    }
    imageRows.forEach((row, index) => {
      if (row.file) {
        postData.append(`image_${index}_file`, row.file);
        postData.append(`image_${index}_title`, row.title);
      }
    });
    postData.append("image_count", imageRows.length);

    // --- NEW: Append the selected category ---
    let finalCategoryId =
      selectedSubSubCat || selectedSubCat || selectedMainCat;
    if (finalCategoryId) {
      // Our backend expects a list, so we send a list with one item
      postData.append("categories", finalCategoryId);
    }

    console.log("--- SUBMITTING ---");
    console.log("Mode:", isEditing ? "EDIT" : "CREATE");

    const request = isEditing
      ? axios.patch(`/api/books/${id}/`, postData)
      : axios.post("/api/books/", postData);
    request
      .then((response) => {
        console.log("1. API request SUCCEEDED.");
        console.log("2. Full response object:", response);
        console.log("3. Response data:", response.data);

        // Check what the response.data object contains
        if (response.data) {
          console.log("4. 'id' in response.data:", response.data.id);
        } else {
          console.log("4. response.data is empty or null.");
        }

        alert(`Book ${isEditing ? "updated" : "created"} successfully!`);

        const bookId = isEditing ? id : response.data.id;
        console.log("5. Final bookId to be used for navigation:", bookId);

        if (bookId) {
          console.log("6. Navigating to:", `/admin/books/${bookId}/formats`);
          navigate(`/admin/books/${bookId}/formats`);
        } else {
          console.error(
            "7. NAVIGATION BLOCKED because bookId is undefined or null!"
          );
          alert(
            "Operation successful, but could not get new Book ID to navigate. Please go to the book list."
          );
          navigate("/admin/books"); // Navigate to a safe place
        }

        // navigate(`/admin/books/${bookId}/formats`);
      })
      .catch((error) => {
        console.error("--- SUBMISSION FAILED ---");
        console.error("Full error object:", error);
        alert(`Submission failed: ${JSON.stringify(error.response?.data)}`);
      })
      .finally(() => setIsSubmitting(false));
  };

  if (isLoading) return <CircularProgress />;

  // --- Helper variables for cascading dropdowns ---
  const subCategories =
    categoryTree.find((cat) => cat.id == selectedMainCat)?.children || [];
  const subSubCategories =
    subCategories.find((cat) => cat.id == selectedSubCat)?.children || [];

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Button
            component={RouterLink}
            to="/admin/books"
            startIcon={<ArrowBackIcon />}
            sx={{ mr: 2 }}
          >
            Back to Books
          </Button>
          <Typography variant="h6" component="h1">
            {isEditing ? "Edit Book's Core Details" : "Add New Book"}
          </Typography>
        </Box>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={0}
          sx={{
            display: "grid",
            // gridTemplateColumns: { xs: '1fr', md: '40% 60%' },
            bgcolor: "transparent",
          }}
        >
          <Box container spacing={3} sx={{ p: { xs: 2, md: 3 } }}>
            {/* ... (Grid items for Title, ISBN, Pages, Publication, etc.) */}
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, md: 12 }}>
                <StyledTextField
                  fullWidth
                  label="Book's Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="ISBN"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item size={{ xs: 12, md: 2 }}>
                <TextField
                  fullWidth
                  label="Page Count"
                  name="pages"
                  type="number"
                  value={formData.pages}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>Publication</InputLabel>
                  <MuiSelect
                    name="publication"
                    value={formData.publication}
                    label="Publication"
                    onChange={handleChange}
                  >
                    {metaData.publications.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </Grid>
              <Grid item size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Publication Date"
                  name="publication_date"
                  type="date"
                  value={formData.publication_date || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* --- CASCADING CATEGORY SELECTION --- */}
              <Grid item size={{ xs: 12, md: 8 }}>
                {/* <Typography variant="subtitle1" gutterBottom>
                  Book Category
                </Typography> */}
                <Grid container spacing={2}>
                  <Grid item size={{ xs: 12, md: 4 }}>
                    <FormControl fullWidth>
                      <InputLabel>Main Category</InputLabel>
                      <MuiSelect
                        value={selectedMainCat}
                        label="Main Category"
                        onChange={handleMainCatChange}
                      >
                        <MenuItem value="">
                          <em>Select...</em>
                        </MenuItem>
                        {categoryTree.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </Grid>
                  {selectedMainCat && subCategories.length > 0 && (
                    <Grid item size={{ xs: 12, md: 4 }}>
                      <FormControl fullWidth>
                        <InputLabel>Sub-Category</InputLabel>
                        <MuiSelect
                          value={selectedSubCat}
                          label="Sub-Category"
                          onChange={handleSubCatChange}
                        >
                          <MenuItem value="">
                            <em>Select...</em>
                          </MenuItem>
                          {subCategories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                    </Grid>
                  )}
                  {selectedSubCat && subSubCategories.length > 0 && (
                    <Grid item size={{ xs: 12, md: 4 }}>
                      <FormControl fullWidth>
                        <InputLabel>Sub-Sub-Category</InputLabel>
                        <MuiSelect
                          value={selectedSubSubCat}
                          label="Sub-Sub-Category"
                          onChange={(e) => setSelectedSubSubCat(e.target.value)}
                        >
                          <MenuItem value="">
                            <em>Select...</em>
                          </MenuItem>
                          {subSubCategories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>

            {/* ... (Grid items for Book Type, Authors, Contributors, Images, etc.) */}
            <Grid container pt={3} spacing={2}>
              <Grid item size={{ xs: 12, md: 5 }}>
                <Typography variant="h6" component="h1" gutterBottom>
                  Select Book's Ownership Type Authored/Edited :
                </Typography>
              </Grid>
              <Grid item size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  {/* <InputLabel>Book Type</InputLabel> */}
                  <RadioGroup
                    row
                    value={bookType}
                    label="Book Type"
                    onChange={(e) => setBookType(e.target.value)}
                  >
                    <FormControlLabel
                      value="authored"
                      control={<Radio />}
                      label="Authored"
                    />
                    <FormControlLabel
                      value="edited"
                      control={<Radio />}
                      label="Edited"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {bookType === "authored" && (
                <Grid item size={{ xs: 12, md: 4 }}>
                  {/* <Typography variant="subtitle1" gutterBottom>
                    Authors
                  </Typography> */}
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleClickOpen}
                  >
                    Select Author
                  </Button>
                  <Dialog
                    maxWidth="lg"
                    fullWidth
                    open={open}
                    slots={{
                      transition: Transition,
                    }}
                    // keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                  >
                    <DialogTitle>
                      Select{" "}
                      {bookType.charAt(0).toUpperCase() + bookType.slice(1)} for
                      Your Book"
                    </DialogTitle>
                    <DialogContent>
                      <FormControl
                        fullWidth
                        sx={{ mt: 2, minWidth: 120, minHeight: 100 }}
                      >
                        <StyledReactSelect
                          // label="Authors"
                          autoFocus
                          isMulti
                          name="authors"
                          options={metaData.allAuthors}
                          onChange={handleMultiSelectChange}
                          value={metaData.allAuthors.filter((opt) =>
                            formData.authors.includes(opt.value)
                          )}
                          placeholder="Select authors..."
                        />
                      </FormControl>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Disagree</Button>
                      <Button onClick={handleClose}>Agree</Button>
                    </DialogActions>
                  </Dialog>
                  {/* <Select
                    isMulti
                    name="authors"
                    options={metaData.allAuthors}
                    onChange={handleMultiSelectChange}
                    value={metaData.allAuthors.filter((opt) =>
                      formData.authors.includes(opt.value)
                    )}
                  /> */}
                </Grid>
              )}
              {bookType === "edited" && (
                <>
                  <Grid item size={{ xs: 12, md: 4 }}>
                    {/* <Typography variant="subtitle1" gutterBottom>
                    Authors
                  </Typography> */}
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={handleClickOpen}
                    >
                      Select Editors
                    </Button>
                    <Dialog
                      maxWidth="lg"
                      fullWidth
                      open={open}
                      slots={{
                        transition: Transition,
                      }}
                      // keepMounted
                      onClose={handleClose}
                      aria-describedby="alert-dialog-slide-description"
                    >
                      <DialogTitle>
                        Select{" "}
                        {bookType.charAt(0).toUpperCase() + bookType.slice(1)}{" "}
                        for Your Book"
                      </DialogTitle>
                      <DialogContent>
                        <FormControl
                          fullWidth
                          sx={{ mt: 2, minWidth: 120, minHeight: 100 }}
                        >
                          <StyledReactSelect
                            // label="Authors"
                            autoFocus
                            isMulti
                            name="editors"
                            options={metaData.allAuthors}
                            onChange={handleMultiSelectChange}
                            value={metaData.allAuthors.filter((opt) =>
                              formData.editors.includes(opt.value)
                            )}
                            placeholder="Select authors..."
                          />
                        </FormControl>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>Disagree</Button>
                        <Button onClick={handleClose}>Agree</Button>
                      </DialogActions>
                    </Dialog>
                  </Grid>

                  <Grid item size={{ xs: 12, md: 12 }}>
                    <Typography variant="h6" component="h6" gutterBottom>
                      Contributors & Chapters
                    </Typography>
                  </Grid>
                  <Grid item size={{ xs: 12, md: 12 }}>
                    <Grid container spacing={2}>
                      <Grid item size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth sx={{ minWidth: 150 }}>
                          <InputLabel>Heading</InputLabel>
                          <MuiSelect
                            value={headingType}
                            label="Heading"
                            onChange={(e) => setHeadingType(e.target.value)}
                          >
                            <MenuItem value="Chapter">Chapter</MenuItem>
                            <MenuItem value="Unit">Unit</MenuItem>
                            <MenuItem value="अध्याय">अध्याय</MenuItem>
                            <MenuItem value="इकाई">इकाई</MenuItem>
                          </MuiSelect>
                        </FormControl>
                      </Grid>
                      <Grid item size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth>
                          <InputLabel>Numbering</InputLabel>
                          <MuiSelect
                            value={numberingStyle}
                            label="Numbering"
                            onChange={(e) => setNumberingStyle(e.target.value)}
                          >
                            <MenuItem value="arabic">1, 2, 3</MenuItem>
                            <MenuItem value="roman">I, II, III</MenuItem>
                            <MenuItem value="hindi">एक, दो, तीन</MenuItem>
                          </MuiSelect>
                        </FormControl>
                      </Grid>
                    </Grid>
                    {contributions.map((c, i) => (
                      <Grid
                        container
                        spacing={2}
                        key={i}
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                          mb: 1,
                          p: 1,
                          border: "1px solid #eee",
                          borderRadius: 1,
                        }}
                      >
                        <Grid item size={{ xs: 12, md: 2 }}>
                          <Typography
                            sx={{ mr: 1, color: "text.secondary" }}
                          >{`${headingType} ${generateNumber(
                            numberingStyle,
                            i + 1
                          )}:`}</Typography>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 3 }}>
                          <StyledReactSelect
                            autoFocus
                            // isMulti
                            name="contributors"
                            options={metaData.allAuthors}
                            value={metaData.allAuthors.find(
                              (opt) => opt.value === c.contributor
                            )}
                            onChange={(opt) =>
                              handleContributionChange(
                                i,
                                "contributor",
                                opt.value
                              )
                            }
                            styles={{
                              container: (base) => ({ ...base, flexGrow: 1 }),
                            }}
                            placeholder="Select Contributor..."
                          />
                        </Grid>
                        <Grid fullWidth item size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            sx={{ flexGrow: 2 }}
                            label="Chapter Title"
                            value={c.chapter_title}
                            onChange={(e) =>
                              handleContributionChange(
                                i,
                                "chapter_title",
                                e.target.value
                              )
                            }
                          />
                        </Grid>
                        <Tooltip title="Remove Contributor">
                          <IconButton onClick={() => removeContributionRow(i)}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={addContributionRow}
                    >
                      Add Contributor
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Book Images
              </Typography>
              {imageRows.map((row, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    mb: 1,
                    p: 1,
                    border: "1px solid #eee",
                    borderRadius: 1,
                  }}
                >
                  <Avatar src={row.preview || row.image} variant="square" />
                  <TextField
                    label="Image Title"
                    value={row.title}
                    onChange={(e) =>
                      handleImageTitleChange(index, e.target.value)
                    }
                    required
                    disabled={index < 3}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ flexGrow: 2 }}
                  >
                    Upload
                    <input
                      type="file"
                      hidden
                      onChange={(e) =>
                        handleImageFileChange(index, e.target.files[0])
                      }
                    />
                  </Button>
                  {index > 2 && (
                    <IconButton onClick={() => removeImageRow(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button startIcon={<AddIcon />} onClick={addImageRow}>
                Add Image
              </Button>
            </Grid>

            <Grid item xs={12}>
              <TextField
                multiline
                rows={4}
                fullWidth
                label="Description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : isEditing ? (
                  "Save and Manage Formats"
                ) : (
                  "Create Book and Add Formats"
                )}
              </Button>
            </Grid>
          </Box>
        </Paper>
      </Paper>
    </Container>
  );
};

export default AdminBookFormPage;
