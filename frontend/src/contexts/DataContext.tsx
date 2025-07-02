import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import mockDataService, {
    DashboardStats,
    Machine,
    Project,
    SafetyFunction,
    SubComponent,
    User
} from '../services/mockDataService';

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

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  console.log('DataProvider initialized');
  
  // State for data collections
  const [projects, setProjects] = useState<Project[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [safetyFunctions, setSafetyFunctions] = useState<SafetyFunction[]>([]);
  const [subComponents, setSubComponents] = useState<SubComponent[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState({
    projects: true,
    machines: true,
    safetyFunctions: true,
    subComponents: true,
    users: true,
    dashboardStats: true
  });
  
  // Error states
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

  // Placeholder for initialization useEffect that will be placed after function definitions

  // Refresh functions avec useCallback pour éviter les boucles infinies
  const refreshProjects = useCallback(async (): Promise<void> => {
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
  }, []);

  const refreshMachines = useCallback(async (): Promise<void> => {
    try {
      console.log('DataContext - refreshMachines - début');
      setIsLoading(prev => ({ ...prev, machines: true }));
      setErrors(prev => ({ ...prev, machines: null }));
      const machinesData = await mockDataService.getMachines();
      console.log('DataContext - Machines récupérées:', machinesData);
      if (!Array.isArray(machinesData)) {
        console.warn('DataContext - Les machines récupérées ne sont pas un tableau:', machinesData);
        setMachines([]);
      } else {
        console.log('DataContext - Nombre de machines récupérées:', machinesData.length);
        setMachines(machinesData);
      }
    } catch (error) {
      console.error('DataContext - Failed to load machines:', error);
      setErrors(prev => ({ ...prev, machines: 'Failed to load machines' }));
      setMachines([]); // Assurer que nous avons au moins un tableau vide
    } finally {
      setIsLoading(prev => ({ ...prev, machines: false }));
      console.log('DataContext - refreshMachines - fin');
    }
  }, []);

  const refreshSafetyFunctions = useCallback(async (): Promise<void> => {
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
  }, []);

  const refreshSubComponents = useCallback(async (): Promise<void> => {
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
  }, []);

  const refreshDashboardStats = useCallback(async (): Promise<void> => {
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
  }, []);

  // CRUD operations
  // Projects
  const getProject = (id: string): Project | undefined => {
    return projects.find(project => project.id === id);
  };

  const getProjectMachines = (projectId: string): Machine[] => {
    console.log('getProjectMachines - projectId:', projectId);
    console.log('getProjectMachines - machines disponibles:', machines);
    const result = machines.filter(machine => machine.projectId === projectId);
    console.log('getProjectMachines - résultat:', result);
    return result;
  };

  const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    const newProject = await mockDataService.createProject(project);
    setProjects([...projects, newProject]);
    return newProject;
  };

  const updateProject = async (id: string, project: Partial<Project>): Promise<Project> => {
    // Mock update functionality (will be replaced with actual API call later)
    const updatedProject = { 
      ...projects.find(p => p.id === id)!, 
      ...project, 
      updatedAt: new Date().toISOString() 
    };
    setProjects(projects.map(p => p.id === id ? updatedProject : p));
    return updatedProject;
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    // Mock delete functionality (will be replaced with actual API call later)
    setProjects(projects.filter(p => p.id !== id));
    return true;
  };

  // Machines
  const getMachine = (id: string): Machine | undefined => {
    return machines.find(machine => machine.id === id);
  };

  const getMachineSafetyFunctions = (machineId: string): SafetyFunction[] => {
    return safetyFunctions.filter(sf => sf.machineId === machineId);
  };

  const createMachine = async (machine: Omit<Machine, 'id' | 'createdAt' | 'updatedAt'>): Promise<Machine> => {
    const newMachine = await mockDataService.createMachine(machine);
    setMachines([...machines, newMachine]);
    return newMachine;
  };

  const updateMachine = async (id: string, machine: Partial<Machine>): Promise<Machine> => {
    // Mock update functionality (will be replaced with actual API call later)
    const updatedMachine = { 
      ...machines.find(m => m.id === id)!, 
      ...machine, 
      updatedAt: new Date().toISOString() 
    };
    setMachines(machines.map(m => m.id === id ? updatedMachine : m));
    return updatedMachine;
  };

  const deleteMachine = async (id: string): Promise<boolean> => {
    // Mock delete functionality (will be replaced with actual API call later)
    setMachines(machines.filter(m => m.id !== id));
    return true;
  };

  // Safety Functions
  const getSafetyFunction = (id: string): SafetyFunction | undefined => {
    return safetyFunctions.find(sf => sf.id === id);
  };

  const getSafetyFunctionSubComponents = (safetyFunctionId: string): SubComponent[] => {
    return subComponents.filter(sc => sc.safetyFunctionId === safetyFunctionId);
  };

  const createSafetyFunction = async (safetyFunction: Omit<SafetyFunction, 'id' | 'createdAt' | 'updatedAt'>): Promise<SafetyFunction> => {
    const newSafetyFunction = await mockDataService.createSafetyFunction(safetyFunction);
    setSafetyFunctions([...safetyFunctions, newSafetyFunction]);
    return newSafetyFunction;
  };

  const updateSafetyFunction = async (id: string, safetyFunction: Partial<SafetyFunction>): Promise<SafetyFunction> => {
    // Mock update functionality (will be replaced with actual API call later)
    const updatedSafetyFunction = { 
      ...safetyFunctions.find(sf => sf.id === id)!, 
      ...safetyFunction, 
      updatedAt: new Date().toISOString() 
    };
    setSafetyFunctions(safetyFunctions.map(sf => sf.id === id ? updatedSafetyFunction : sf));
    return updatedSafetyFunction;
  };

  const deleteSafetyFunction = async (id: string): Promise<boolean> => {
    // Mock delete functionality (will be replaced with actual API call later)
    setSafetyFunctions(safetyFunctions.filter(sf => sf.id !== id));
    return true;
  };

  // Sub Components
  const getSubComponent = (id: string): SubComponent | undefined => {
    return subComponents.find(sc => sc.id === id);
  };

  const createSubComponent = async (subComponent: Omit<SubComponent, 'id' | 'createdAt' | 'updatedAt'>): Promise<SubComponent> => {
    const newSubComponent = await mockDataService.createSubComponent(subComponent);
    setSubComponents([...subComponents, newSubComponent]);
    return newSubComponent;
  };

  const updateSubComponent = async (id: string, subComponent: Partial<SubComponent>): Promise<SubComponent> => {
    // Mock update functionality (will be replaced with actual API call later)
    const updatedSubComponent = { 
      ...subComponents.find(sc => sc.id === id)!, 
      ...subComponent, 
      updatedAt: new Date().toISOString() 
    };
    setSubComponents(subComponents.map(sc => sc.id === id ? updatedSubComponent : sc));
    return updatedSubComponent;
  };

  const deleteSubComponent = async (id: string): Promise<boolean> => {
    // Mock delete functionality (will be replaced with actual API call later)
    setSubComponents(subComponents.filter(sc => sc.id !== id));
    return true;
  };

  // Initialize data loading
  useEffect(() => {
    console.log('DataContext - initializing data...');
    // Force immédiat pour s'assurer que les données sont chargées dès le départ
    refreshProjects();
    refreshMachines();
    refreshSafetyFunctions();
    refreshSubComponents();
    refreshDashboardStats();
    
    const initData = async () => {
      try {
        // Charger les données à nouveau de manière séquentielle
        console.log('DataContext - Loading projects...');
        await refreshProjects();
        
        console.log('DataContext - Loading machines...');
        await refreshMachines();
        
        console.log('DataContext - Loading safety functions...');
        await refreshSafetyFunctions();
        
        console.log('DataContext - Loading sub components...');
        await refreshSubComponents();
        
        console.log('DataContext - Loading dashboard stats...');
        await refreshDashboardStats();
        
        console.log('DataContext - All data initialized successfully!');
      } catch (error) {
        console.error('DataContext - Error initializing data:', error);
      }
    };
    
    initData();
  }, [refreshProjects, refreshMachines, refreshSafetyFunctions, refreshSubComponents, refreshDashboardStats]);
  
  const value: DataContextType = {
    // Data
    projects,
    machines,
    safetyFunctions,
    subComponents,
    users,
    dashboardStats,
    
    // States
    isLoading,
    errors,
    
    // CRUD operations
    // Projects
    getProject,
    getProjectMachines,
    createProject,
    updateProject,
    deleteProject,
    
    // Machines
    getMachine,
    getMachineSafetyFunctions,
    createMachine,
    updateMachine,
    deleteMachine,
    
    // Safety Functions
    getSafetyFunction,
    getSafetyFunctionSubComponents,
    createSafetyFunction,
    updateSafetyFunction,
    deleteSafetyFunction,
    
    // Sub Components
    getSubComponent,
    createSubComponent,
    updateSubComponent,
    deleteSubComponent,
    
    // Refresh data
    refreshProjects,
    refreshMachines,
    refreshSafetyFunctions,
    refreshSubComponents,
    refreshDashboardStats
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
