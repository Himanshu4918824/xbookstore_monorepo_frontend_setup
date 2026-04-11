import React from 'react';
import { Container, Typography, Grid } from '@mui/material';
import PublicationCard from '../components/publication/PublicationCard';
import { ApiContext } from '../context/ApiProvider';
import { useContext } from 'react';
import { useEffect } from 'react';

function PublicationsPage() {
  const { publication, fetchAllPublication } = useContext(ApiContext);
  useEffect(() => {
    fetchAllPublication().then((data) => {
      console.log('Fetched publications:', data);
    });
  },[])
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h2" align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Our Publishing Partners
      </Typography>
      <Grid container spacing={4}>
        {publication.map((pub) => (
          <Grid item key={pub.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <PublicationCard publication={pub} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default PublicationsPage;