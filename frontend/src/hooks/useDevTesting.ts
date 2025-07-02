/**
 * Hook personnalisé pour faciliter les tests de développement
 * 
 * Ce hook fournit des outils pour gérer les données mock, simuler des conditions réseau
 * et basculer entre différents modes de test.
 */

import { useCallback, useEffect, useState } from 'react';
import apiAdapter from '../services/apiAdapter';
import { clearLocalStorage } from '../services/localStorageService';
import { configureNetworkSimulator, getNetworkSimulatorConfig, NetworkSimulatorConfig, toggleNetworkSimulation } from '../services/networkSimulator';

export const useDevTesting = () => {
  // États
  const [usingMockAPI, setUsingMockAPI] = useState(apiAdapter.utils.isUsingMock());
  const [networkConfig, setNetworkConfig] = useState<NetworkSimulatorConfig>(getNetworkSimulatorConfig());
  
  // Chargement de la configuration du simulateur réseau
  useEffect(() => {
    setNetworkConfig(getNetworkSimulatorConfig());
  }, []);
  
  // Gestion du simulateur réseau
  const updateNetworkConfig = useCallback((config: Partial<NetworkSimulatorConfig>) => {
    const newConfig = configureNetworkSimulator(config);
    setNetworkConfig(newConfig);
  }, []);
  
  const toggleNetworkSimulator = useCallback((enabled: boolean) => {
    toggleNetworkSimulation(enabled);
    setNetworkConfig(prev => ({ ...prev, enabled }));
  }, []);
  
  // Gestion des données mock
  const resetMockData = useCallback(async () => {
    try {
      await apiAdapter.utils.resetMockData();
      return true;
    } catch (error) {
      console.error('Error resetting mock data:', error);
      return false;
    }
  }, []);
  
  const clearStoredData = useCallback(() => {
    try {
      clearLocalStorage();
      return true;
    } catch (error) {
      console.error('Error clearing stored data:', error);
      return false;
    }
  }, []);
  
  // Basculer entre mock et API réelle (si possible)
  const toggleMockAPI = useCallback((useMock: boolean) => {
    apiAdapter.utils.toggleMockAPI(useMock);
    setUsingMockAPI(useMock);
  }, []);
  
  // Générer des scénarios de test spécifiques
  const generateTestScenarios = {
    // Exemple de scénario : créer plusieurs projets avec des machines
    createMultipleProjects: async (count: number = 5) => {
      try {
        for (let i = 0; i < count; i++) {
          await apiAdapter.projects.create({
            name: `Projet de test ${i + 1}`,
            description: `Projet généré automatiquement pour les tests (${i + 1})`
          });
        }
        return true;
      } catch (error) {
        console.error('Erreur lors de la génération de projets de test:', error);
        return false;
      }
    },
    
    // Exemple de scénario : simuler une erreur d'authentification
    simulateAuthError: async () => {
      // Activer temporairement les erreurs réseau
      const prevConfig = { ...networkConfig };
      configureNetworkSimulator({
        enabled: true,
        errors: {
          enabled: true,
          probability: 1.0 // 100% de chance d'erreur
        }
      });
      
      try {
        await apiAdapter.auth.login({ email: 'test@example.com', password: 'password' });
      } catch (error) {
        // Erreur attendue
      } finally {
        // Restaurer la configuration précédente
        configureNetworkSimulator(prevConfig);
      }
    }
  };
  
  return {
    // État
    usingMockAPI,
    networkConfig,
    
    // Actions
    toggleMockAPI,
    toggleNetworkSimulator,
    updateNetworkConfig,
    resetMockData,
    clearStoredData,
    
    // Scénarios de test
    generateTestScenarios
  };
};

export default useDevTesting;
