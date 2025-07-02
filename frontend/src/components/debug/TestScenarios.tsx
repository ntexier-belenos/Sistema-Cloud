import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    Grid,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import useDevTesting from '../../hooks/useDevTesting';

/**
 * Composant pour gérer les scénarios de test et les données de mock
 */
const TestScenarios: React.FC = () => {
  const {
    resetMockData,
    clearStoredData,
    generateTestScenarios
  } = useDevTesting();
  
  const [selectedScenario, setSelectedScenario] = useState('');
  const [scenarioParams, setScenarioParams] = useState<Record<string, string | number>>({});
  const [scenarioResult, setScenarioResult] = useState<string | null>(null);
  
  // Définition des scénarios disponibles
  const scenarios = [
    {
      id: 'createMultipleProjects',
      name: 'Créer plusieurs projets',
      description: 'Génère automatiquement plusieurs projets pour les tests',
      params: [
        { name: 'count', type: 'number', label: 'Nombre de projets', defaultValue: 5 }
      ]
    },
    {
      id: 'simulateAuthError',
      name: 'Simuler une erreur d\'authentification',
      description: 'Force une erreur d\'authentification pour tester la gestion des erreurs',
      params: []
    }
  ];
  
  // Récupérer le scénario sélectionné
  const getSelectedScenarioDefinition = () => {
    return scenarios.find(s => s.id === selectedScenario);
  };
  
  // Initialiser les paramètres par défaut lors du changement de scénario
  const handleScenarioChange = (event: SelectChangeEvent) => {
    const scenarioId = event.target.value;
    setSelectedScenario(scenarioId);
    
    // Réinitialiser les résultats
    setScenarioResult(null);
    
    // Initialiser les paramètres avec les valeurs par défaut
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      const defaultParams: Record<string, string | number> = {};
      scenario.params.forEach(param => {
        defaultParams[param.name] = param.defaultValue;
      });
      setScenarioParams(defaultParams);
    } else {
      setScenarioParams({});
    }
  };
  
  // Mettre à jour un paramètre
  const handleParamChange = (paramName: string, value: string | number) => {
    setScenarioParams(prev => ({
      ...prev,
      [paramName]: value
    }));
  };
  
  // Exécuter le scénario sélectionné
  const runScenario = async () => {
    setScenarioResult('Exécution en cours...');
    
    try {
      if (selectedScenario === 'createMultipleProjects') {
        const count = Number(scenarioParams.count || 5);
        const result = await generateTestScenarios.createMultipleProjects(count);
        setScenarioResult(
          result 
            ? `${count} projets ont été créés avec succès` 
            : 'Erreur lors de la création des projets'
        );
      }
      else if (selectedScenario === 'simulateAuthError') {
        await generateTestScenarios.simulateAuthError();
        setScenarioResult('Simulation d\'erreur d\'authentification effectuée');
      }
      else {
        setScenarioResult('Scénario inconnu');
      }
    } catch (error: any) {
      setScenarioResult(`Erreur: ${error.message || 'Erreur inconnue'}`);
    }
  };
  
  // Gérer la réinitialisation des données
  const handleResetData = async () => {
    const success = await resetMockData();
    setScenarioResult(
      success 
        ? 'Données réinitialisées avec succès' 
        : 'Erreur lors de la réinitialisation des données'
    );
  };
  
  // Gérer l'effacement du localStorage
  const handleClearStorage = () => {
    const success = clearStoredData();
    setScenarioResult(
      success 
        ? 'LocalStorage effacé avec succès' 
        : 'Erreur lors de l\'effacement du localStorage'
    );
  };
  
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Scénarios de test
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <FormLabel>Scénario</FormLabel>
              <Select
                value={selectedScenario}
                onChange={handleScenarioChange}
                displayEmpty
                fullWidth
                size="small"
              >
                <MenuItem value="" disabled>
                  Sélectionnez un scénario
                </MenuItem>
                {scenarios.map(scenario => (
                  <MenuItem key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </MenuItem>
                ))}
              </Select>
              
              {getSelectedScenarioDefinition() && (
                <FormHelperText>
                  {getSelectedScenarioDefinition()?.description}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          {selectedScenario && getSelectedScenarioDefinition()?.params.map(param => (
            <Grid item xs={12} key={param.name}>
              <FormControl fullWidth>
                <FormLabel>{param.label}</FormLabel>
                {param.type === 'number' ? (
                  <TextField
                    type="number"
                    value={scenarioParams[param.name] || param.defaultValue}
                    onChange={(e) => handleParamChange(param.name, parseInt(e.target.value))}
                    size="small"
                    fullWidth
                  />
                ) : (
                  <TextField
                    value={scenarioParams[param.name] || param.defaultValue}
                    onChange={(e) => handleParamChange(param.name, e.target.value)}
                    size="small"
                    fullWidth
                  />
                )}
              </FormControl>
            </Grid>
          ))}
          
          {selectedScenario && (
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={runScenario}
                fullWidth
              >
                Exécuter le scénario
              </Button>
            </Grid>
          )}
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            color="warning"
            onClick={handleResetData}
          >
            Réinitialiser les données
          </Button>
          <Button 
            variant="outlined" 
            color="error"
            onClick={handleClearStorage}
          >
            Effacer le localStorage
          </Button>
        </Stack>
        
        {scenarioResult && (
          <Box mt={2} p={2} bgcolor="background.paper" border={1} borderColor="divider" borderRadius={1}>
            <Typography variant="body2">
              Résultat: {scenarioResult}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TestScenarios;
