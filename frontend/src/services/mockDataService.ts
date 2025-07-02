// mockDataService.ts
import { v4 as uuidv4 } from 'uuid';
import { hasLocalStorageData, loadFromLocalStorage, saveToLocalStorage } from './localStorageService';
import { simulateNetwork } from './networkSimulator';

// Types
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Machine {
  id: string;
  projectId: string;
  name: string;
  description: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  yearOfManufacture: number;
  status: 'operational' | 'maintenance' | 'offline';
  lastMaintenanceDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SafetyFunction {
  id: string;
  machineId: string;
  name: string;
  description: string;
  type: string;
  plRequired: string; // PL a-e
  plAchieved: string | null; // PL a-e ou null
  category: number | null; // 1-4 ou null
  standards: string[];
  status: 'draft' | 'in_progress' | 'validated' | 'rejected';
  validatedBy: string | null;
  validatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubComponent {
  id: string;
  safetyFunctionId: string;
  name: string;
  description: string;
  type: 'sensor' | 'logic' | 'actuator';
  category: number | null; // 1-4 ou null
  mttfd: number | null; // en années
  dcavg: number | null; // en pourcentage
  ccf: number | null; // en pourcentage
  architecture: string | null; // par exemple "1oo1", "1oo2", etc.
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  createdAt: string;
}

// Données mock - maintenant avec chargement depuis le localStorage
let mockProjects: Project[] = [
  {
    id: '1',
    name: 'Ligne d\'assemblage A',
    description: 'Ligne d\'assemblage principale pour les moteurs électriques',
    createdAt: '2023-05-01T10:30:00Z',
    updatedAt: '2023-05-01T10:30:00Z'
  },
  {
    id: '2',
    name: 'Cellule robotisée B',
    description: 'Cellule avec robots collaboratifs pour l\'assemblage de précision',
    createdAt: '2023-05-10T14:20:00Z',
    updatedAt: '2023-05-10T14:20:00Z'
  },
  {
    id: '3',
    name: 'Zone de tests',
    description: 'Zone d\'essais et de tests fonctionnels',
    createdAt: '2023-05-15T09:45:00Z',
    updatedAt: '2023-05-15T09:45:00Z'
  },
];

let mockMachines: Machine[] = [
  {
    id: '1',
    projectId: '1',
    name: 'Robot 1',
    description: 'Robot articulé 6 axes',
    model: 'KR 1000',
    serialNumber: 'KR1000-123456',
    manufacturer: 'KUKA',
    yearOfManufacture: 2020,
    status: 'operational',
    lastMaintenanceDate: '2023-04-15T00:00:00Z',
    createdAt: '2023-05-01T11:00:00Z',
    updatedAt: '2023-05-01T11:00:00Z'
  },
  {
    id: '2',
    projectId: '1',
    name: 'Convoyeur A',
    description: 'Convoyeur principal',
    model: 'CV-2000',
    serialNumber: 'CV2000-78910',
    manufacturer: 'ConveyTech',
    yearOfManufacture: 2019,
    status: 'maintenance',
    lastMaintenanceDate: '2023-05-20T00:00:00Z',
    createdAt: '2023-05-01T11:15:00Z',
    updatedAt: '2023-05-20T10:00:00Z'
  },
  {
    id: '3',
    projectId: '2',
    name: 'Cobot 1',
    description: 'Robot collaboratif',
    model: 'UR10e',
    serialNumber: 'UR10E-567890',
    manufacturer: 'Universal Robots',
    yearOfManufacture: 2021,
    status: 'operational',
    lastMaintenanceDate: '2023-05-10T00:00:00Z',
    createdAt: '2023-05-10T14:30:00Z',
    updatedAt: '2023-05-10T14:30:00Z'
  },
  {
    id: '4',
    projectId: '3',
    name: 'Banc de test',
    description: 'Banc de test pour moteurs électriques',
    model: 'BT-5000',
    serialNumber: 'BT5000-112233',
    manufacturer: 'TestEquip',
    yearOfManufacture: 2018,
    status: 'offline',
    lastMaintenanceDate: '2023-04-01T00:00:00Z',
    createdAt: '2023-05-15T10:00:00Z',
    updatedAt: '2023-05-15T10:00:00Z'
  }
];

let mockSafetyFunctions: SafetyFunction[] = [
  {
    id: '1',
    machineId: '1',
    name: 'Arrêt d\'urgence',
    description: 'Fonction d\'arrêt d\'urgence du robot',
    type: 'emergency_stop',
    plRequired: 'e',
    plAchieved: 'e',
    category: 4,
    standards: ['ISO 13849-1', 'IEC 60204-1'],
    status: 'validated',
    validatedBy: 'Jean Dupont',
    validatedAt: '2023-05-10T15:30:00Z',
    createdAt: '2023-05-02T09:00:00Z',
    updatedAt: '2023-05-10T15:30:00Z'
  },
  {
    id: '2',
    machineId: '1',
    name: 'Surveillance de vitesse',
    description: 'Fonction de surveillance de vitesse sûre',
    type: 'speed_monitoring',
    plRequired: 'd',
    plAchieved: 'd',
    category: 3,
    standards: ['ISO 13849-1'],
    status: 'validated',
    validatedBy: 'Jean Dupont',
    validatedAt: '2023-05-10T15:35:00Z',
    createdAt: '2023-05-02T09:30:00Z',
    updatedAt: '2023-05-10T15:35:00Z'
  },
  {
    id: '3',
    machineId: '3',
    name: 'Détection de présence',
    description: 'Détection de présence humaine dans la zone de travail',
    type: 'presence_detection',
    plRequired: 'd',
    plAchieved: null,
    category: null,
    standards: ['ISO 13849-1', 'ISO/TS 15066'],
    status: 'in_progress',
    validatedBy: null,
    validatedAt: null,
    createdAt: '2023-05-11T11:00:00Z',
    updatedAt: '2023-05-11T11:00:00Z'
  }
];

let mockSubComponents: SubComponent[] = [
  {
    id: '1',
    safetyFunctionId: '1',
    name: 'Bouton d\'arrêt d\'urgence',
    description: 'Bouton d\'arrêt d\'urgence principal',
    type: 'sensor',
    category: 4,
    mttfd: 100, // 100 ans
    dcavg: 99, // 99%
    ccf: 80, // 80%
    architecture: '1oo1',
    createdAt: '2023-05-02T09:05:00Z',
    updatedAt: '2023-05-02T09:05:00Z'
  },
  {
    id: '2',
    safetyFunctionId: '1',
    name: 'Relais de sécurité',
    description: 'Relais de sécurité pour l\'arrêt d\'urgence',
    type: 'logic',
    category: 4,
    mttfd: 50, // 50 ans
    dcavg: 99, // 99%
    ccf: 80, // 80%
    architecture: '1oo2',
    createdAt: '2023-05-02T09:10:00Z',
    updatedAt: '2023-05-02T09:10:00Z'
  },
  {
    id: '3',
    safetyFunctionId: '1',
    name: 'Contacteur de puissance',
    description: 'Contacteur de coupure d\'alimentation',
    type: 'actuator',
    category: 4,
    mttfd: 30, // 30 ans
    dcavg: 99, // 99%
    ccf: 80, // 80%
    architecture: '1oo2',
    createdAt: '2023-05-02T09:15:00Z',
    updatedAt: '2023-05-02T09:15:00Z'
  },
  {
    id: '4',
    safetyFunctionId: '2',
    name: 'Encodeur de sécurité',
    description: 'Encodeur pour la surveillance de vitesse',
    type: 'sensor',
    category: 3,
    mttfd: 40, // 40 ans
    dcavg: 90, // 90%
    ccf: 70, // 70%
    architecture: '1oo1',
    createdAt: '2023-05-02T09:35:00Z',
    updatedAt: '2023-05-02T09:35:00Z'
  },
  {
    id: '5',
    safetyFunctionId: '3',
    name: 'Scanner laser de sécurité',
    description: 'Scanner laser pour la détection de présence',
    type: 'sensor',
    category: null,
    mttfd: null,
    dcavg: null,
    ccf: null,
    architecture: null,
    createdAt: '2023-05-11T11:05:00Z',
    updatedAt: '2023-05-11T11:05:00Z'
  }
];

let mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'jean.dupont@example.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'user',
    createdAt: '2023-01-15T00:00:00Z'
  },
  {
    id: '3',
    email: 'marie.martin@example.com',
    firstName: 'Marie',
    lastName: 'Martin',
    role: 'user',
    createdAt: '2023-02-01T00:00:00Z'
  }
];

