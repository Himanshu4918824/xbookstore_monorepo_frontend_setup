import React from 'react';
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export function TableOfContentsSlide({ book }) {
  // If there are no chapters, we can choose to show a message or nothing at all.
  if (!book.chapters || book.chapters.length === 0) {
    return (
        <Box sx={{ textAlign: 'center', color: 'text.primary' }}>
            <Paper elevation={6} sx={{ p: 4, backgroundColor: 'background.paper' }}>
                <Typography variant="h2">Table of Contents</Typography>
                <Typography sx={{ mt: 2 }}>This book does not have a chapter list.</Typography>
            </Paper>
        </Box>
    );
  }

  return (
    <Box sx={{ color: 'text.primary', px: { xs: 0, md: '10%' } }}>
      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, backgroundColor: 'background.paper' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
          Table of Contents
        </Typography>
        <Box sx={{
          maxHeight: '50vh', // Set a max height (e.g., 50% of the viewport height)
          overflowY: 'auto', // Add a vertical scrollbar only when needed
          pr: 2, // Add a little padding on the right to make space for the scrollbar
        }}>
          {book.chapters.map(chapter => (
            <Accordion key={chapter.id} sx={{ backgroundImage: 'none', backgroundColor: 'action.hover' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{chapter.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Contributors:</Typography>
                {chapter.contributors.map(contrib => (
                   <Typography key={contrib.author.id} sx={{ ml: 2 }}>
                     - {contrib.author.firstName} {contrib.author.lastName}
                   </Typography>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}