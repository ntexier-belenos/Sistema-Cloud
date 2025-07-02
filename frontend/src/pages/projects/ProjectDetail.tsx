import {
    Add as AddIcon,
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Engineering as EngineeringIcon,
    Shield as ShieldIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Paper,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';

// Interface pour la valeur des onglets
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Composant panneau d'onglet
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { 
    projects, 
    machines, 
    safetyFunctions,
    isLoading, 
    errors, 
    getProject, 
    getProjectMachines,
    refreshProjects, 
    refreshMachines,
    refreshSafetyFunctions
  } = useData();
  
  const [activeTab, setActiveTab] = useState(0);
  const [projectMachines, setProjectMachines] = useState<any[]>([]);
  const [projectSafetyFunctions, setProjectSafetyFunctions] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    
    refreshProjects();
    refreshMachines();
    refreshSafetyFunctions();
  }, [id, refreshProjects, refreshMachines, refreshSafetyFunctions]);

  useEffect(() => {
    if (!id || machines.length === 0) return;
    
    console.log('ID du projet:', id);
    console.log('Toutes les machines:', machines);
    
    const machinesForProject = getProjectMachines(id);
    console.log('Machines du projet:', machinesForProject);
    
    setProjectMachines(machinesForProject);
    
    // Récupérer les fonctions de sécurité pour les machines de ce projet
    const safetyFunctionsForProject = safetyFunctions.filter(
      sf => machinesForProject.some(m => m.id === sf.machineId)
    );
    setProjectSafetyFunctions(safetyFunctionsForProject);
  }, [id, machines, safetyFunctions, getProjectMachines]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const project = id ? getProject(id) : undefined;

  if (isLoading.projects || isLoading.machines || isLoading.safetyFunctions) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errors.projects || errors.machines || errors.safetyFunctions || !project) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {errors.projects || errors.machines || errors.safetyFunctions || 'Projet non trouvé'}
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/projects')}>
          Retour aux projets
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/projects')}
          sx={{ mb: 2 }}
        >
          Retour aux projets
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h1">
              {project.name}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {project.description}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => console.log('Edit project')}
          >
            Modifier le projet
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Aperçu" />
          <Tab label={`Machines (${projectMachines.length})`} />
          <Tab label={`Fonctions de sécurité (${projectSafetyFunctions.length})`} />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Informations générales
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box>
                  <Typography variant="body2">
                    <strong>Date de création:</strong> {new Date(project.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Dernière modification:</strong> {new Date(project.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Statistiques
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box>
                  <Typography variant="body2">
                    <strong>Machines:</strong> {projectMachines.length}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Fonctions de sécurité:</strong> {projectSafetyFunctions.length}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Machines du projet</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => navigate(`/machines/new?projectId=${id}`)}
            >
              Ajouter une machine
            </Button>
          </Box>
          
          {projectMachines.length === 0 ? (
            <Alert severity="info">
              Aucune machine n'a encore été ajoutée à ce projet.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {projectMachines.map(machine => (
                <Grid item xs={12} sm={6} md={4} key={machine.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => navigate(`/machines/${machine.id}`)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EngineeringIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">{machine.name}</Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        {machine.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip 
                          label={machine.status} 
                          size="small" 
                          color={
                            machine.status === 'operational' ? 'success' : 
                            machine.status === 'maintenance' ? 'warning' : 'error'
                          }
                        />
                        <Typography variant="caption">
                          {machine.manufacturer} - {machine.model}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Fonctions de sécurité</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => console.log('Add safety function')}
            >
              Ajouter une fonction de sécurité
            </Button>
          </Box>
          
          {projectSafetyFunctions.length === 0 ? (
            <Alert severity="info">
              Aucune fonction de sécurité n'a encore été ajoutée pour les machines de ce projet.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {projectSafetyFunctions.map(safetyFunction => (
                <Grid item xs={12} sm={6} md={4} key={safetyFunction.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => navigate(`/safety-functions/${safetyFunction.id}`)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <ShieldIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">{safetyFunction.name}</Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        {safetyFunction.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Chip 
                            label={`PL ${safetyFunction.plRequired}`} 
                            size="small" 
                            color="primary"
                            sx={{ mr: 1 }}
                          />
                          <Chip 
                            label={safetyFunction.status.replace('_', ' ')} 
                            size="small" 
                            color={
                              safetyFunction.status === 'validated' ? 'success' : 
                              safetyFunction.status === 'rejected' ? 'error' : 'default'
                            }
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ProjectDetail;