// Charger les données depuis le localStorage si elles existent
if (typeof window !== 'undefined' && hasLocalStorageData()) {
  const localData = loadFromLocalStorage();
  if (localData.projects) mockProjects = localData.projects;
  if (localData.machines) mockMachines = localData.machines;
  if (localData.safetyFunctions) mockSafetyFunctions = localData.safetyFunctions;
  if (localData.subComponents) mockSubComponents = localData.subComponents;
  if (localData.users) mockUsers = localData.users;
  
  console.log('Données chargées depuis le localStorage');
} else {
  console.log('Aucune donnée dans le localStorage, utilisation des données par défaut');
  // Si pas de données locales, sauvegarder les données par défaut
  if (typeof window !== 'undefined') {
    saveToLocalStorage({
      projects: mockProjects,
      machines: mockMachines,
      safetyFunctions: mockSafetyFunctions,
      subComponents: mockSubComponents,
      users: mockUsers
    });
  }
}

// Interface pour les statistiques du tableau de bord
export interface DashboardStats {
  projects: {
    total: number;
    active: number;
    archived: number;
    by_status: {
      draft: number;
      in_progress: number;
      completed: number;
      archived: number;
    };
  };
  machines: {
    total: number;
    by_risk: {
      low: number;
      medium: number;
      high: number;
    };
  };
  safety_functions: {
    total: number;
    by_status: {
      compliant: number;
      non_compliant: number;
    };
    by_pl: {
      a: number;
      b: number;
      c: number;
      d: number;
      e: number;
    };
  };
}

