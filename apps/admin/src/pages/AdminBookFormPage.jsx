import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

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
// import { components } from "react-select";
import { Checkbox } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";

import StyledTextField from "../components/StyledTextField";
import StyledReactSelect from "../components/StyledReactSelect"; // <-- IMPORT YOUR NEW COMPONENT
import API from "../utils/axiosConfig";

// --- NEW & CORRECTED Custom Component ---
const CustomAuthorOption = (props) => {
  const { data, isSelected, innerProps } = props;
  const latestHistory =
    data.history && data.history.length > 0 ? data.history[0] : null;

  // 'innerProps' contains all the event handlers and ARIA attributes.
  // We apply them to our root element to make it behave like a real option.
  return (
    <Box
      {...innerProps} // <-- THE FIX IS HERE. Apply react-select's props to this Box.
      sx={{
        p: 1,
        display: "flex",
        alignItems: "center",
        // Add a hover effect to mimic the default behavior
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        {/* Checkbox */}
        <Grid item xs={1} sx={{ textAlign: "center" }}>
          <Checkbox checked={isSelected} readOnly sx={{ p: 0 }} />
        </Grid>

        {/* Avatar, Name, and Author ID */}
        <Grid item xs={4} sx={{ display: "flex", alignItems: "center" }}>
          <Avatar src={data.image} sx={{ mr: 1.5 }} />
          <Box>
            <Typography
              noWrap
              variant="body1"
              sx={{ fontWeight: 500, lineHeight: 1.3 }}
            >
              {data.label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {data.author_id}
            </Typography>
          </Box>
        </Grid>

        {/* Designation */}
        <Grid item xs={4}>
          <Typography variant="body2" color="text.secondary">
            {latestHistory ? latestHistory.designation : "N/A"}
          </Typography>
        </Grid>

        {/* Organization */}
        <Grid item xs={3}>
          <Typography variant="body2" color="text.secondary">
            {latestHistory ? latestHistory.organization : "N/A"}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

const ReorderableList = ({ items, onDragEnd, listId }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={listId}>
        {(provided) => (
          <List {...provided.droppableProps} ref={provided.innerRef}>
            {items.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={String(item.id)}
                index={index}
              >
                {(provided) => (
                  <ListItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={{
                      border: "1px solid #ddd",
                      mb: 1,
                      borderRadius: 1,
                      bgcolor: "background.paper",
                    }}
                  >
                    <DragIndicatorIcon sx={{ mr: 1, cursor: "grab" }} />
                    <ListItemAvatar>
                      <Avatar src={item.image} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.label}
                      secondary={item.author_id}
                    />
                  </ListItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const initialImageRow = { title: "", file: null, preview: "" };
// const initialContribution = { contributors: [], chapter_title: "" };

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

  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedEditors, setSelectedEditors] = useState([]);

  const [chapters, setChapters] = useState([]);
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

  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    title: "",
    targetField: null, // 'authors', 'editors', ya 'contributors'
    chapterIndex: null, // Sirf contributors ke liye
  });

  // Yeh state dialog ke andar ki temporary selection ko store karega
  const [tempSelection, setTempSelection] = useState([]);

  // --- DATA FETCHING ---
  useEffect(() => {
    // This is a single, async function to manage all data fetching.
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Metadata first (authors, publications, categories)
        // This is essential because we need the list of all authors to populate our states later.
        const [metaRes, catRes] = await Promise.all([
          API.get("/api/books-meta/"),
          API.get("/api/categories/"),
        ]);

        // Prepare the master list of all authors with the 'value' and 'label' fields
        // that react-select needs. We keep the full object for our UI.
        const allAuthorsWithOptions = metaRes.data.authors.map((author) => ({
          ...author,
          value: author.id,
          label: `${author.user.first_name} ${author.user.last_name}`,
        }));

        setMetaData({
          publications: metaRes.data.publications,
          allAuthors: allAuthorsWithOptions,
        });
        setCategoryTree(catRes.data.results || catRes.data);

        // 2. If we are in "Edit Mode", now fetch the specific book's data.
        // We do this *after* fetching metadata to avoid race conditions.
        if (isEditing) {
          const bookRes = await API.get(`/api/books/${id}/`);
          const book = bookRes.data;

          // 3. Populate the state based on the new API response structure.

          // A. Process participants (main authors/editors)
          const authorsFromApi =
            book.participants?.filter((p) => p.role === "author") || [];
          const editorsFromApi =
            book.participants?.filter((p) => p.role === "editor") || [];

          // Set the book type based on who is present
          setBookType(editorsFromApi.length > 0 ? "edited" : "authored");

          // Find the full author objects from our master list and set them in state, respecting order.
          setSelectedAuthors(
            authorsFromApi
              .sort((a, b) => a.order - b.order)
              .map((p) =>
                allAuthorsWithOptions.find((opt) => opt.value === p.author.id)
              )
              .filter(Boolean) // Filter out any potential nulls
          );
          setSelectedEditors(
            editorsFromApi
              .sort((a, b) => a.order - b.order)
              .map((p) =>
                allAuthorsWithOptions.find((opt) => opt.value === p.author.id)
              )
              .filter(Boolean)
          );

          // --- THIS IS THE CORRECTED CHAPTER LOGIC ---
          if (book.chapters && book.chapters.length > 0) {
            const sortedChapters = book.chapters.sort((a, b) => a.order - b.order);

            // A. Auto-detect Heading and Numbering from the first chapter
            const firstChapterTitle = sortedChapters[0].title;
            const titleParts = firstChapterTitle.split(' ');
            
            if (titleParts.length > 1) {
              const detectedHeading = titleParts[0]; // e.g., "Chapter", "Unit", "अध्याय"
              const detectedNumber = titleParts[1].replace(':', ''); // e.g., "1", "I", "एक"

              // Set the detected heading type if it's a valid option
              const validHeadings = ["Chapter", "Unit", "अध्याय", "इकाई"];
              if (validHeadings.includes(detectedHeading)) {
                setHeadingType(detectedHeading);
              }

              // Set the detected numbering style
              if (/^[IVXLCDM]+$/i.test(detectedNumber)) setNumberingStyle('roman');
              else if (['एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस'].includes(detectedNumber)) setNumberingStyle('hindi');
              else setNumberingStyle('arabic');
            }

            // B. Populate the chapters state with CLEAN, raw titles
            const populatedChapters = sortedChapters.map(apiChapter => {
              // This regex is more robust. It finds the first colon followed by a space
              // and takes everything after it as the raw title.
              const match = apiChapter.title.match(/(?<=:\s).*/);
              const rawTitle = match ? match[0] : apiChapter.title;

              return {
                title: rawTitle, // Store ONLY the clean title
                contributors: apiChapter.contributions
                  .sort((a, b) => a.order - b.order)
                  .map(apiContrib => allAuthorsWithOptions.find(opt => opt.value === apiContrib.contributor.id))
                  .filter(Boolean)
              };
            });
            setChapters(populatedChapters);
          }

          // C. Set simple form data
          setFormData({
            title: book.title || "",
            description: book.description || "",
            isbn: book.isbn || "",
            pages: book.pages || 0,
            publication_date: book.publication_date || "",
            publication: book.publication?.id || "",
            // Note: 'authors' and 'editors' arrays of IDs are now handled by other useEffects
          });

          // D. Set existing images (this logic remains the same)
          const existingImages = book.images.map((img) => ({
            title: img.title,
            file: null,
            preview: img.image,
          }));
          if (existingImages.length > 0) {
            setImageRows(existingImages);
          }
        }
      } catch (error) {
        console.error("Failed to fetch book data:", error);
        alert("Could not load book data. Please try again.");
        navigate("/admin/books");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing, navigate]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      authors: selectedAuthors.map((a) => a.value),
    }));
  }, [selectedAuthors]);

  // This effect does the same for editors.
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      editors: selectedEditors.map((e) => e.value),
    }));
  }, [selectedEditors]);

  // --- EVENT HANDLERS ---
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleDialogOpen = (field, index = null) => {
    let title = "";
    let currentValue = [];

    if (field === "authors") {
      title = "Select Author(s)";
      currentValue = formData.authors;
    } else if (field === "editors") {
      title = "Select Editor(s)";
      currentValue = formData.editors;
    } else if (field === "contributors") {
      title = `Select Contributor(s) for Chapter ${index + 1}`;
      currentValue = chapters[index].contributors.map((c) => c.value);
    }

    // Dialog ke select component ko pre-populate karne ke liye initial value set karein
    setTempSelection(
      metaData.allAuthors.filter((opt) => currentValue.includes(opt.value))
    );

    setDialogConfig({
      isOpen: true,
      title,
      targetField: field,
      chapterIndex: index,
    });
  };

  const handleDialogClose = () => {
    setDialogConfig({
      isOpen: false,
      title: "",
      targetField: null,
      chapterIndex: null,
    });
    setTempSelection([]); // Temporary selection ko reset karein
  };

  const handleDialogSave = () => {
    const { targetField, chapterIndex } = dialogConfig;

    if (targetField === "authors") {
      setSelectedAuthors(tempSelection);
    } else if (targetField === "editors") {
      setSelectedEditors(tempSelection);
    }
    // --- ADD THIS ELSE IF BLOCK ---
    else if (targetField === "contributors") {
      const newChapters = Array.from(chapters);
      newChapters[chapterIndex].contributors = tempSelection; // tempSelection has the full objects
      setChapters(newChapters);
    }

    handleDialogClose();
  };

  const addChapterRow = () => {
    setChapters([...chapters, { title: "", contributors: [] }]);
  };

  const removeChapterRow = (chapterIndex) => {
    setChapters(chapters.filter((_, index) => index !== chapterIndex));
  };

  const handleChapterTitleChange = (chapterIndex, newTitle) => {
    const newChapters = Array.from(chapters);
    newChapters[chapterIndex].title = newTitle;
    setChapters(newChapters);
  };

  // Handles reordering the main list of CHAPTERS
  const handleChapterDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const reorderedChapters = Array.from(chapters);
    const [removed] = reorderedChapters.splice(source.index, 1);
    reorderedChapters.splice(destination.index, 0, removed);
    setChapters(reorderedChapters);
  };

  const handleContributorDragEnd = (result, chapterIndex) => {
    const { source, destination } = result;
    if (!destination) return;

    const chapterToUpdate = chapters[chapterIndex];
    const reorderedContributors = Array.from(chapterToUpdate.contributors);
    const [removed] = reorderedContributors.splice(source.index, 1);
    reorderedContributors.splice(destination.index, 0, removed);

    const newChapters = Array.from(chapters);
    newChapters[chapterIndex] = {
      ...chapterToUpdate,
      contributors: reorderedContributors,
    };
    setChapters(newChapters);
  };

  const handleDragEnd = (result, listType) => {
    const { source, destination } = result;
    if (!destination) return; // Dropped outside the list

    const listToReorder =
      listType === "authors" ? selectedAuthors : selectedEditors;

    const reorderedItems = Array.from(listToReorder);
    const [removed] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, removed);

    if (listType === "authors") {
      setSelectedAuthors(reorderedItems);
    } else {
      setSelectedEditors(reorderedItems);
    }
  };

  // const handleMultiSelectChange = (options, action) =>
  //   setFormData((prev) => ({
  //     ...prev,
  //     [action.name]: options ? options.map((opt) => opt.value) : [],
  //   }));

  // const handleContributionChange = (index, field, value) => {
  //   const updated = [...contributions];
  //   updated[index][field] = value;
  //   setContributions(updated);
  // };

  // const addContributionRow = () =>
  //   setContributions([...contributions, { ...initialContribution }]);
  // const removeContributionRow = (index) =>
  //   setContributions(contributions.filter((_, i) => i !== index));

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

    // 1. Initialize FormData
    // FormData is necessary because we are sending files (images).
    const postData = new FormData();

    // 2. Append all simple fields from the formData state
    // This loop adds 'title', 'description', 'isbn', 'pages', etc.
    Object.keys(formData).forEach((key) => {
      // We manually handle arrays of IDs, so we skip them here.
      if (
        !["authors", "editors"].includes(key) &&
        formData[key] !== null &&
        formData[key] !== undefined
      ) {
        postData.append(key, formData[key]);
      }
    });

    // 3. Append data based on the Book Type (Authored vs. Edited)
    if (bookType === "authored") {
      // For authored books, we just send the ordered list of author PKs.
      // The 'authors' array in formData is already kept in sync by the useEffect hooks.
      formData.authors.forEach((authorId) => {
        postData.append("authors", authorId);
      });
    } else {
      // This handles the 'edited' book type
      // For edited books, we send the ordered list of editor PKs.
      formData.editors.forEach((editorId) => {
        postData.append("editors", editorId);
      });

      // AND we transform the complex 'chapters' state into the JSON string the backend needs.
      const chaptersPayload = chapters.map((chapter, index) => {
        // Construct the full, final title here during submission
        const fullChapterTitle = `${headingType} ${generateNumber(
          numberingStyle,
          index + 1
        )}: ${chapter.title}`;

        return {
          // Send the RAW title to the backend
          title: fullChapterTitle,
          order: index,
          contributors: chapter.contributors.map((c) => c.value),
        };
      });

      // Append the final JSON string to our FormData
      postData.append("chapters", JSON.stringify(chaptersPayload));
    }

    // 4. Append image data
    // This part counts how many images have actual files attached for upload.
    // let imageUploadCount = 0;
    imageRows.forEach((row, index) => {
      if (row.file) {
        postData.append(`image_${index}_file`, row.file);
        postData.append(`image_${index}_title`, row.title);
      }
    });
    postData.append("image_count", imageRows.length);

    // 5. Append the selected category ID
    const finalCategoryId =
      selectedSubSubCat || selectedSubCat || selectedMainCat;
    if (finalCategoryId) {
      postData.append("categories", finalCategoryId);
    }

    // 6. Define the API request (either PATCH for editing or POST for creating)
    const request = isEditing
      ? API.patch(`/api/books/${id}/`, postData)
      : API.post("/api/books/", postData);

    // 7. Execute the request and handle the response
    request
      .then((response) => {
        alert(`Book ${isEditing ? "updated" : "created"} successfully!`);

        // Navigate to the next step (managing formats)
        const bookId = isEditing ? id : response.data.id;
        if (bookId) {
          navigate(`/admin/books/${bookId}/formats`);
        } else {
          console.error(
            "Navigation failed: No book ID was returned from the API."
          );
          navigate("/admin/books"); // Fallback navigation
        }
      })
      .catch((error) => {
        console.error(
          "Submission failed:",
          error.response?.data || error.message
        );
        // Provide a more user-friendly error message
        const errorMessage = error.response?.data
          ? JSON.stringify(error.response.data)
          : "An unknown error occurred.";
        alert(`Submission failed: ${errorMessage}`);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
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
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    onClick={() => handleDialogOpen("authors")}
                  >
                    Select Author(s)
                  </Button>
                  {selectedAuthors.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="subtitle2">
                        Drag to reorder authors
                      </Typography>
                      <ReorderableList
                        items={selectedAuthors}
                        onDragEnd={(result) => handleDragEnd(result, "authors")}
                        listId="authorsList"
                      />
                    </Box>
                  )}
                </Grid>
              )}
              {bookType === "edited" && (
                <>
                  <Grid item size={{ xs: 12, md: 4 }}>
                    <Button
                      variant="outlined"
                      onClick={() => handleDialogOpen("editors")}
                    >
                      Select Editor(s)
                    </Button>

                    {selectedEditors.length > 0 && (
                      <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Drag to reorder editors
                        </Typography>
                        <ReorderableList
                          items={selectedEditors}
                          onDragEnd={(result) =>
                            handleDragEnd(result, "editors")
                          }
                          listId="editorsList"
                        />
                      </Box>
                    )}
                    {/* <Dialog
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
                            placeholder="Select editors..."
                          />
                        </FormControl>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>Disagree</Button>
                        <Button onClick={handleClose}>Agree</Button>
                      </DialogActions>
                    </Dialog> */}
                  </Grid>

                  <Grid item size={{ xs: 12, md: 12 }}>
                    <Typography variant="h6" component="h6" gutterBottom>
                      Contributors & Chapters
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Drag and drop the chapter rows to set their correct order
                      in the book.
                    </Typography>
                  </Grid>
                  <Grid item size={{ xs: 12, md: 12 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Chapter Formatting
                    </Typography>
                    <Grid container spacing={2} sx={{mb: 2}}>
                      <Grid item size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth>
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

                    {/* This is the Drag-and-Drop context for the main CHAPTERS list */}
                    <DragDropContext onDragEnd={handleChapterDragEnd}>
                      <Droppable droppableId="chaptersList">
                        {(provided) => (
                          <Box
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {chapters.map((chapter, chapterIndex) => (
                              <Draggable
                                key={chapterIndex}
                                draggableId={`chapter-${chapterIndex}`}
                                index={chapterIndex}
                              >
                                {(provided) => (
                                  <Paper
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    elevation={3}
                                    sx={{
                                      p: 2,
                                      mb: 2,
                                      bgcolor: "action.hover",
                                    }}
                                  >
                                    {/* Chapter Title and Controls */}
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      mb={2}
                                      gap={1.5}
                                    >
                                      <Grid item size={{ xs: 12, md: 1 }}>
                                      <Tooltip title="Drag to Reorder Chapter">
                                        <IconButton
                                          {...provided.dragHandleProps}
                                          sx={{ cursor: "grab" }}
                                        >
                                          <DragIndicatorIcon />
                                        </IconButton>
                                      </Tooltip>
                                      </Grid>

                                      {/* Non-editable, auto-generated prefix */}
                                      <Grid item size={{ xs: 12, md: 2 }}>
                                      <Typography sx={{ fontWeight: "bold" }}>
                                        {`${headingType} ${generateNumber(
                                          numberingStyle,
                                          chapterIndex + 1
                                        )}:`}
                                      </Typography>
                                      </Grid>

                                      {/* Editable field for the RAW chapter title */}
                                      <TextField
                                        label="Chapter Title"
                                        value={chapter.title}
                                        onChange={(e) =>
                                          handleChapterTitleChange(
                                            chapterIndex,
                                            e.target.value
                                          )
                                        }
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                      />
                                      <Tooltip title="Remove Chapter">
                                        <IconButton
                                          onClick={() =>
                                            removeChapterRow(chapterIndex)
                                          }
                                        >
                                          <DeleteIcon color="error" />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>

                                    {/* Nested Drag-and-Drop for CONTRIBUTORS within this chapter */}
                                    <DragDropContext
                                      onDragEnd={(result) =>
                                        handleContributorDragEnd(
                                          result,
                                          chapterIndex
                                        )
                                      }
                                    >
                                      <Droppable
                                        droppableId={`contributors-${chapterIndex}`}
                                      >
                                        {(provided) => (
                                          <List
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            dense
                                          >
                                            {chapter.contributors.map(
                                              (contributor, contribIndex) => (
                                                <Draggable
                                                  key={contributor.value}
                                                  draggableId={String(
                                                    contributor.value
                                                  )}
                                                  index={contribIndex}
                                                >
                                                  {(provided) => (
                                                    <ListItem
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      sx={{
                                                        border:
                                                          "1px solid #ddd",
                                                        mb: 1,
                                                        bgcolor:
                                                          "background.paper",
                                                        borderRadius: 1,
                                                      }}
                                                    >
                                                      <DragIndicatorIcon
                                                        sx={{
                                                          mr: 1.5,
                                                          cursor: "grab",
                                                          color:
                                                            "text.secondary",
                                                        }}
                                                      />
                                                      <ListItemAvatar>
                                                        <Avatar
                                                          src={
                                                            contributor.image
                                                          }
                                                        />
                                                      </ListItemAvatar>
                                                      <ListItemText
                                                        primary={
                                                          contributor.label
                                                        }
                                                        secondary={
                                                          contributor.author_id
                                                        }
                                                      />
                                                    </ListItem>
                                                  )}
                                                </Draggable>
                                              )
                                            )}
                                            {provided.placeholder}
                                          </List>
                                        )}
                                      </Droppable>
                                    </DragDropContext>

                                    <Button
                                      size="small"
                                      variant="text"
                                      onClick={() =>
                                        handleDialogOpen(
                                          "contributors",
                                          chapterIndex
                                        )
                                      }
                                      startIcon={<AddIcon />}
                                    >
                                      Add / Edit Contributors for this Chapter
                                    </Button>
                                  </Paper>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </Box>
                        )}
                      </Droppable>
                    </DragDropContext>

                    <Button
                      startIcon={<AddIcon />}
                      onClick={addChapterRow}
                      sx={{ mt: 1 }}
                      variant="outlined"
                    >
                      Add New Chapter
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
      {/* --- REUSABLE SELECTION DIALOG --- */}
      <Dialog
        maxWidth="lg"
        fullWidth
        open={dialogConfig.isOpen}
        slots={{
          transition: Transition,
        }}
        onClose={handleDialogClose}
        aria-labelledby="reusable-dialog-title"
      >
        <DialogTitle id="reusable-dialog-title">
          {dialogConfig.title}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, minWidth: 120, minHeight: 100 }}>
            <StyledReactSelect
              autoFocus
              isMulti
              name="dialogSelector"
              options={metaData.allAuthors}
              // Dialog ke andar temporary state se value lein
              value={tempSelection}
              // Aur sirf temporary state ko update karein
              onChange={(options) => setTempSelection(options || [])}
              placeholder="Search by Author ID, Name, or Organization..."
              components={{ Option: CustomAuthorOption }} // Use our custom component for the options
              closeMenuOnSelect={false} // Important: Keeps the menu open for multiple selections
              hideSelectedOptions={false} // Shows selected options in the list (with checkbox ticked)
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          {/* Cancel button dialog band kar dega */}
          <Button onClick={handleDialogClose}>Cancel</Button>
          {/* Save button changes ko main state mein apply karega */}
          <Button onClick={handleDialogSave} variant="contained">
            Confirm Selection
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminBookFormPage;
