import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import React from 'react';

/**
 * Component Library page
 * Displays a library of safety components that can be used in projects
 */
const ComponentLibrary: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Component Library
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Browse and select certified safety components for your projects.
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">
              This feature is coming soon in the next release.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              The component library will allow you to browse, search, and select safety-certified 
              components to use in your machine safety functions.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ComponentLibrary;
