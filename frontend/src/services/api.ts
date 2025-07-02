import axios from 'axios';

// Configuration de base pour Axios
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestion des erreurs 401 (non autorisé)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types pour l'API
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Fonctions d'API pour l'authentification
export const authAPI = {
  login: (credentials: LoginCredentials) => 
    apiClient.post<AuthResponse>('/auth/login', credentials),
  
  register: (data: RegisterData) => 
    apiClient.post<AuthResponse>('/auth/register', data),
  
  forgotPassword: (email: string) => 
    apiClient.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) => 
    apiClient.post('/auth/reset-password', { token, password }),
  
  getCurrentUser: () => 
    apiClient.get<User>('/auth/me'),
};

// Exporter le client API pour une utilisation générale
export default apiClient;
