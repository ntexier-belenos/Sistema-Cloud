import CssBaseline from '@mui/material/CssBaseline';
import React, { ReactNode, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Un composant qui encapsule tous les fournisseurs de contexte nécessaires à l'application.
 * Cela inclut:
 * - ThemeProvider: pour la gestion du thème de l'application
 * - AuthProvider: pour la gestion de l'authentification
 * 
 * Note: DataProvider a été déplacé vers MainLayout pour s'assurer qu'il
 * est accessible uniquement dans les pages protégées au bon moment.
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  // Afficher un message de debug pour confirmer que le fournisseur est correctement instancié
  useEffect(() => {
    console.log('AppProviders mounted - All context providers should be available');
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <CssBaseline />
        <AuthProvider>
          {/* DataProvider est désormais dans MainLayout pour garantir sa disponibilité */}
          {children}
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};
