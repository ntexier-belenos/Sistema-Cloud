import {
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    IconButton,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';

const ProjectCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createProject, refreshProjects } = useData();
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.name) {
      setError('Le nom du projet est obligatoire');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const newProject = await createProject({
        name: formData.name,
        description: formData.description
      });
      
      await refreshProjects();
      setSuccess(true);
      
      // Rediriger vers la page du nouveau projet après un court délai
      setTimeout(() => {
        navigate(`/projects/${newProject.id}`);
      }, 1500);
      
    } catch (err) {
      setError('Une erreur est survenue lors de la création du projet');
      console.error('Error creating project:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4, mt: 4 }}>
        <IconButton 
          onClick={() => navigate('/projects')} 
          sx={{ mb: 2 }}
          aria-label="Retour à la liste des projets"
        >
          <ArrowBackIcon />
        </IconButton>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Créer un nouveau projet
        </Typography>
        
        <Paper sx={{ p: 4, mt: 3 }}>
          {success ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Le projet a été créé avec succès! Redirection en cours...
            </Alert>
          ) : null}
          
          {error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : null}
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Nom du projet"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type="button"
                  onClick={() => navigate('/projects')}
                  sx={{ mr: 2 }}
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || !formData.name}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Création en cours...' : 'Créer le projet'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProjectCreate;
