import React from 'react';
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export function AuthorHistorySlide({ author }) {
  if (!author.history || author.history.length === 0) {
    return (
        <Box sx={{ textAlign: 'center', color: 'text.primary' }}>
            <Paper elevation={6} sx={{ p: 4, backgroundColor: 'background.paper' }}>
                <Typography variant="h2">Professional History</Typography>
                <Typography sx={{ mt: 2 }}>No professional history is available for this author.</Typography>
            </Paper>
        </Box>
    );
  }

  return (
    <Box sx={{ color: 'text.primary', px: { xs: 0, md: '10%' } }}>
      <Paper elevation={6} sx={{ 
          p: { xs: 2, md: 4 }, 
          backgroundColor: 'background.paper',
          maxHeight: 'calc(100vh - 200px)', // Set a max height
          overflowY: 'auto', // Add a scrollbar if the list is long
      }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
          Professional History
        </Typography>
        <Box>
          {author.history.map(record => (
            <Accordion key={record.id} sx={{ backgroundImage: 'none', backgroundColor: 'action.hover' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {/* The heading for the collapsed view */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Typography sx={{ fontWeight: 'medium' }}>{record.designation}</Typography>
                  <Typography color="text.secondary">{record.startDate} - {record.endDate || 'Present'}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ borderTop: 1, borderColor: 'divider' }}>
                {/* --- THIS IS THE FIX --- */}
                <Typography variant="h6">{record.department}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    {record.organization}
                </Typography>
                {/* --- END OF FIX --- */}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}