// Fonction pour wrapper les méthodes du service avec le simulateur réseau
const withNetworkSimulation = <T>(
  operation: () => Promise<T> | T,
  errorMessage: string
): Promise<T> => {
  return simulateNetwork(operation, errorMessage);
};

// Service de données mock
const mockDataService = {
  // Dashboard
  getDashboardStats: () => {
    return withNetworkSimulation(() => {
      const dashboardStats: DashboardStats = {
        projects: {
          total: mockProjects.length,
          active: mockProjects.length - 0, // Supposons qu'aucun n'est archivé pour l'instant
          archived: 0,
          by_status: {
            draft: Math.floor(mockProjects.length * 0.3),
            in_progress: Math.floor(mockProjects.length * 0.5),
            completed: Math.floor(mockProjects.length * 0.2),
            archived: 0
          }
        },
        machines: {
          total: mockMachines.length,
          by_risk: {
            low: Math.floor(mockMachines.length * 0.4),
            medium: Math.floor(mockMachines.length * 0.4),
            high: Math.floor(mockMachines.length * 0.2)
          }
        },
        safety_functions: {
          total: mockSafetyFunctions.length,
          by_status: {
            compliant: mockSafetyFunctions.filter(sf => sf.plAchieved && sf.plAchieved >= sf.plRequired).length,
            non_compliant: mockSafetyFunctions.filter(sf => !sf.plAchieved || sf.plAchieved < sf.plRequired).length
          },
          by_pl: {
            a: mockSafetyFunctions.filter(sf => sf.plRequired === 'a').length,
            b: mockSafetyFunctions.filter(sf => sf.plRequired === 'b').length,
            c: mockSafetyFunctions.filter(sf => sf.plRequired === 'c').length,
            d: mockSafetyFunctions.filter(sf => sf.plRequired === 'd').length,
            e: mockSafetyFunctions.filter(sf => sf.plRequired === 'e').length
          }
        }
      };
      return Promise.resolve(dashboardStats);
    }, 'Failed to load dashboard stats');
  },
  
  // Projets
  getProjects: () => {
    return withNetworkSimulation(() => Promise.resolve(mockProjects), 'Failed to load projects');
  },
  getProject: (id: string) => {
    return withNetworkSimulation(
      () => Promise.resolve(mockProjects.find(p => p.id === id) || null),
      `Failed to load project with ID: ${id}`
    );
  },
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    return withNetworkSimulation(() => {
      const now = new Date().toISOString();
      const newProject: Project = {
        id: uuidv4(),
        ...project,
        createdAt: now,
        updatedAt: now
      };
      mockProjects.push(newProject);
      
      // Sauvegarder les changements dans le localStorage
      saveToLocalStorage({ projects: mockProjects });
      
      return Promise.resolve(newProject);
    }, 'Failed to create project');
  },
  updateProject: (id: string, updates: Partial<Project>) => {
    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) return Promise.reject(new Error('Project not found'));
    
    const now = new Date().toISOString();
    mockProjects[index] = {
      ...mockProjects[index],
      ...updates,
      updatedAt: now
    };
    
    // Sauvegarder les changements dans le localStorage
    saveToLocalStorage({ projects: mockProjects });
    
    return Promise.resolve(mockProjects[index]);
  },
  deleteProject: (id: string) => {
    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) return Promise.resolve(false);
    
    mockProjects.splice(index, 1);
    
    // Sauvegarder les changements dans le localStorage
    saveToLocalStorage({ projects: mockProjects });
    
    return Promise.resolve(true);
  },
  
  // Machines
  getMachines: (projectId?: string) => {
    try {
      console.log('mockDataService.getMachines - début, mockMachines.length:', mockMachines.length);
      console.log('mockDataService.getMachines - projectId:', projectId);
      const result = projectId ? mockMachines.filter(m => m.projectId === projectId) : mockMachines;
      console.log('mockDataService.getMachines - résultats filtrés:', result.length);
      // Ensure we always return an array
      const finalResult = Array.isArray(result) ? result : [];
      console.log('mockDataService.getMachines - fin, retourne:', finalResult.length, 'machines');
      return Promise.resolve(finalResult);
    } catch (err) {
      console.error("Error in getMachines:", err);
      return Promise.resolve([]);
    }
  },
  getMachine: (id: string) => Promise.resolve(mockMachines.find(m => m.id === id) || null),
  createMachine: (machine: Omit<Machine, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newMachine: Machine = {
      id: uuidv4(),
      ...machine,
      createdAt: now,
      updatedAt: now
    };
    mockMachines.push(newMachine);
    
    // Sauvegarder les changements dans le localStorage
    saveToLocalStorage({ machines: mockMachines });
    
    return Promise.resolve(newMachine);
  },
  updateMachine: (id: string, updates: Partial<Machine>) => {
    const index = mockMachines.findIndex(m => m.id === id);
    if (index === -1) return Promise.reject(new Error('Machine not found'));
    
    const now = new Date().toISOString();
    mockMachines[index] = {
      ...mockMachines[index],
      ...updates,
      updatedAt: now
    };
    
    // Sauvegarder les changements dans le localStorage
    saveToLocalStorage({ machines: mockMachines });
    
    return Promise.resolve(mockMachines[index]);
  },
  deleteMachine: (id: string) => {
    const index = mockMachines.findIndex(m => m.id === id);
    if (index === -1) return Promise.resolve(false);
    
    mockMachines.splice(index, 1);
    
    // Sauvegarder les changements dans le localStorage
    saveToLocalStorage({ machines: mockMachines });
    
    return Promise.resolve(true);
  },
  
  // Fonctions de sécurité
  getSafetyFunctions: (machineId?: string) => Promise.resolve(
    machineId ? mockSafetyFunctions.filter(sf => sf.machineId === machineId) : mockSafetyFunctions
  ),
  getSafetyFunction: (id: string) => Promise.resolve(mockSafetyFunctions.find(sf => sf.id === id) || null),
  createSafetyFunction: (safetyFunction: Omit<SafetyFunction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newSafetyFunction: SafetyFunction = {
      id: uuidv4(),
      ...safetyFunction,
      createdAt: now,
      updatedAt: now
    };
    mockSafetyFunctions.push(newSafetyFunction);
    
    // Sauvegarder les changements dans le localStorage
    saveToLocalStorage({ safetyFunctions: mockSafetyFunctions });
    
    return Promise.resolve(newSafetyFunction);
  },
  updateSafetyFunction: (id: string, updates: Partial<SafetyFunction>) => {
    const index = mockSafetyFunctions.findIndex(sf => sf.id === id);
    if (index === -1) return Promise.reject(new Error('Safety function not found'));
    
    const now = new Date().toISOString();
    mockSafetyFunctions[index] = {
      ...mockSafetyFunctions[index],
      ...updates,
      updatedAt: now
    };
    
    // Sauvegarder les changements dans le localStorage
    saveToLocalStorage({ safetyFunctions: mockSafetyFunctions });
    
    return Promise.resolve(mockSafetyFunctions[index]);
  },
  deleteSafetyFunction: (id: string) => {
    const index = mockSafetyFunctions.findIndex(sf => sf.id === id);
    if (index === -1) return Promise.resolve(false);
    
    mockSafetyFunctions.splice(index, 1);
    
    // Sauvegarder les changements dans le localStorage
    saveToLocalStorage({ safetyFunctions: mockSafetyFunctions });
    
    return Promise.resolve(true);
  },
  
  // Sous-composants
  getSubComponents: (safetyFunctionId?: string) => Promise.resolve(
    safetyFunctionId ? mockSubComponents.filter(sc => sc.safetyFunctionId === safetyFunctionId) : mockSubComponents
  ),
  getSubComponent: (id: string) => Promise.resolve(mockSubComponents.find(sc => sc.id === id) || null),
  createSubComponent: (subComponent: Omit<SubComponent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newSubComponent: SubComponent = {
      id: uuidv4(),
      ...subComponent,
      createdAt: now,
      updatedAt: now
    };
    mockSubComponents.push(newSubComponent);
    
    // Sauvegarder les changements dans le localStorage
    saveToLocalStorage({ subComponents: mockSubComponents });
    
    return Promise.resolve(newSubComponent);
  },
  updateSubComponent: (id: string, updates: Partial<SubComponent>) => {
    const index = mockSubComponents.findIndex(sc => sc.id === id);
    if (index === -1) return Promise.reject(new Error('Sub-component not found'));
    
    const now = new Date().toISOString();
    mockSubComponents[index] = {
      ...mockSubComponents[index],
      ...updates,
      updatedAt: now
    };
    
    // Sauvegarder les changements dans le localStorage
    saveToLocalStorage({ subComponents: mockSubComponents });
    
    return Promise.resolve(mockSubComponents[index]);
  },
  deleteSubComponent: (id: string) => {
    const index = mockSubComponents.findIndex(sc => sc.id === id);
    if (index === -1) return Promise.resolve(false);
    
    mockSubComponents.splice(index, 1);
    
    // Sauvegarder les changements dans le localStorage
    saveToLocalStorage({ subComponents: mockSubComponents });
    
    return Promise.resolve(true);
  },
  
  // Utilisateurs (pour le développement uniquement)
  getUsers: () => Promise.resolve(mockUsers),
  getUser: (id: string) => Promise.resolve(mockUsers.find(u => u.id === id) || null),
  
  // Authentification mock
  login: (email: string, password: string) => {
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password') {
      return Promise.resolve({
        access_token: 'mock_access_token',
        token_type: 'bearer',
        user
      });
    }
    return Promise.reject(new Error('Identifiants invalides'));
  },
  register: (userData: { email: string, password: string, firstName: string, lastName: string }) => {
    const now = new Date().toISOString();
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      return Promise.reject(new Error('Cet email est déjà utilisé'));
    }
    const newUser: User = {
      id: uuidv4(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: 'user',
      createdAt: now
    };
    mockUsers.push(newUser);
    return Promise.resolve({
      access_token: 'mock_access_token',
      token_type: 'bearer',
      user: newUser
    });
  },
  
  // Utilitaires pour le testing et le développement
  resetToDefault: () => {
    // Fonction pour réinitialiser les données aux valeurs par défaut
    // Utile pour les tests ou pour réinitialiser l'application
    
    // Recharger les données initiales (nécessiterait de les stocker séparément)
    // Pour l'instant, rechargez simplement la page
    console.log('Réinitialisation des données - Rechargez la page pour appliquer les changements');
    if (typeof window !== 'undefined') {
      // Effacer le localStorage
      localStorage.clear();
      // Recharger la page
      window.location.reload();
    }
    
    return Promise.resolve(true);
  }
};

export default mockDataService;
