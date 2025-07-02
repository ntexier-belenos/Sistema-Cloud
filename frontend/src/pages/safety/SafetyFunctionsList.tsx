import { Box, Button, Container, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SafetyFunctionsList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Safety Functions
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This feature is coming soon. Check back later!
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/projects')}
        >
          Return to Projects
        </Button>
      </Box>
    </Container>
  );
};

export default SafetyFunctionsList;
