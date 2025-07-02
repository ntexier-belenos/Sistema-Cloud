import {
    Add as AddIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Grid,
    InputAdornment,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';

const ProjectsList: React.FC = () => {
  const { projects, isLoading, errors, refreshProjects } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  useEffect(() => {
    if (projects) {
      setFilteredProjects(
        projects.filter(project => 
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, projects]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (isLoading.projects) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errors.projects) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {errors.projects}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => refreshProjects()}
        >
          Réessayer
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Projets
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            component={Link}
            to="/projects/new"
          >
            Nouveau projet
          </Button>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un projet..."
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
        />

        {filteredProjects.length === 0 ? (
          <Typography align="center" sx={{ mt: 4 }}>
            {searchTerm 
              ? "Aucun projet ne correspond à votre recherche."
              : "Aucun projet trouvé. Créez votre premier projet!"}
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredProjects.map((project) => (
              <Grid item xs={12} md={6} lg={4} key={project.id}>
                <Card 
                  component={Link} 
                  to={`/projects/${project.id}`}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    textDecoration: 'none',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {project.description}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                      <Chip 
                        size="small"
                        label={`Créé le ${formatDate(project.createdAt)}`}
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default ProjectsList;
