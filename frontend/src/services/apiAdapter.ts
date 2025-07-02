/**
 * API Adapter
 * 
 * Ce service joue le rôle d'adaptateur entre l'API réelle et les services de mock.
 * Il permet de basculer facilement entre les deux modes selon que le backend soit 
 * disponible ou non, ou selon les préférences de développement.
 */

import { authAPI as realAuthAPI } from './api';
import mockDataService from './mockDataService';

// Variable de configuration pour déterminer si on utilise le mock ou l'API réelle
// Cette valeur peut être définie par une variable d'environnement ou une configuration
const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === 'true' || !process.env.REACT_APP_API_URL;

// API unifiée qui redirige vers le mock ou l'API réelle selon la configuration
export const apiAdapter = {
  // Authentification
  auth: {
    login: (credentials: { email: string; password: string }) => {
      if (USE_MOCK_API) {
        return mockDataService.login(credentials.email, credentials.password);
      } else {
        return realAuthAPI.login(credentials);
      }
    },
    
    register: (data: { email: string; password: string; firstName: string; lastName: string }) => {
      if (USE_MOCK_API) {
        return mockDataService.register(data);
      } else {
        return realAuthAPI.register(data);
      }
    },
    
    forgotPassword: (email: string) => {
      if (USE_MOCK_API) {
        // Simulation de la récupération de mot de passe
        return Promise.resolve({ success: true });
      } else {
        return realAuthAPI.forgotPassword(email);
      }
    },
    
    resetPassword: (token: string, password: string) => {
      if (USE_MOCK_API) {
        // Simulation de la réinitialisation de mot de passe
        return Promise.resolve({ success: true });
      } else {
        return realAuthAPI.resetPassword(token, password);
      }
    },
    
    getCurrentUser: () => {
      if (USE_MOCK_API) {
        // Utiliser le service mock pour obtenir l'utilisateur actuel
        const userId = localStorage.getItem('userId');
        if (!userId) {
          return Promise.reject(new Error('No user authenticated'));
        }
        return mockDataService.getUser(userId).then(user => {
          if (!user) {
            return Promise.reject(new Error('User not found'));
          }
          return user;
        });
      } else {
        return realAuthAPI.getCurrentUser();
      }
    },
  },
  
  // Projets
  projects: {
    getAll: () => {
      if (USE_MOCK_API) {
        return mockDataService.getProjects();
      } else {
        // Intégrer avec l'API réelle quand elle sera disponible
        return Promise.reject(new Error('Real API not implemented yet'));
      }
    },
    
    getById: (id: string) => {
      if (USE_MOCK_API) {
        return mockDataService.getProject(id);
      } else {
        // Intégrer avec l'API réelle quand elle sera disponible
        return Promise.reject(new Error('Real API not implemented yet'));
      }
    },
    
    create: (project: any) => {
      if (USE_MOCK_API) {
        return mockDataService.createProject(project);
      } else {
        // Intégrer avec l'API réelle quand elle sera disponible
        return Promise.reject(new Error('Real API not implemented yet'));
      }
    },
    
    update: (id: string, project: any) => {
      if (USE_MOCK_API) {
        return mockDataService.updateProject(id, project);
      } else {
        // Intégrer avec l'API réelle quand elle sera disponible
        return Promise.reject(new Error('Real API not implemented yet'));
      }
    },
    
    delete: (id: string) => {
      if (USE_MOCK_API) {
        return mockDataService.deleteProject(id);
      } else {
        // Intégrer avec l'API réelle quand elle sera disponible
        return Promise.reject(new Error('Real API not implemented yet'));
      }
    },
  },
  
  // Machines
  machines: {
    getAll: () => {
      if (USE_MOCK_API) {
        return mockDataService.getMachines();
      } else {
        // Intégrer avec l'API réelle quand elle sera disponible
        return Promise.reject(new Error('Real API not implemented yet'));
      }
    },
    
    getById: (id: string) => {
      if (USE_MOCK_API) {
        return mockDataService.getMachine(id);
      } else {
        // Intégrer avec l'API réelle quand elle sera disponible
        return Promise.reject(new Error('Real API not implemented yet'));
      }
    },
    
    create: (machine: any) => {
      if (USE_MOCK_API) {
        return mockDataService.createMachine(machine);
      } else {
        // Intégrer avec l'API réelle quand elle sera disponible
        return Promise.reject(new Error('Real API not implemented yet'));
      }
    },
    
    update: (id: string, machine: any) => {
      if (USE_MOCK_API) {
        return mockDataService.updateMachine(id, machine);
      } else {
        // Intégrer avec l'API réelle quand elle sera disponible
        return Promise.reject(new Error('Real API not implemented yet'));
      }
    },
    
    delete: (id: string) => {
      if (USE_MOCK_API) {
        return mockDataService.deleteMachine(id);
      } else {
        // Intégrer avec l'API réelle quand elle sera disponible
        return Promise.reject(new Error('Real API not implemented yet'));
      }
    },
  },
  
  // Safety Functions
  safetyFunctions: {
    getAll: () => {
      if (USE_MOCK_API) {
        return mockDataService.getSafetyFunctions();
      } else {
        // Intégrer avec l'API réelle quand elle sera disponible
        return Promise.reject(new Error('Real API not implemented yet'));
      }
    },
    
    // Ajoutez d'autres méthodes similaires pour les fonctions de sécurité...
  },
  
  // Sub Components
  subComponents: {
    getAll: () => {
      if (USE_MOCK_API) {
        return mockDataService.getSubComponents();
      } else {
        // Intégrer avec l'API réelle quand elle sera disponible
        return Promise.reject(new Error('Real API not implemented yet'));
      }
    },
    
    // Ajoutez d'autres méthodes similaires pour les sous-composants...
  },
  
  // Dashboard Stats
  dashboard: {
    getStats: () => {
      if (USE_MOCK_API) {
        return mockDataService.getDashboardStats();
      } else {
        // Intégrer avec l'API réelle quand elle sera disponible
        return Promise.reject(new Error('Real API not implemented yet'));
      }
    },
  },
  
  // Utilitaires
  utils: {
    resetMockData: () => {
      if (USE_MOCK_API) {
        return mockDataService.resetToDefault();
      } else {
        return Promise.resolve(false);
      }
    },
    
    isUsingMock: () => USE_MOCK_API,
    
    toggleMockAPI: (useMock: boolean) => {
      // Cette fonction permettrait de basculer dynamiquement entre mock et API réelle
      // pendant l'exécution de l'application (pour développement uniquement)
      console.log(`API mode switched to: ${useMock ? 'mock' : 'real'}`);
      // En réalité, il faudrait un mécanisme pour modifier la variable USE_MOCK_API
      // et potentiellement recharger certaines données
    }
  }
};

export default apiAdapter;
