import {
    BugReport as BugReportIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    IconButton,
    Tab,
    Tabs,
    Tooltip,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { clearLocalStorage } from '../../services/localStorageService';
import mockDataService from '../../services/mockDataService';
import NetworkSimulator from './NetworkSimulator';
import TestMachineProjectConsistency from './TestMachineProjectConsistency';
import TestScenarios from './TestScenarios';

/**
 * Composant mode développeur
 * Fournit des outils pour faciliter le développement et le test de l'application
 * - Simulateur de réseau
 * - Gestion du localStorage
 * - Réinitialisation des données
 */
const DeveloperTools: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'reset' | 'clear'>('reset');
  const [currentTab, setCurrentTab] = useState(0);
  
  const handleOpenDevTools = () => {
    setOpen(true);
  };
  
  const handleCloseDevTools = () => {
    setOpen(false);
  };
  
  const handleConfirmDialogOpen = (type: 'reset' | 'clear') => {
    setActionType(type);
    setConfirmDialogOpen(true);
  };
  
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };
  
  const handleConfirmAction = () => {
    if (actionType === 'reset') {
      // Réinitialiser les données
      mockDataService.resetToDefault();
    } else if (actionType === 'clear') {
      // Effacer le localStorage
      clearLocalStorage();
      window.location.reload();
    }
    
    setConfirmDialogOpen(false);
  };
  
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };
  
  return (
    <>
      <Tooltip title="Developer Tools" placement="left">
        <Fab 
          color="secondary" 
          size="medium" 
          onClick={handleOpenDevTools}
          sx={{ 
            position: 'fixed', 
            bottom: 16, 
            right: 16,
            zIndex: (theme) => theme.zIndex.drawer + 1
          }}
        >
          <BugReportIcon />
        </Fab>
      </Tooltip>
      
      <Dialog
        open={open}
        onClose={handleCloseDevTools}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '60vh' }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Developer Tools</Typography>
            <IconButton onClick={handleCloseDevTools} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={currentTab} onChange={handleChangeTab} aria-label="developer tools tabs">
              <Tab label="Réseau" id="tab-0" aria-controls="tabpanel-0" />
              <Tab label="Données" id="tab-1" aria-controls="tabpanel-1" />
              <Tab label="Scénarios" id="tab-2" aria-controls="tabpanel-2" />
              <Tab label="Cohérence" id="tab-3" aria-controls="tabpanel-3" />
            </Tabs>
          </Box>
          
          <Box hidden={currentTab !== 0} id="tabpanel-0" aria-labelledby="tab-0">
            {/* Simulateur de réseau */}
            <NetworkSimulator />
          </Box>
          
          <Box hidden={currentTab !== 1} id="tabpanel-1" aria-labelledby="tab-1">
            {/* Gestion des données */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Gestion des données
                </Typography>
                
                <Box display="flex" flexDirection="column" gap={2}>
                  <Button 
                    variant="outlined" 
                    color="warning"
                    startIcon={<RefreshIcon />}
                    onClick={() => handleConfirmDialogOpen('reset')}
                  >
                    Réinitialiser les données
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleConfirmDialogOpen('clear')}
                  >
                    Effacer le localStorage
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
          
          <Box hidden={currentTab !== 2} id="tabpanel-2" aria-labelledby="tab-2">
            {/* Scénarios de test */}
            <TestScenarios />
          </Box>
          
          <Box hidden={currentTab !== 3} id="tabpanel-3" aria-labelledby="tab-3">
            {/* Test de cohérence machines-projets */}
            <TestMachineProjectConsistency />
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de confirmation */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleConfirmDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {actionType === 'reset' ? 'Reset Data' : 'Clear Local Storage'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {actionType === 'reset' 
              ? 'Are you sure you want to reset all data to the default values? This action cannot be undone.'
              : 'Are you sure you want to clear all data from local storage? This action cannot be undone.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeveloperTools;
