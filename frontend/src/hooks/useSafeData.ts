import { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import mockDataService, {
    DashboardStats,
    Machine,
    Project,
    SafetyFunction,
    SubComponent,
    User
} from '../services/mockDataService';

// Réplication de l'interface DataContextType car elle n'est pas exportée du module d'origine
interface DataContextType {
  // Data collections
  projects: Project[];
  machines: Machine[];
  safetyFunctions: SafetyFunction[];
  subComponents: SubComponent[];
  users: User[];
  dashboardStats: DashboardStats | null;
  
  // Loading states
  isLoading: {
    projects: boolean;
    machines: boolean;
    safetyFunctions: boolean;
    subComponents: boolean;
    users: boolean;
    dashboardStats: boolean;
  };
  
  // Error states
  errors: {
    projects: string | null;
    machines: string | null;
    safetyFunctions: string | null;
    subComponents: string | null;
    users: string | null;
    dashboardStats: string | null;
  };
  
  // CRUD operations
  // Projects
  getProject: (id: string) => Project | undefined;
  getProjectMachines: (projectId: string) => Machine[];
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
  updateProject: (id: string, project: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<boolean>;
  
  // Machines
  getMachine: (id: string) => Machine | undefined;
  getMachineSafetyFunctions: (machineId: string) => SafetyFunction[];
  createMachine: (machine: Omit<Machine, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Machine>;
  updateMachine: (id: string, machine: Partial<Machine>) => Promise<Machine>;
  deleteMachine: (id: string) => Promise<boolean>;
  
  // Safety Functions
  getSafetyFunction: (id: string) => SafetyFunction | undefined;
  getSafetyFunctionSubComponents: (safetyFunctionId: string) => SubComponent[];
  createSafetyFunction: (safetyFunction: Omit<SafetyFunction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<SafetyFunction>;
  updateSafetyFunction: (id: string, safetyFunction: Partial<SafetyFunction>) => Promise<SafetyFunction>;
  deleteSafetyFunction: (id: string) => Promise<boolean>;
  
  // Sub Components
  getSubComponent: (id: string) => SubComponent | undefined;
  createSubComponent: (subComponent: Omit<SubComponent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<SubComponent>;
  updateSubComponent: (id: string, subComponent: Partial<SubComponent>) => Promise<SubComponent>;
  deleteSubComponent: (id: string) => Promise<boolean>;
  
  // Refresh data
  refreshProjects: () => Promise<void>;
  refreshMachines: () => Promise<void>;
  refreshSafetyFunctions: () => Promise<void>;
  refreshSubComponents: () => Promise<void>;
  refreshDashboardStats: () => Promise<void>;
}

/**
 * Hook qui fournit un accès sécurisé aux données, même en dehors du DataProvider
 * Si le composant est à l'intérieur du DataProvider, il utilisera le context
 * Sinon, il utilisera directement le mockDataService
 */
export const useSafeData = () => {
  // Essayer d'accéder au context
  let context: DataContextType | undefined;
  
  // Tenter d'accéder au DataContext en utilisant le hook useData
  try {
    context = useData();
  } catch (error) {
    console.log('DataContext non disponible, utilisation du fallback');
    context = undefined;
  }
  
  // États locaux au cas où le context n'est pas disponible
  const [projects, setProjects] = useState<Project[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [safetyFunctions, setSafetyFunctions] = useState<SafetyFunction[]>([]);
  const [subComponents, setSubComponents] = useState<SubComponent[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  
  // État de chargement et erreurs
  const [isLoading, setIsLoading] = useState({
    projects: true,
    machines: true,
    safetyFunctions: true,
    subComponents: true,
    users: true,
    dashboardStats: true
  });
  
  const [errors, setErrors] = useState({
    projects: null,
    machines: null,
    safetyFunctions: null,
    subComponents: null,
    users: null,
    dashboardStats: null
  } as {
    projects: string | null;
    machines: string | null;
    safetyFunctions: string | null;
    subComponents: string | null;
    users: string | null;
    dashboardStats: string | null;
  });
  
  // Si le contexte est disponible, l'utiliser
  if (context) {
    console.log('useSafeData: Utilisation du DataContext');
    return context;
  }
  
  console.log('useSafeData: DataContext non disponible, fallback vers mockDataService direct');
  
  // Sinon, créer une implémentation locale qui utilise directement le mockDataService
  useEffect(() => {
    const loadData = async () => {
      // Charger les projets
      try {
        setIsLoading(prev => ({ ...prev, projects: true }));
        setErrors(prev => ({ ...prev, projects: null }));
        const projectsData = await mockDataService.getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to load projects:', error);
        setErrors(prev => ({ ...prev, projects: 'Failed to load projects' }));
      } finally {
        setIsLoading(prev => ({ ...prev, projects: false }));
      }
      
      // Charger les machines
      try {
        setIsLoading(prev => ({ ...prev, machines: true }));
        setErrors(prev => ({ ...prev, machines: null }));
        const machinesData = await mockDataService.getMachines();
        setMachines(machinesData);
      } catch (error) {
        console.error('Failed to load machines:', error);
        setErrors(prev => ({ ...prev, machines: 'Failed to load machines' }));
      } finally {
        setIsLoading(prev => ({ ...prev, machines: false }));
      }
      
      // Charger les fonctions de sécurité
      try {
        setIsLoading(prev => ({ ...prev, safetyFunctions: true }));
        setErrors(prev => ({ ...prev, safetyFunctions: null }));
        const safetyFunctionsData = await mockDataService.getSafetyFunctions();
        setSafetyFunctions(safetyFunctionsData);
      } catch (error) {
        console.error('Failed to load safety functions:', error);
        setErrors(prev => ({ ...prev, safetyFunctions: 'Failed to load safety functions' }));
      } finally {
        setIsLoading(prev => ({ ...prev, safetyFunctions: false }));
      }
      
      // Charger les sous-composants
      try {
        setIsLoading(prev => ({ ...prev, subComponents: true }));
        setErrors(prev => ({ ...prev, subComponents: null }));
        const subComponentsData = await mockDataService.getSubComponents();
        setSubComponents(subComponentsData);
      } catch (error) {
        console.error('Failed to load sub-components:', error);
        setErrors(prev => ({ ...prev, subComponents: 'Failed to load sub-components' }));
      } finally {
        setIsLoading(prev => ({ ...prev, subComponents: false }));
      }
      
      // Charger les statistiques du tableau de bord
      try {
        setIsLoading(prev => ({ ...prev, dashboardStats: true }));
        setErrors(prev => ({ ...prev, dashboardStats: null }));
        const stats = await mockDataService.getDashboardStats();
        setDashboardStats(stats);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        setErrors(prev => ({ ...prev, dashboardStats: 'Failed to load dashboard stats' }));
      } finally {
        setIsLoading(prev => ({ ...prev, dashboardStats: false }));
      }
    };
    
    loadData();
  }, []);
  
  // Créer un objet qui imite l'interface du contexte
  const fallbackContext: DataContextType = {
    // Données
    projects,
    machines,
    safetyFunctions,
    subComponents,
    users: [], // Non implémenté dans cette version de fallback
    dashboardStats,
    
    // États
    isLoading,
    errors,
    
    // Fonctions CRUD et getters - implémentations simplifiées
    getProject: (id: string) => projects.find(p => p.id === id),
    getProjectMachines: (projectId: string) => machines.filter(m => m.projectId === projectId),
    createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => mockDataService.createProject(project),
    updateProject: (id: string, project: Partial<Project>) => mockDataService.updateProject(id, project),
    deleteProject: (id: string) => mockDataService.deleteProject(id),
    
    getMachine: (id: string) => machines.find(m => m.id === id),
    getMachineSafetyFunctions: (machineId: string) => safetyFunctions.filter(sf => sf.machineId === machineId),
    createMachine: (machine: Omit<Machine, 'id' | 'createdAt' | 'updatedAt'>) => mockDataService.createMachine(machine),
    updateMachine: (id: string, machine: Partial<Machine>) => mockDataService.updateMachine(id, machine),
    deleteMachine: (id: string) => mockDataService.deleteMachine(id),
    
    getSafetyFunction: (id: string) => safetyFunctions.find(sf => sf.id === id),
    getSafetyFunctionSubComponents: (safetyFunctionId: string) => subComponents.filter(sc => sc.safetyFunctionId === safetyFunctionId),
    createSafetyFunction: (safetyFunction: Omit<SafetyFunction, 'id' | 'createdAt' | 'updatedAt'>) => mockDataService.createSafetyFunction(safetyFunction),
    updateSafetyFunction: (id: string, safetyFunction: Partial<SafetyFunction>) => mockDataService.updateSafetyFunction(id, safetyFunction),
    deleteSafetyFunction: (id: string) => mockDataService.deleteSafetyFunction(id),
    
    getSubComponent: (id: string) => subComponents.find(sc => sc.id === id),
    createSubComponent: (subComponent: Omit<SubComponent, 'id' | 'createdAt' | 'updatedAt'>) => mockDataService.createSubComponent(subComponent),
    updateSubComponent: (id: string, subComponent: Partial<SubComponent>) => mockDataService.updateSubComponent(id, subComponent),
    deleteSubComponent: (id: string) => mockDataService.deleteSubComponent(id),
    
    // Fonctions de rafraîchissement
    refreshProjects: async () => {
      try {
        setIsLoading(prev => ({ ...prev, projects: true }));
        const projectsData = await mockDataService.getProjects();
        setProjects(projectsData);
      } catch (error) {
        setErrors(prev => ({ ...prev, projects: 'Failed to refresh projects' }));
      } finally {
        setIsLoading(prev => ({ ...prev, projects: false }));
      }
    },
    refreshMachines: async () => {
      try {
        setIsLoading(prev => ({ ...prev, machines: true }));
        const machinesData = await mockDataService.getMachines();
        setMachines(machinesData);
      } catch (error) {
        setErrors(prev => ({ ...prev, machines: 'Failed to refresh machines' }));
      } finally {
        setIsLoading(prev => ({ ...prev, machines: false }));
      }
    },
    refreshSafetyFunctions: async () => {
      try {
        setIsLoading(prev => ({ ...prev, safetyFunctions: true }));
        const safetyFunctionsData = await mockDataService.getSafetyFunctions();
        setSafetyFunctions(safetyFunctionsData);
      } catch (error) {
        setErrors(prev => ({ ...prev, safetyFunctions: 'Failed to refresh safety functions' }));
      } finally {
        setIsLoading(prev => ({ ...prev, safetyFunctions: false }));
      }
    },
    refreshSubComponents: async () => {
      try {
        setIsLoading(prev => ({ ...prev, subComponents: true }));
        const subComponentsData = await mockDataService.getSubComponents();
        setSubComponents(subComponentsData);
      } catch (error) {
        setErrors(prev => ({ ...prev, subComponents: 'Failed to refresh sub-components' }));
      } finally {
        setIsLoading(prev => ({ ...prev, subComponents: false }));
      }
    },
    refreshDashboardStats: async () => {
      try {
        setIsLoading(prev => ({ ...prev, dashboardStats: true }));
        const stats = await mockDataService.getDashboardStats();
        setDashboardStats(stats);
      } catch (error) {
        setErrors(prev => ({ ...prev, dashboardStats: 'Failed to refresh dashboard stats' }));
      } finally {
        setIsLoading(prev => ({ ...prev, dashboardStats: false }));
      }
    }
  };
  
  return fallbackContext;
};

export default useSafeData;
