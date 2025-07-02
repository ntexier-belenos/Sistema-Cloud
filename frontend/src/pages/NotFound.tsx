import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      p={4}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        Page non trouvée
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        La page que vous cherchez n'existe pas ou a été déplacée.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/')}
        sx={{ mt: 2 }}
      >
        Retour à l'accueil
      </Button>
    </Box>
  );
};

export default NotFound;
