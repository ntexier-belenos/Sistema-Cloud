/**
 * Service de persistance locale des données utilisant localStorage
 * Ce service permet de sauvegarder et restaurer les données du mockDataService
 * afin qu'elles persistent entre les rafraîchissements de page.
 */

import { DashboardStats, Machine, Project, SafetyFunction, SubComponent, User } from './mockDataService';

// Clés utilisées dans le localStorage
const STORAGE_KEYS = {
  PROJECTS: 'sistema_cloud_projects',
  MACHINES: 'sistema_cloud_machines',
  SAFETY_FUNCTIONS: 'sistema_cloud_safety_functions',
  SUB_COMPONENTS: 'sistema_cloud_sub_components',
  USERS: 'sistema_cloud_users',
  DASHBOARD_STATS: 'sistema_cloud_dashboard_stats',
  LAST_UPDATED: 'sistema_cloud_last_updated',
};

// Interface pour le stockage de toutes les données
interface LocalStorageData {
  projects: Project[];
  machines: Machine[];
  safetyFunctions: SafetyFunction[];
  subComponents: SubComponent[];
  users: User[];
  dashboardStats: DashboardStats | null;
  lastUpdated: string;
}

/**
 * Sauvegarde toutes les données dans le localStorage
 */
export const saveToLocalStorage = (data: Partial<Omit<LocalStorageData, 'lastUpdated'>>) => {
  try {
    // Mettre à jour seulement les champs spécifiés
    Object.entries(data).forEach(([key, value]) => {
      const storageKey = STORAGE_KEYS[key.toUpperCase() as keyof typeof STORAGE_KEYS];
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(value));
      }
    });
    
    // Mettre à jour la date de dernière modification
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, new Date().toISOString());
    
    console.log('Données sauvegardées dans le localStorage');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des données dans le localStorage:', error);
  }
};

/**
 * Récupère toutes les données depuis le localStorage
 */
export const loadFromLocalStorage = (): Partial<LocalStorageData> => {
  try {
    const data: Partial<LocalStorageData> = {};
    
    // Récupérer chaque type de données
    const projects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (projects) data.projects = JSON.parse(projects);
    
    const machines = localStorage.getItem(STORAGE_KEYS.MACHINES);
    if (machines) data.machines = JSON.parse(machines);
    
    const safetyFunctions = localStorage.getItem(STORAGE_KEYS.SAFETY_FUNCTIONS);
    if (safetyFunctions) data.safetyFunctions = JSON.parse(safetyFunctions);
    
    const subComponents = localStorage.getItem(STORAGE_KEYS.SUB_COMPONENTS);
    if (subComponents) data.subComponents = JSON.parse(subComponents);
    
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    if (users) data.users = JSON.parse(users);
    
    const dashboardStats = localStorage.getItem(STORAGE_KEYS.DASHBOARD_STATS);
    if (dashboardStats) data.dashboardStats = JSON.parse(dashboardStats);
    
    const lastUpdated = localStorage.getItem(STORAGE_KEYS.LAST_UPDATED);
    if (lastUpdated) data.lastUpdated = lastUpdated;
    
    console.log('Données chargées depuis le localStorage:', data);
    return data;
  } catch (error) {
    console.error('Erreur lors du chargement des données depuis le localStorage:', error);
    return {};
  }
};

/**
 * Efface toutes les données du localStorage
 */
export const clearLocalStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('Données effacées du localStorage');
  } catch (error) {
    console.error('Erreur lors de l\'effacement des données du localStorage:', error);
  }
};

/**
 * Vérifie si des données existent dans le localStorage
 */
export const hasLocalStorageData = (): boolean => {
  return Boolean(localStorage.getItem(STORAGE_KEYS.LAST_UPDATED));
};
