import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

// The component now accepts the state and the handler functions as props
function AuthorFilter({
  designations,
  roles, selectedRoles, onRoleChange,
  genders, selectedGenders, onGenderChange,
  countries, selectedCountries, onCountryChange
}) {
  return (
    <Box sx={{ p: 2, backgroundColor: 'background.paper', backdropFilter: 'blur(10px)', borderRadius: 2, height: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Filters</Typography>

      {/* We are only making ROLE and GENDER functional for this demo */}
      {/* The others follow the exact same pattern */}

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>ROLE</Typography></AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {roles.map(r => (
              <FormControlLabel
                key={r}
                control={
                  <Checkbox
                    checked={selectedRoles.includes(r)}
                    onChange={onRoleChange}
                    name={r}
                  />
                }
                label={r}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>GENDER</Typography></AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {genders.map(g => (
               <FormControlLabel
                key={g}
                control={
                  <Checkbox
                    checked={selectedGenders.includes(g)}
                    onChange={onGenderChange}
                    name={g}
                  />
                }
                label={g}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      
      {/* These filters are currently for display only but can be wired up the same way */}
      <Accordion><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>DESIGNATION</Typography></AccordionSummary></Accordion>
      <Accordion><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>COUNTRY</Typography></AccordionSummary></Accordion>
      <Accordion><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>FILTER BY NAME</Typography></AccordionSummary></Accordion>
    </Box>
  );
}
export default AuthorFilter;