import { Box, Button, Container, Paper, Typography } from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SafetyFunctionDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Button
          onClick={() => navigate('/safety-functions')}
          sx={{ mb: 2 }}
        >
          Back to Safety Functions
        </Button>
        <Typography variant="h4" gutterBottom>
          Safety Function Details
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Safety Function ID: {id}
        </Typography>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          This feature is coming soon. Check back later!
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/projects')}
        >
          Return to Projects
        </Button>
      </Paper>
    </Container>
  );
};

export default SafetyFunctionDetail;
