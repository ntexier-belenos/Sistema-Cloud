import {
    ContentCopy as CopyIcon,
    Delete as DeleteIcon,
    Download as DownloadIcon,
    Refresh as RefreshIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    Grid,
    IconButton,
    Paper,
    Tab,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { clearLocalStorage, loadFromLocalStorage, saveToLocalStorage } from '../../services/localStorageService';
import mockDataService from '../../services/mockDataService';

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
      id={`debug-tabpanel-${index}`}
      aria-labelledby={`debug-tab-${index}`}
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

function a11yProps(index: number) {
  return {
    id: `debug-tab-${index}`,
    'aria-controls': `debug-tabpanel-${index}`,
  };
}

/**
 * Page de debug qui affiche toutes les données du localStorage
 * et permet de les manipuler pour tester l'application
 */
const DataDebugPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [localStorageData, setLocalStorageData] = useState<any>(null);
  const [mockData, setMockData] = useState<any>(null);
  const [editedData, setEditedData] = useState<string>('');
  const [dataKey, setDataKey] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info',
    message: string
  } | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Charger les données du localStorage
  const loadData = () => {
    try {
      const data = loadFromLocalStorage();
      setLocalStorageData(data);
      setEditedData(JSON.stringify(data, null, 2));
      
      // Extraire la date de dernière mise à jour
      if (data.lastUpdated) {
        const date = new Date(data.lastUpdated);
        setLastUpdate(date.toLocaleString());
      } else {
        setLastUpdate('Inconnue');
      }
      
      setStatusMessage({ 
        type: 'success', 
        message: 'Données chargées avec succès' 
      });
      
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setStatusMessage({ 
        type: 'error', 
        message: 'Erreur lors du chargement des données' 
      });
    }
  };

  // Récupérer les données mockées actuellement en mémoire
  const loadMockData = () => {
    setMockData({
      projects: mockDataService.getProjects(),
      machines: mockDataService.getMachines(),
      safetyFunctions: mockDataService.getSafetyFunctions(),
      subComponents: mockDataService.getSubComponents(),
      users: [] // Les utilisateurs ne sont généralement pas exposés directement
    });
    
    setStatusMessage({ 
      type: 'info', 
      message: 'Données mockées récupérées' 
    });
    
    setTimeout(() => {
      setStatusMessage(null);
    }, 3000);
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadData();
    loadMockData();
  }, []);

  // Gérer le changement d'onglet
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mettre à jour les données éditées
  const handleEditedDataChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedData(event.target.value);
  };

  // Sauvegarder les données éditées
  const saveEditedData = () => {
    try {
      const data = JSON.parse(editedData);
      saveToLocalStorage(data);
      loadData(); // Recharger pour vérifier la sauvegarde
      setStatusMessage({ 
        type: 'success', 
        message: 'Données sauvegardées avec succès' 
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
      setStatusMessage({ 
        type: 'error', 
        message: 'Erreur: JSON invalide' 
      });
    }
  };

  // Réinitialiser les données
  const resetData = () => {
    try {
      clearLocalStorage();
      mockDataService.resetToDefault();
      loadData();
      loadMockData();
      setStatusMessage({ 
        type: 'success', 
        message: 'Données réinitialisées avec succès' 
      });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation des données:', error);
      setStatusMessage({ 
        type: 'error', 
        message: 'Erreur lors de la réinitialisation des données' 
      });
    }
  };

  // Copier les données dans le presse-papier
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setStatusMessage({ 
          type: 'success', 
          message: 'Données copiées dans le presse-papier' 
        });
        setTimeout(() => {
          setStatusMessage(null);
        }, 3000);
      },
      (err) => {
        console.error('Erreur lors de la copie dans le presse-papier:', err);
        setStatusMessage({ 
          type: 'error', 
          message: 'Erreur lors de la copie dans le presse-papier' 
        });
      }
    );
  };

  // Télécharger les données en tant que fichier JSON
  const downloadData = () => {
    try {
      const data = localStorageData;
      const fileName = `sistema_cloud_data_${new Date().toISOString()}.json`;
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
      
      setStatusMessage({ 
        type: 'success', 
        message: `Données téléchargées: ${fileName}` 
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement des données:', error);
      setStatusMessage({ 
        type: 'error', 
        message: 'Erreur lors du téléchargement des données' 
      });
    }
  };

  // Sauvegarder une valeur spécifique
  const saveSpecificData = () => {
    try {
      if (!dataKey) {
        setStatusMessage({ 
          type: 'error', 
          message: 'Veuillez spécifier une clé de données' 
        });
        return;
      }

      const parsedValue = JSON.parse(editedData);
      const dataToSave: any = {};
      dataToSave[dataKey] = parsedValue;
      
      saveToLocalStorage(dataToSave);
      loadData();
      setStatusMessage({ 
        type: 'success', 
        message: `Données '${dataKey}' sauvegardées avec succès` 
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données spécifiques:', error);
      setStatusMessage({ 
        type: 'error', 
        message: 'Erreur: JSON invalide ou clé incorrecte' 
      });
    }
  };

  // Vérifier la cohérence des données
  const checkDataConsistency = () => {
    try {
      // Récupérer les données
      const { projects = [], machines = [] } = localStorageData || {};
      
      // Vérifier les machines avec projectId invalide
      const projectIds = new Set(projects.map((p: any) => p.id));
      const machinesWithInvalidProject = machines.filter((m: any) => 
        m.projectId && !projectIds.has(m.projectId)
      );
      
      // Vérifier les machines sans projet
      const machinesWithoutProject = machines.filter((m: any) => !m.projectId);
      
      // Afficher les résultats
      setStatusMessage({ 
        type: machinesWithInvalidProject.length > 0 ? 'error' : 'success', 
        message: `
          Résultat de la vérification:
          - Machines totales: ${machines.length}
          - Machines avec projectId invalide: ${machinesWithInvalidProject.length}
          - Machines sans projet: ${machinesWithoutProject.length}
        `
      });
    } catch (error) {
      console.error('Erreur lors de la vérification de la cohérence:', error);
      setStatusMessage({ 
        type: 'error', 
        message: 'Erreur lors de la vérification de la cohérence' 
      });
    }
  };

  // Formater joliment un objet pour l'affichage
  const formatObject = (obj: any) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch (error) {
      return 'Erreur de formatage';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Debug Data Store
          </Typography>
          <Box>
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<RefreshIcon />} 
              onClick={() => { loadData(); loadMockData(); }}
              sx={{ mr: 1 }}
            >
              Actualiser
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<DeleteIcon />} 
              onClick={resetData}
            >
              Réinitialiser
            </Button>
          </Box>
        </Box>
        
        <Typography variant="body1" gutterBottom>
          Cette page permet d'examiner et de modifier les données stockées dans le localStorage.
        </Typography>
        
        <Alert severity="info" sx={{ my: 2 }}>
          Dernière mise à jour: {lastUpdate}
        </Alert>
        
        {statusMessage && (
          <Alert severity={statusMessage.type} sx={{ my: 2 }}>
            {statusMessage.message}
          </Alert>
        )}
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="debug data tabs">
            <Tab label="Vue d'ensemble" {...a11yProps(0)} />
            <Tab label="Éditeur" {...a11yProps(1)} />
            <Tab label="LocalStorage vs Mock" {...a11yProps(2)} />
            <Tab label="Diagnostic" {...a11yProps(3)} />
          </Tabs>
        </Box>

        {/* Onglet Vue d'ensemble */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<DownloadIcon />} 
              onClick={downloadData}
              sx={{ mr: 1 }}
            >
              Télécharger JSON
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<CopyIcon />} 
              onClick={() => copyToClipboard(JSON.stringify(localStorageData, null, 2))}
            >
              Copier JSON
            </Button>
          </Box>

          <Grid container spacing={3}>
            {localStorageData && Object.entries(localStorageData).map(([key, value]: [string, any]) => (
              <Grid item xs={12} md={6} key={key}>
                <Card variant="outlined">
                  <CardHeader
                    title={key}
                    subheader={Array.isArray(value) ? `${value.length} éléments` : typeof value}
                    action={
                      <IconButton 
                        aria-label="copy" 
                        onClick={() => copyToClipboard(JSON.stringify(value, null, 2))}
                      >
                        <CopyIcon />
                      </IconButton>
                    }
                  />
                  <CardContent sx={{ maxHeight: '300px', overflow: 'auto' }}>
                    <pre style={{ margin: 0 }}>
                      {formatObject(value)}
                    </pre>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Onglet Éditeur */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Clé (projects, machines, safetyFunctions, etc.)"
                value={dataKey}
                onChange={(e) => setDataKey(e.target.value)}
                placeholder="Laissez vide pour tout sauvegarder"
                margin="normal"
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />} 
                onClick={dataKey ? saveSpecificData : saveEditedData}
                sx={{ mb: 1 }}
              >
                {dataKey ? `Sauvegarder ${dataKey}` : 'Tout sauvegarder'}
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => setEditedData(JSON.stringify(localStorageData, null, 2))}
                sx={{ mb: 1 }}
              >
                Réinitialiser
              </Button>
            </Box>
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={20}
            variant="outlined"
            value={editedData}
            onChange={handleEditedDataChange}
            sx={{ fontFamily: 'monospace' }}
          />
          <Alert severity="warning" sx={{ mt: 2 }}>
            Attention: assurez-vous que le JSON est valide avant de sauvegarder
          </Alert>
        </TabPanel>

        {/* Onglet LocalStorage vs Mock */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Données dans le localStorage
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, maxHeight: '500px', overflow: 'auto' }}>
                <pre style={{ margin: 0 }}>
                  {formatObject(localStorageData)}
                </pre>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Données mockées en mémoire
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, maxHeight: '500px', overflow: 'auto' }}>
                <pre style={{ margin: 0 }}>
                  {formatObject(mockData)}
                </pre>
              </Paper>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Analyse des différences
          </Typography>
          
          {localStorageData && mockData && (
            <Grid container spacing={2}>
              {Object.keys(mockData).map((key) => {
                const localCount = Array.isArray(localStorageData[key]) ? localStorageData[key]?.length || 0 : 0;
                const mockCount = Array.isArray(mockData[key]) ? mockData[key]?.length || 0 : 0;
                const hasDifference = localCount !== mockCount;
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <Paper 
                      elevation={0} 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        bgcolor: hasDifference ? 'warning.light' : 'success.light'
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom>
                        {key}
                      </Typography>
                      <Typography variant="body2">
                        LocalStorage: <strong>{localCount}</strong> éléments
                      </Typography>
                      <Typography variant="body2">
                        Mock: <strong>{mockCount}</strong> éléments
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </TabPanel>

        {/* Onglet Diagnostic */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ mb: 3 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={checkDataConsistency}
              sx={{ mr: 2 }}
            >
              Vérifier la cohérence
            </Button>
          </Box>
          
          {localStorageData && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader title="Projets" />
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      Nombre de projets: <strong>{localStorageData.projects?.length || 0}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      IDs de projets disponibles:
                    </Typography>
                    <Paper 
                      variant="outlined" 
                      sx={{ p: 1, mt: 1, maxHeight: '100px', overflow: 'auto' }}
                    >
                      {localStorageData.projects?.map((p: any) => (
                        <Chip 
                          key={p.id} 
                          label={`${p.id} (${p.name})`} 
                          size="small" 
                          sx={{ m: 0.5 }} 
                        />
                      ))}
                    </Paper>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader title="Machines" />
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      Nombre de machines: <strong>{localStorageData.machines?.length || 0}</strong>
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Répartition par projet:
                    </Typography>
                    <Box sx={{ maxHeight: '200px', overflow: 'auto' }}>
                      {localStorageData.projects?.map((project: any) => {
                        const projectMachines = localStorageData.machines?.filter(
                          (m: any) => m.projectId === project.id
                        ) || [];
                        
                        return (
                          <Paper key={project.id} variant="outlined" sx={{ p: 1, mb: 1 }}>
                            <Typography variant="body2">
                              {project.name}: <strong>{projectMachines.length}</strong> machines
                            </Typography>
                          </Paper>
                        );
                      })}
                      
                      {/* Machines sans projet */}
                      <Paper variant="outlined" sx={{ p: 1, mb: 1 }}>
                        <Typography variant="body2">
                          Sans projet: <strong>
                            {localStorageData.machines?.filter((m: any) => !m.projectId).length || 0}
                          </strong> machines
                        </Typography>
                      </Paper>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default DataDebugPage;
