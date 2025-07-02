import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import mockDataService, { Machine, Project } from '../../services/mockDataService';

/**
 * Composant de test permettant de vérifier la cohérence des données entre
 * la vue générale des machines et les vues par projet.
 */
const TestMachineProjectConsistency: React.FC = () => {
  const [isDataContextWorking, setIsDataContextWorking] = useState<boolean>(true);
  const [dataContextMachines, setDataContextMachines] = useState<Machine[]>([]);
  const [directMachines, setDirectMachines] = useState<Machine[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [testResults, setTestResults] = useState<{
    machinesTotal: number;
    machinesInProject: number;
    machinesWithoutProject: number;
    missingMachines: Machine[];
    duplicatedMachines: Machine[];
    inconsistentMachines: Machine[];
  }>({
    machinesTotal: 0,
    machinesInProject: 0,
    machinesWithoutProject: 0,
    missingMachines: [],
    duplicatedMachines: [],
    inconsistentMachines: [],
  });
  const [newMachine, setNewMachine] = useState<Partial<Machine>>({
    name: '',
    description: 'Machine de test',
    model: 'Test Model',
    serialNumber: 'TEST-' + Date.now(),
    manufacturer: 'Test Manufacturer',
    yearOfManufacture: new Date().getFullYear(),
    status: 'operational',
    projectId: ''
  });

  // Essayer d'utiliser le DataContext
  let dataContext: any = null;
  try {
    dataContext = useData();
  } catch (error) {
    console.warn('TestMachineProjectConsistency: DataContext non disponible, utilisation du service direct', error);
    setIsDataContextWorking(false);
  }

  // Charger les données au montage du composant
  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les projets
        const projectsData = await mockDataService.getProjects();
        setProjects(projectsData);
        
        // Charger les machines directement depuis le service
        const directMachinesData = await mockDataService.getMachines();
        setDirectMachines(directMachinesData);

        // Si DataContext est disponible, charger les machines depuis le contexte
        if (dataContext) {
          if (dataContext.refreshMachines) {
            await dataContext.refreshMachines();
          }
          setDataContextMachines(dataContext.machines || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données de test:', error);
      }
    };

    loadData();
  }, []);

  // Analyser la cohérence des données
  const runConsistencyCheck = () => {
    // Utiliser les machines du DataContext si disponible, sinon utiliser les machines directes
    const machines = isDataContextWorking && dataContext?.machines ? dataContext.machines : directMachines;
    
    // Machines associées au projet sélectionné
    const machinesInProject = selectedProjectId 
      ? machines.filter((m: Machine) => m.projectId === selectedProjectId)
      : [];
      
    // Machines sans projet
    const machinesWithoutProject = machines.filter((m: Machine) => !m.projectId || m.projectId === '');
    
    // Vérifier les machines dupliquées (même ID)
    const machineIds = machines.map((m: Machine) => m.id);
    const duplicatedIds = machineIds.filter(
      (id: string, index: number) => machineIds.indexOf(id) !== index
    );
    const duplicatedMachines = machines.filter(
      (m: Machine) => duplicatedIds.includes(m.id)
    );
    
    // Vérifier les machines avec des incohérences entre projectId et la vue
    const inconsistentMachines = [];
    for (const machine of machines) {
      // Si on est dans la vue d'un projet, vérifier que toutes les machines ont le bon projectId
      if (selectedProjectId && machine.projectId !== selectedProjectId && machinesInProject.some((m: Machine) => m.id === machine.id)) {
        inconsistentMachines.push(machine);
      }
      // Ou si une machine est dans un projet mais apparaît dans la vue sans projet
      if (!selectedProjectId && machine.projectId && machinesWithoutProject.some((m: Machine) => m.id === machine.id)) {
        inconsistentMachines.push(machine);
      }
    }

    // Mettre à jour les résultats
    setTestResults({
      machinesTotal: machines.length,
      machinesInProject: machinesInProject.length,
      machinesWithoutProject: machinesWithoutProject.length,
      missingMachines: [], // Machines qui devraient être dans un projet mais n'y sont pas
      duplicatedMachines,
      inconsistentMachines,
    });
  };

  // Créer une nouvelle machine pour tester
  const createTestMachine = async () => {
    try {
      if (isDataContextWorking && dataContext?.createMachine) {
        // Créer la machine via le DataContext
        const createdMachine = await dataContext.createMachine({
          ...newMachine
        });
        console.log('Machine créée via DataContext:', createdMachine);
      } else {
        // Créer la machine directement via le service
        const createdMachine = await mockDataService.createMachine({
          ...newMachine
        } as Omit<Machine, 'id' | 'createdAt' | 'updatedAt'>);
        console.log('Machine créée directement:', createdMachine);
      }

      // Rafraîchir les données
      if (isDataContextWorking && dataContext?.refreshMachines) {
        await dataContext.refreshMachines();
        setDataContextMachines(dataContext.machines || []);
      }
      
      // Toujours rafraîchir les données directes
      const directMachinesData = await mockDataService.getMachines();
      setDirectMachines(directMachinesData);

      // Incrémenter le numéro de série pour le prochain test
      setNewMachine(prev => ({
        ...prev,
        serialNumber: 'TEST-' + Date.now(),
      }));
    } catch (error) {
      console.error('Erreur lors de la création de la machine de test:', error);
    }
  };

  // Rafraîchir toutes les données
  const refreshAllData = async () => {
    try {
      // Rafraîchir depuis le contexte si disponible
      if (isDataContextWorking && dataContext) {
        if (dataContext.refreshProjects) await dataContext.refreshProjects();
        if (dataContext.refreshMachines) await dataContext.refreshMachines();
        setDataContextMachines(dataContext.machines || []);
        if (dataContext.projects) setProjects(dataContext.projects || []);
      } 
      
      // Toujours rafraîchir les données directes
      const projectsData = await mockDataService.getProjects();
      setProjects(projectsData);
      
      const directMachinesData = await mockDataService.getMachines();
      setDirectMachines(directMachinesData);

      runConsistencyCheck();
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des données:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Test de cohérence entre machines et projets
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Ce composant permet de vérifier la cohérence des données entre la vue générale des machines et les vues par projet.
        {isDataContextWorking ? (
          <span style={{ color: 'green' }}> (DataContext disponible)</span>
        ) : (
          <span style={{ color: 'orange' }}> (DataContext non disponible, utilisation directe)</span>
        )}
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>Créer une machine de test</Typography>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Nom"
                    value={newMachine.name}
                    onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })}
                    fullWidth
                    margin="normal"
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Projet</InputLabel>
                    <Select
                      value={newMachine.projectId}
                      onChange={(e) => setNewMachine({ ...newMachine, projectId: e.target.value })}
                    >
                      <MenuItem value="">Aucun projet</MenuItem>
                      {projects.map((project) => (
                        <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Statut</InputLabel>
                    <Select
                      value={newMachine.status}
                      onChange={(e) => setNewMachine({ 
                        ...newMachine, 
                        status: e.target.value as 'operational' | 'maintenance' | 'offline' 
                      })}
                    >
                      <MenuItem value="operational">Opérationnel</MenuItem>
                      <MenuItem value="maintenance">Maintenance</MenuItem>
                      <MenuItem value="offline">Hors ligne</MenuItem>
                    </Select>
                  </FormControl>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2 }}
                    onClick={createTestMachine}
                  >
                    Créer la machine
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>Vérifier la cohérence</Typography>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Filtrer par projet</InputLabel>
                  <Select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                  >
                    <MenuItem value="">Toutes les machines</MenuItem>
                    {projects.map((project) => (
                      <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2, mr: 1 }}
                  onClick={runConsistencyCheck}
                >
                  Vérifier la cohérence
                </Button>
                <Button 
                  variant="outlined"
                  color="secondary"
                  sx={{ mt: 2 }}
                  onClick={refreshAllData}
                >
                  Rafraîchir les données
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Résultats</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2">
                Nombre total de machines: <strong>{testResults.machinesTotal}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2">
                Machines dans le projet sélectionné: <strong>{testResults.machinesInProject}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2">
                Machines sans projet: <strong>{testResults.machinesWithoutProject}</strong>
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {testResults.duplicatedMachines.length > 0 && (
          <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: '#FFF3E0' }}>
            <Typography variant="h6" color="error" gutterBottom>
              Machines dupliquées
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Projet ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testResults.duplicatedMachines.map((machine, index) => (
                    <TableRow key={index}>
                      <TableCell>{machine.id}</TableCell>
                      <TableCell>{machine.name}</TableCell>
                      <TableCell>{machine.projectId || 'Aucun'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {testResults.inconsistentMachines.length > 0 && (
          <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: '#FFF3E0' }}>
            <Typography variant="h6" color="error" gutterBottom>
              Machines avec des incohérences
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Projet ID</TableCell>
                    <TableCell>Problème</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testResults.inconsistentMachines.map((machine, index) => (
                    <TableRow key={index}>
                      <TableCell>{machine.id}</TableCell>
                      <TableCell>{machine.name}</TableCell>
                      <TableCell>{machine.projectId || 'Aucun'}</TableCell>
                      <TableCell>
                        {selectedProjectId && machine.projectId !== selectedProjectId ? 
                          'Machine dans le mauvais projet' : 
                          'Machine avec projet dans la vue sans projet'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Liste des machines</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>Projet ID</TableCell>
                  <TableCell>Statut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(isDataContextWorking && dataContext?.machines ? dataContext.machines : directMachines)
                  .filter((machine: Machine) => !selectedProjectId || machine.projectId === selectedProjectId)
                  .map((machine: Machine) => (
                    <TableRow key={machine.id}>
                      <TableCell>{machine.id}</TableCell>
                      <TableCell>{machine.name}</TableCell>
                      <TableCell>{machine.projectId || 'Aucun'}</TableCell>
                      <TableCell>{machine.status}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Paper>
  );
};

export default TestMachineProjectConsistency;
