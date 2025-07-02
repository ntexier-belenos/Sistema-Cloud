import {
    AddCircle as AddCircleIcon,
    Architecture as ArchitectureIcon,
    ArrowBack as ArrowBackIcon,
    Build as BuildIcon,
    CheckCircle as CheckCircleIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Info as InfoIcon,
    Inventory as InventoryIcon,
    QrCode as QrCodeIcon,
    Shield as ShieldIcon,
    WarningAmber as WarningIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Tab,
    Tabs,
    Tooltip,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import MachineForm from '../../components/machines/MachineForm';
import { useData } from '../../contexts/DataContext';
import { Machine } from '../../services/mockDataService';

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
      id={`machine-detail-tabpanel-${index}`}
      aria-labelledby={`machine-detail-tab-${index}`}
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
    id: `machine-detail-tab-${index}`,
    'aria-controls': `machine-detail-tabpanel-${index}`,
  };
}

const MachineDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Utiliser le contexte de données centralisé
  const { 
    getMachine, 
    getMachineSafetyFunctions,
    updateMachine,
    deleteMachine,
    isLoading, 
    errors,
    refreshMachines,
    refreshSafetyFunctions
  } = useData();
  
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Récupérer les données depuis le store centralisé
  const machine = id ? getMachine(id) : undefined;
  const safetyFunctions = id ? getMachineSafetyFunctions(id) : [];
  
  // Charger les données seulement si nécessaire
  useEffect(() => {
    if (id && (!machine || safetyFunctions.length === 0)) {
      refreshMachines();
      refreshSafetyFunctions();
    }
  }, [id, machine, safetyFunctions.length, refreshMachines, refreshSafetyFunctions]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleUpdateMachine = async (updatedMachineData: Partial<Machine>) => {
    if (!machine || !id) return;
    
    try {
      // Mettre à jour la machine via le contexte de données
      await updateMachine(id, updatedMachineData);
      setEditDialogOpen(false);
    } catch (err) {
      console.error('Error updating machine:', err);
    }
  };
  
  const handleDeleteMachine = () => {
    // In a real app, we would call an API to delete the machine
    // For now, we just navigate back
    navigate('/machines');
  };
  
  const getStatusIcon = () => {
    if (!machine) return <InfoIcon />;
    
    switch (machine.status) {
      case 'operational':
        return <CheckCircleIcon color="success" />;
      case 'maintenance':
        return <BuildIcon color="warning" />;
      case 'offline':
        return <WarningIcon color="error" />;
      default:
        return <InfoIcon />;
    }
  };
  
  const getStatusText = () => {
    if (!machine) return '';
    
    switch (machine.status) {
      case 'operational':
        return 'En fonctionnement';
      case 'maintenance':
        return 'En maintenance';
      case 'offline':
        return 'Hors ligne';
      default:
        return 'Statut inconnu';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  
  if (isLoading.machines || isLoading.safetyFunctions) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (errors.machines || !machine) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/machines')}
            sx={{ mb: 2 }}
          >
            Retour aux Machines
          </Button>
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.machines || 'Machine introuvable'}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/machines')}
          >
            Voir toutes les machines
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/machines')}
          sx={{ mb: 2 }}
        >
          Retour aux Machines
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" component="h1" sx={{ mr: 2 }}>
                {machine.name}
              </Typography>
              <Chip 
                icon={getStatusIcon()} 
                label={getStatusText()}
                color={
                  machine.status === 'operational' ? 'success' : 
                  machine.status === 'maintenance' ? 'warning' : 'error'
                }
              />
            </Box>
            <Typography variant="body1" color="textSecondary">
              {machine.description}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', mt: { xs: 2, md: 0 } }}>
            <Button 
              startIcon={<EditIcon />} 
              variant="outlined" 
              onClick={() => setEditDialogOpen(true)}
              sx={{ mr: 1 }}
            >
              Modifier
            </Button>
            <Button 
              startIcon={<DeleteIcon />} 
              variant="outlined" 
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Supprimer
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="machine details tabs"
            >
              <Tab label="Informations" {...a11yProps(0)} />
              <Tab label="Fonctions de sécurité" {...a11yProps(1)} />
              <Tab label="Documents" {...a11yProps(2)} />
              <Tab label="Historique" {...a11yProps(3)} />
            </Tabs>
          </Box>
        </Paper>

        {/* Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Informations générales
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Fabricant
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {machine.manufacturer}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Modèle
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {machine.model}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Numéro de série
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {machine.serialNumber}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Année de fabrication
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {machine.yearOfManufacture}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Date de dernière maintenance
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {formatDate(machine.lastMaintenanceDate)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Date d'ajout au système
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {formatDate(machine.createdAt)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Résumé des fonctions de sécurité
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShieldIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {safetyFunctions.length} fonctions de sécurité
                  </Typography>
                </Box>
                
                {safetyFunctions.length > 0 ? (
                  <>
                    <List dense>
                      {safetyFunctions.slice(0, 4).map((func) => (
                        <ListItem 
                          key={func.id}
                          sx={{ 
                            bgcolor: 'background.default',
                            borderRadius: 1,
                            mb: 1
                          }}
                        >
                          <ListItemText
                            primary={func.name}
                            secondary={
                              <Box component="span" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Typography variant="caption" component="span" sx={{ mr: 1 }}>
                                  PL requise: {func.plRequired.toUpperCase()}
                                </Typography>
                                {func.plAchieved && (
                                  <Chip
                                    size="small"
                                    label={`PL ${func.plAchieved.toUpperCase()}`}
                                    color={
                                      func.plAchieved >= func.plRequired ? 'success' : 'error'
                                    }
                                    sx={{ height: 20 }}
                                  />
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    {safetyFunctions.length > 4 && (
                      <Button 
                        onClick={() => setTabValue(1)} 
                        size="small" 
                        sx={{ mt: 1 }}
                      >
                        Voir toutes les fonctions de sécurité
                      </Button>
                    )}
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Aucune fonction de sécurité n'est encore définie pour cette machine.
                  </Typography>
                )}
                
                <Button
                  startIcon={<AddCircleIcon />}
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/safety/new?machineId=${machine.id}`)}
                >
                  Ajouter une fonction de sécurité
                </Button>
              </Paper>
              
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Actions rapides
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List dense>
                  <ListItem button onClick={() => window.print()}>
                    <ListItemIcon>
                      <QrCodeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Générer un QR code" />
                  </ListItem>
                  
                  <ListItem button onClick={() => navigate('/machines')}>
                    <ListItemIcon>
                      <InventoryIcon />
                    </ListItemIcon>
                    <ListItemText primary="Voir toutes les machines" />
                  </ListItem>
                  
                  <ListItem button onClick={() => navigate(`/projects/${machine.projectId}`)}>
                    <ListItemIcon>
                      <ArchitectureIcon />
                    </ListItemIcon>
                    <ListItemText primary="Voir le projet parent" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Safety Functions Tab */}
        <TabPanel value={tabValue} index={1}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Fonctions de sécurité
              </Typography>
              <Button 
                startIcon={<AddCircleIcon />}
                variant="contained"
                onClick={() => navigate(`/safety/new?machineId=${machine.id}`)}
              >
                Nouvelle fonction
              </Button>
            </Box>
            
            {safetyFunctions.length > 0 ? (
              <Grid container spacing={3}>
                {safetyFunctions.map((func) => (
                  <Grid item xs={12} md={6} key={func.id}>
                    <Card variant="outlined">
                      <CardHeader
                        title={func.name}
                        subheader={func.type}
                        action={
                          <Tooltip title="Modifier">
                            <IconButton 
                              onClick={() => navigate(`/safety/${func.id}`)}
                              size="small"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        }
                      />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {func.description}
                        </Typography>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              PL requise
                            </Typography>
                            <Typography variant="body1">
                              {func.plRequired.toUpperCase()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              PL atteinte
                            </Typography>
                            <Typography variant="body1">
                              {func.plAchieved ? func.plAchieved.toUpperCase() : 'Non évaluée'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Catégorie
                            </Typography>
                            <Typography variant="body1">
                              {func.category || 'Non définie'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Statut
                            </Typography>
                            <Chip 
                              label={
                                func.status === 'draft' ? 'Brouillon' :
                                func.status === 'in_progress' ? 'En cours' :
                                func.status === 'validated' ? 'Validée' : 'Rejetée'
                              }
                              color={
                                func.status === 'validated' ? 'success' :
                                func.status === 'rejected' ? 'error' :
                                func.status === 'in_progress' ? 'warning' : 'default'
                              }
                              size="small"
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <ShieldIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  Aucune fonction de sécurité n'est définie pour cette machine
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate(`/safety/new?machineId=${machine.id}`)}
                  sx={{ mt: 2 }}
                >
                  Ajouter une première fonction de sécurité
                </Button>
              </Box>
            )}
          </Paper>
        </TabPanel>

        {/* Documents Tab */}
        <TabPanel value={tabValue} index={2}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ py: 4 }}>
              <Typography variant="h6" gutterBottom>
                Gestion des documents
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                Cette fonctionnalité sera bientôt disponible.
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Les documents incluront les manuels, les certificats, les rapports d'inspection, etc.
              </Typography>
            </Box>
          </Paper>
        </TabPanel>

        {/* History Tab */}
        <TabPanel value={tabValue} index={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ py: 4 }}>
              <Typography variant="h6" gutterBottom>
                Historique des modifications
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                Cette fonctionnalité sera bientôt disponible.
              </Typography>
              <Typography variant="body2" color="textSecondary">
                L'historique inclura les modifications apportées à la machine et ses fonctions de sécurité.
              </Typography>
            </Box>
          </Paper>
        </TabPanel>
      </Box>

      {/* Edit Dialog */}
      <MachineForm
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdateMachine}
        machine={machine}
        title="Modifier la machine"
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette machine ? Cette action est irréversible et supprimera également toutes les fonctions de sécurité associées.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDeleteMachine} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MachineDetail;
