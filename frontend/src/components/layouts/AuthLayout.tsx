import { ShieldTwoTone as ShieldIcon } from '@mui/icons-material';
import { Box, Container, Link, Paper, Typography } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: (theme) => theme.palette.mode === 'light' ? '#f5f5f5' : '#121212',
      }}
    >
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4
          }}
        >
          <ShieldIcon color="primary" sx={{ fontSize: 50, mb: 1 }} />
          <Typography
            component="h1"
            variant="h4"
            align="center"
            color="textPrimary"
            gutterBottom
            fontWeight="bold"
          >
            Sistema-Cloud
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" paragraph>
            Machine Safety Analysis Platform
          </Typography>
        </Box>
        
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 2,
          }}
        >
          <Outlet />
        </Paper>
        
        <Box mt={5} textAlign="center">
          <Typography variant="body2" color="textSecondary" align="center">
            &copy; {new Date().getFullYear()} Sistema-Cloud
          </Typography>
          <Box mt={1}>
            <Link href="#" variant="body2" color="textSecondary" sx={{ mx: 1 }}>
              Privacy Policy
            </Link>
            <Link href="#" variant="body2" color="textSecondary" sx={{ mx: 1 }}>
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;
