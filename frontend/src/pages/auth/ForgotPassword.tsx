import { Email as EmailIcon } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Link,
    TextField,
    Typography
} from '@mui/material';
import React, { FormEvent, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // In a real app, this would make an API call
      setTimeout(() => {
        setSubmitted(true);
        setLoading(false);
      }, 1500);
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password reset error:', error);
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <EmailIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Check Your Email
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          We've sent a password reset link to:
        </Typography>
        <Typography variant="body1" fontWeight="bold" gutterBottom>
          {email}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
          Didn't receive the email? Check your spam folder or{' '}
          <Link component="button" variant="body2" onClick={() => setSubmitted(false)}>
            try again
          </Link>
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            component={RouterLink}
            to="/auth/login"
            variant="outlined"
            fullWidth
          >
            Back to Login
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" align="center" gutterBottom>
        Forgot Password
      </Typography>
      <Typography variant="body1" color="textSecondary" align="center" gutterBottom mb={3}>
        Enter your email and we'll send you a link to reset your password
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3, mb: 2, py: 1.2 }}
          disabled={loading}
          endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <EmailIcon />}
        >
          {loading ? 'Sending...' : 'Reset Password'}
        </Button>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Remember your password?{' '}
            <Link component={RouterLink} to="/auth/login" variant="body2">
              Back to Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
