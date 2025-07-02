import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    FormControlLabel,
    FormGroup,
    Grid,
    Slider,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface NetworkSimulatorProps {
  // Vous pouvez ajouter des props ici si nécessaire
}

/**
 * Composant pour simuler les comportements réseau pour le développement
 * Permet de configurer les délais, les erreurs et les timeouts pour tester la robustesse de l'UI
 */
const NetworkSimulator: React.FC<NetworkSimulatorProps> = () => {
  // État pour le délai réseau (en ms)
  const [delay, setDelay] = useState<number>(500);
  
  // État pour activer/désactiver la simulation d'erreurs
  const [simulateErrors, setSimulateErrors] = useState<boolean>(false);
  
  // Taux d'erreurs (en pourcentage)
  const [errorRate, setErrorRate] = useState<number>(20);
  
  // État pour activer/désactiver la simulation de timeouts
  const [simulateTimeouts, setSimulateTimeouts] = useState<boolean>(false);
  
  // Taux de timeouts (en pourcentage)
  const [timeoutRate, setTimeoutRate] = useState<number>(10);
  
  // Durée du timeout (en ms)
  const [timeoutDuration, setTimeoutDuration] = useState<number>(5000);

  // Fonction pour mettre à jour la configuration du simulateur réseau
  const updateNetworkSimulatorConfig = () => {
    try {
      // Récupérer la configuration actuelle depuis le localStorage
      const networkConfig = {
        delay,
        simulateErrors,
        errorRate,
        simulateTimeouts,
        timeoutRate,
        timeoutDuration
      };
      
      // Sauvegarder la configuration dans localStorage
      localStorage.setItem('networkSimulatorConfig', JSON.stringify(networkConfig));
      
      // Informer l'utilisateur
      alert('Configuration du simulateur réseau mise à jour !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la configuration du simulateur réseau:', error);
      alert('Erreur lors de la sauvegarde de la configuration.');
    }
  };
  
  // Charger la configuration existante au chargement du composant
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('networkSimulatorConfig');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        setDelay(config.delay || 500);
        setSimulateErrors(config.simulateErrors || false);
        setErrorRate(config.errorRate || 20);
        setSimulateTimeouts(config.simulateTimeouts || false);
        setTimeoutRate(config.timeoutRate || 10);
        setTimeoutDuration(config.timeoutDuration || 5000);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration du simulateur réseau:', error);
    }
  }, []);
  
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Simulateur de réseau
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Configurez les paramètres réseau pour tester la robustesse de l'interface utilisateur
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography id="delay-slider" gutterBottom>
              Délai réseau: {delay} ms
            </Typography>
            <Slider
              value={delay}
              onChange={(_, newValue) => setDelay(newValue as number)}
              aria-labelledby="delay-slider"
              valueLabelDisplay="auto"
              min={0}
              max={5000}
              step={100}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch 
                    checked={simulateErrors} 
                    onChange={(e) => setSimulateErrors(e.target.checked)}
                  />
                }
                label="Simuler des erreurs"
              />
              {simulateErrors && (
                <Box sx={{ mt: 1 }}>
                  <Typography id="error-rate-slider" gutterBottom>
                    Taux d'erreurs: {errorRate}%
                  </Typography>
                  <Slider
                    value={errorRate}
                    onChange={(_, newValue) => setErrorRate(newValue as number)}
                    aria-labelledby="error-rate-slider"
                    valueLabelDisplay="auto"
                    min={0}
                    max={100}
                    step={5}
                  />
                </Box>
              )}
            </FormGroup>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch 
                    checked={simulateTimeouts} 
                    onChange={(e) => setSimulateTimeouts(e.target.checked)}
                  />
                }
                label="Simuler des timeouts"
              />
              {simulateTimeouts && (
                <>
                  <Box sx={{ mt: 1 }}>
                    <Typography id="timeout-rate-slider" gutterBottom>
                      Taux de timeouts: {timeoutRate}%
                    </Typography>
                    <Slider
                      value={timeoutRate}
                      onChange={(_, newValue) => setTimeoutRate(newValue as number)}
                      aria-labelledby="timeout-rate-slider"
                      valueLabelDisplay="auto"
                      min={0}
                      max={100}
                      step={5}
                    />
                  </Box>
                  <TextField
                    label="Durée du timeout (ms)"
                    type="number"
                    value={timeoutDuration}
                    onChange={(e) => setTimeoutDuration(Number(e.target.value))}
                    margin="normal"
                    fullWidth
                    inputProps={{
                      min: 1000,
                      max: 60000,
                      step: 1000
                    }}
                  />
                </>
              )}
            </FormGroup>
          </Grid>
          
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={updateNetworkSimulatorConfig}
              fullWidth
            >
              Appliquer les paramètres
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default NetworkSimulator;
