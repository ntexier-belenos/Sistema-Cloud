import { useEffect } from 'react';
import { useData } from '../contexts/DataContext';

/**
 * Hook personnalisé pour initialiser les données de l'application
 * Ce hook charge toutes les données nécessaires au démarrage
 * 
 * Note: Ce hook est destiné à être utilisé uniquement par des composants
 * qui sont enfants du DataProvider dans l'arbre de composants.
 */
export const useInitializeData = () => {
  const {
    refreshProjects,
    refreshMachines,
    refreshSafetyFunctions,
    refreshSubComponents,
    refreshDashboardStats,
    isLoading,
    errors
  } = useData();

  // Chargement initial des données
  useEffect(() => {
    const initializeData = async () => {
      console.log('Initialisation des données...');
      
      // Chargement en parallèle de toutes les données
      await Promise.all([
        refreshProjects(),
        refreshMachines(),
        refreshSafetyFunctions(),
        refreshSubComponents(),
        refreshDashboardStats()
      ]);
      
      console.log('Données initialisées avec succès');
    };

    initializeData();
  }, [
    refreshProjects,
    refreshMachines,
    refreshSafetyFunctions,
    refreshSubComponents,
    refreshDashboardStats
  ]);

  return {
    isInitializing: isLoading.projects || 
                    isLoading.machines || 
                    isLoading.safetyFunctions || 
                    isLoading.subComponents || 
                    isLoading.dashboardStats,
    hasErrors: !!errors.projects || 
               !!errors.machines || 
               !!errors.safetyFunctions || 
               !!errors.subComponents || 
               !!errors.dashboardStats
  };
};

export default useInitializeData;
