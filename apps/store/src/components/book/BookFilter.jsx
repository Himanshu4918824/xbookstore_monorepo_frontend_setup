import React from 'react';
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  Slider, FormGroup, FormControlLabel, Checkbox, Rating, List, ListItem, ListItemText, Collapse
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

// A new component for our nested category list
const NestedCategoryList = ({ category }) => {
  const [open, setOpen] = React.useState(true);
  const hasChildren = category.children && category.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    }
  };

  return (
    <>
      <ListItem onClick={handleClick} sx={{ pl: category.level * 2, cursor: 'pointer' }}>
        <ListItemText primary={category.name} />
        {hasChildren ? open ? <ExpandLess /> : <ExpandMore /> : null}
      </ListItem>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {category.children.map(child => <NestedCategoryList key={child.id} category={child} />)}
          </List>
        </Collapse>
      )}
    </>
  );
};


function BookFilter({
  categories,
  priceRange, onPriceChange,
  publishers, selectedPublishers, onPublisherChange,
  rating, onRatingChange,
  bindings, onBindingChange,
  paperSizes, onPaperSizeChange,
  paperQualities, onPaperQualityChange,
}) {
  return (
    <Box sx={{ p: 2, backgroundColor: 'background.paper',  borderRadius: 2, height: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Filters</Typography>

      {/* Category Filter */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>CATEGORIES</Typography></AccordionSummary>
        <AccordionDetails>
          <List component="nav" dense>
            {categories.map(cat => <NestedCategoryList key={cat.id} category={cat} />)}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Price Filter */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>PRICE</Typography></AccordionSummary>
        <AccordionDetails>
          <Slider value={priceRange} onChange={onPriceChange} valueLabelDisplay="auto" min={0} max={2000} step={100} />
        </AccordionDetails>
      </Accordion>
      
      {/* Publisher Filter */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>PUBLISHER</Typography></AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {publishers.map(pub => (
              <FormControlLabel key={pub.id} control={<Checkbox onChange={onPublisherChange} name={pub.name} />} label={pub.name} />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Binding Type Filter */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>BINDING TYPE</Typography></AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {bindings.map(binding => (
              <FormControlLabel key={binding} control={<Checkbox onChange={onBindingChange} name={binding} />} label={binding} />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      
      {/* Paper Size & Quality Filters */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>PAPER SIZE & QUALITY</Typography></AccordionSummary>
        <AccordionDetails>
          <Typography variant="caption">Paper Size</Typography>
          <FormGroup>{paperSizes.map(size => (<FormControlLabel key={size} control={<Checkbox />} label={size} />))}</FormGroup>
          <Typography variant="caption" sx={{ mt: 2 }}>Paper Quality</Typography>
          <FormGroup>{paperQualities.map(q => (<FormControlLabel key={q} control={<Checkbox />} label={q} />))}</FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Customer Ratings Filter */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>CUSTOMER RATINGS</Typography></AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {[4, 3, 2, 1].map(star => (
              <FormControlLabel key={star} control={<Checkbox checked={rating === star} onChange={() => onRatingChange(star)} />} label={<><Rating value={star} readOnly /> & above</>} />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default BookFilter;