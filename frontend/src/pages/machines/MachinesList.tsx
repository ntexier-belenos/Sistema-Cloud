import {
    Add as AddIcon,
    ArrowBack as ArrowBackIcon,
    ViewList as ViewListIcon,
    ViewModule as ViewModuleIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Paper,
    Tab,
    Tabs,
    Typography,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import MachineCard from '../../components/machines/MachineCard';
import MachineFilter, { MachineFilters } from '../../components/machines/MachineFilter';
import MachineForm from '../../components/machines/MachineForm';
import MachineStats from '../../components/machines/MachineStats';
import mockDataService, { Machine, Project } from '../../services/mockDataService';

// Solution temporaire pour éviter le problème avec DataContext
import { useData } from '../../contexts/DataContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`machine-tabpanel-${index}`}
      aria-labelledby={`machine-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `machine-tab-${index}`,
    'aria-controls': `machine-tabpanel-${index}`,
  };
}

// Wrapper qui détecte si le DataContext est disponible
// et bascule vers le service direct si nécessaire
const MachinesListWrapper: React.FC = () => {
  try {
    // Essayer d'utiliser DataContext sans faire échouer l'application
    useData(); // Juste pour vérifier que le contexte est disponible
    console.log('DataContext disponible pour MachinesList');
    return <MachinesListWithContext />;
  } catch (error) {
    console.warn('DataContext non disponible, utilisation du fallback:', error);
    return <MachinesListDirect />;
  }
};

// Version qui utilise le DataContext
const MachinesListWithContext: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  console.log('MachinesListWithContext - Avant appel useData');
  
  // Utiliser le contexte de données centralisé
  const { 
    machines, 
    projects, 
    isLoading, 
    errors, 
    refreshMachines, 
    createMachine,
    getProject 
  } = useData();
  
  console.log('MachinesListWithContext - DataContext disponible:', 
    { 
      machinesCount: machines?.length, 
      projectsCount: projects?.length, 
      isLoading 
    });

  // État local uniquement pour l'UI
  const [formOpen, setFormOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [filters, setFilters] = useState<MachineFilters>({
    search: '',
    status: 'all',
    manufacturer: '',
    yearFrom: '',
    yearTo: ''
  });

  // Obtenir le projet actuel si projectId est spécifié
  const project = projectId ? getProject(projectId) : undefined;
  
  // Extraire les fabricants uniques
  const manufacturers = Array.from(
    new Set(machines.map(machine => machine.manufacturer))
  );

  console.log('MachinesList - machines disponibles:', machines);
  console.log('MachinesList - project actuel:', project);
  console.log('MachinesList - projectId:', projectId);

  // Effect pour charger les machines au montage du composant
  useEffect(() => {
    console.log('MachinesList - Chargement initial des machines');
    refreshMachines().then(() => {
      console.log('MachinesList - Chargement des machines terminé');
    });
  }, [refreshMachines]);
  
  // Effect pour observer les changements de machines
  useEffect(() => {
    console.log('MachinesList - Machines disponibles actuellement:', machines.length);
  }, [machines]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleFilterChange = (newFilters: MachineFilters) => {
    setFilters(newFilters);
  };
  
  const handleCreateMachine = async (machineData: Partial<Machine>) => {
    try {
      await createMachine({
        ...machineData,
        projectId: projectId || machineData.projectId || '1'
      } as Omit<Machine, 'id' | 'createdAt' | 'updatedAt'>);
      
      // Les machines seront automatiquement mises à jour dans le contexte
    } catch (err) {
      console.error('Error creating machine:', err);
    }
  };
  
  // Filtrer les machines selon les filtres courants et le projectId s'il existe
  console.log('Filtrage des machines - machines disponibles:', machines);
  console.log('Filtrage des machines - projectId:', projectId);
  
  const filteredMachines = (machines || [])
    .filter(machine => !projectId || machine.projectId === projectId)
    .filter(machine => {
      // Text search
      if (filters.search && 
          !machine.name.toLowerCase().includes(filters.search.toLowerCase()) && 
          !machine.description.toLowerCase().includes(filters.search.toLowerCase()) && 
          !machine.model.toLowerCase().includes(filters.search.toLowerCase()) && 
          !machine.serialNumber.toLowerCase().includes(filters.search.toLowerCase()) &&
          !machine.manufacturer.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filters.status !== 'all' && machine.status !== filters.status) {
        return false;
      }
      
      // Manufacturer filter
      if (filters.manufacturer && machine.manufacturer !== filters.manufacturer) {
        return false;
      }
      
      // Year range filter
      if (filters.yearFrom && machine.yearOfManufacture < parseInt(filters.yearFrom)) {
        return false;
      }
      
      if (filters.yearTo && machine.yearOfManufacture > parseInt(filters.yearTo)) {
        return false;
      }
      
      return true;
    });
    
  console.log('MachinesList - Machines filtrées:', filteredMachines);
  
  // Ajouter un useEffect pour voir quand les machines ou les filteredMachines changent
  useEffect(() => {
    console.log('MachinesList - machines mises à jour:', machines);
    console.log('MachinesList - filteredMachines:', filteredMachines);
  }, [machines, filteredMachines]);

  if (isLoading.machines) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errors.machines) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography color="error" variant="h6">
            {errors.machines}
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
  }
  
  if (projectId && !project) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography color="error" variant="h6">
            Projet non trouvé
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/projects')}
          >
            Retour aux projets
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Box>
          {project && (
            <Button 
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(`/projects/${project.id}`)}
              sx={{ mb: 1 }}
            >
              Retour au projet
            </Button>
          )}
          <Typography variant="h4" component="h1">
            {project ? `Machines - ${project.name}` : 'Toutes les Machines'}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            {project?.description || 'Gestion de toutes les machines du système'}
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setFormOpen(true)}
          sx={{ height: 'fit-content', mt: { xs: 2, md: 0 } }}
        >
          Nouvelle Machine
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="machine tabs"
            >
              <Tab label="Machines" {...a11yProps(0)} />
              <Tab label="Statistiques" {...a11yProps(1)} />
            </Tabs>
            {tabValue === 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
                <Button 
                  size="small"
                  startIcon={<ViewModuleIcon />}
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'inherit'}
                >
                  {!isMobile && 'Grille'}
                </Button>
                <Button 
                  size="small"
                  startIcon={<ViewListIcon />}
                  onClick={() => setViewMode('list')}
                  color={viewMode === 'list' ? 'primary' : 'inherit'}
                >
                  {!isMobile && 'Liste'}
                </Button>
              </Box>
            )}
          </Box>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          {/* Filters */}
          <MachineFilter 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            manufacturers={manufacturers}
          />

          {/* Debug Information */}
          <Box sx={{ mb: 2, p: 1, bgcolor: 'rgba(200, 200, 200, 0.1)' }}>
            <Typography variant="subtitle2" color="textSecondary">
              Machines chargées: {machines.length} | Machines filtrées: {filteredMachines.length}
            </Typography>
          </Box>

          {/* Machines Grid */}
          {filteredMachines.length > 0 ? (
            <Grid container spacing={3}>
              {filteredMachines.map((machine) => (
                <Grid item xs={12} md={viewMode === 'grid' ? 4 : 12} key={machine.id}>
                  <MachineCard machine={machine} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="error" gutterBottom>
                Aucune machine trouvée
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                {machines.length === 0 ? 
                  "Aucune machine n'a été chargée dans l'application." : 
                  "Les machines existent mais ne correspondent pas à vos critères de recherche."
                }
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => refreshMachines()}
                disabled={isLoading.machines}
              >
                {isLoading.machines ? "Chargement..." : "Recharger les machines"}
              </Button>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <MachineStats machines={filteredMachines} />
        </TabPanel>
      </Box>

      {/* Machine Form Dialog */}
      <MachineForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleCreateMachine}
        title="Ajouter une nouvelle machine"
        projectId={projectId}
      />
    </Container>
  );
};

// Version qui utilise directement mockDataService
const MachinesListDirect: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // États pour remplacer le DataContext
  const [machines, setMachines] = useState<Machine[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // État local uniquement pour l'UI
  const [formOpen, setFormOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [filters, setFilters] = useState<MachineFilters>({
    search: '',
    status: 'all',
    manufacturer: '',
    yearFrom: '',
    yearTo: ''
  });

  // Chargement initial des données
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const machinesData = await mockDataService.getMachines();
        const projectsData = await mockDataService.getProjects();
        
        console.log('MachinesListDirect - Machines chargées:', machinesData);
        setMachines(Array.isArray(machinesData) ? machinesData : []);
        setProjects(Array.isArray(projectsData) ? projectsData : []);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError("Une erreur est survenue lors du chargement des données");
        setMachines([]);  // Initialiser avec un tableau vide en cas d'erreur
        setProjects([]);  // Initialiser avec un tableau vide en cas d'erreur
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Fonction pour rafraîchir les machines
  const refreshMachines = async () => {
    setIsLoading(true);
    try {
      const machinesData = await mockDataService.getMachines();
      setMachines(Array.isArray(machinesData) ? machinesData : []);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du rafraîchissement des machines:', err);
      setError("Une erreur est survenue lors du rafraîchissement des machines");
      setMachines([]);  // Initialiser avec un tableau vide en cas d'erreur
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour créer une machine
  const createMachine = async (machineData: Omit<Machine, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await mockDataService.createMachine(machineData);
      refreshMachines();
      return true;
    } catch (err) {
      console.error('Error creating machine:', err);
      return false;
    }
  };
  
  // Fonction pour récupérer un projet
  const getProject = (id: string) => {
    return projects.find(p => p.id === id);
  };

  // Obtenir le projet actuel si projectId est spécifié
  const project = projectId ? getProject(projectId) : undefined;
  
  // S'assurer que machines est toujours un tableau
  const safeMachines = Array.isArray(machines) ? machines : [];
  
  // Extraire les fabricants uniques
  const manufacturers = Array.from(
    new Set(safeMachines.map(machine => machine.manufacturer))
  );

  console.log('MachinesListDirect - machines disponibles:', machines);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleFilterChange = (newFilters: MachineFilters) => {
    setFilters(newFilters);
  };
  
  const handleCreateMachine = async (machineData: Partial<Machine>) => {
    try {
      await createMachine({
        ...machineData,
        projectId: projectId || machineData.projectId || '1'
      } as Omit<Machine, 'id' | 'createdAt' | 'updatedAt'>);
      
      refreshMachines();
    } catch (err) {
      console.error('Error creating machine:', err);
    }
  };
  
  // Filtrer les machines selon les filtres courants et le projectId s'il existe
  console.log('Filtrage des machines - machines disponibles:', machines);
  console.log('Filtrage des machines - projectId:', projectId);
  
  const filteredMachines = (machines || [])
    .filter(machine => !projectId || machine.projectId === projectId)
    .filter(machine => {
      // Text search
      if (filters.search && 
          !machine.name.toLowerCase().includes(filters.search.toLowerCase()) && 
          !machine.description.toLowerCase().includes(filters.search.toLowerCase()) && 
          !machine.model.toLowerCase().includes(filters.search.toLowerCase()) && 
          !machine.serialNumber.toLowerCase().includes(filters.search.toLowerCase()) &&
          !machine.manufacturer.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filters.status !== 'all' && machine.status !== filters.status) {
        return false;
      }
      
      // Manufacturer filter
      if (filters.manufacturer && machine.manufacturer !== filters.manufacturer) {
        return false;
      }
      
      // Year range filter
      if (filters.yearFrom && machine.yearOfManufacture < parseInt(filters.yearFrom)) {
        return false;
      }
      
      if (filters.yearTo && machine.yearOfManufacture > parseInt(filters.yearTo)) {
        return false;
      }
      
      return true;
    });
    
  console.log('MachinesListDirect - Machines filtrées:', filteredMachines);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography color="error" variant="h6">
            {error}
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
  }
  
  if (projectId && !project) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography color="error" variant="h6">
            Projet non trouvé
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/projects')}
          >
            Retour aux projets
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Box>
          {project && (
            <Button 
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(`/projects/${project.id}`)}
              sx={{ mb: 1 }}
            >
              Retour au projet
            </Button>
          )}
          <Typography variant="h4" component="h1">
            {project ? `Machines - ${project.name}` : 'Toutes les Machines'}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            {project?.description || 'Gestion de toutes les machines du système'}
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setFormOpen(true)}
          sx={{ height: 'fit-content', mt: { xs: 2, md: 0 } }}
        >
          Nouvelle Machine
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="machine tabs"
            >
              <Tab label="Machines" {...a11yProps(0)} />
              <Tab label="Statistiques" {...a11yProps(1)} />
            </Tabs>
            {tabValue === 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
                <Button 
                  size="small"
                  startIcon={<ViewModuleIcon />}
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'inherit'}
                >
                  {!isMobile && 'Grille'}
                </Button>
                <Button 
                  size="small"
                  startIcon={<ViewListIcon />}
                  onClick={() => setViewMode('list')}
                  color={viewMode === 'list' ? 'primary' : 'inherit'}
                >
                  {!isMobile && 'Liste'}
                </Button>
              </Box>
            )}
          </Box>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          {/* Filters */}
          <MachineFilter 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            manufacturers={manufacturers}
          />

          {/* Debug Information */}
          <Box sx={{ mb: 2, p: 1, bgcolor: 'rgba(200, 200, 200, 0.1)' }}>
            <Typography variant="subtitle2" color="textSecondary">
              Machines chargées: {machines.length} | Machines filtrées: {filteredMachines.length}
            </Typography>
          </Box>

          {/* Machines Grid */}
          {filteredMachines.length > 0 ? (
            <Grid container spacing={3}>
              {filteredMachines.map((machine) => (
                <Grid item xs={12} md={viewMode === 'grid' ? 4 : 12} key={machine.id}>
                  <MachineCard machine={machine} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="error" gutterBottom>
                Aucune machine trouvée
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                {machines.length === 0 ? 
                  "Aucune machine n'a été chargée dans l'application." : 
                  "Les machines existent mais ne correspondent pas à vos critères de recherche."
                }
              </Typography>
              <Button 
                variant="contained" 
                onClick={refreshMachines}
                disabled={isLoading}
              >
                {isLoading ? "Chargement..." : "Recharger les machines"}
              </Button>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <MachineStats machines={filteredMachines} />
        </TabPanel>
      </Box>

      {/* Machine Form Dialog */}
      <MachineForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleCreateMachine}
        title="Ajouter une nouvelle machine"
        projectId={projectId}
      />
    </Container>
  );
};

export default MachinesListWrapper;
