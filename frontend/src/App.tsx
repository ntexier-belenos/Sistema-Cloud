import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// Layouts
import AuthLayout from './components/layouts/AuthLayout';
import MainLayout from './components/layouts/MainLayout';

// Auth Pages
import ForgotPassword from './pages/auth/ForgotPassword';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// App Pages
import Dashboard from './pages/Dashboard';
import Help from './pages/Help';
import MachineDetail from './pages/machines/MachineDetail';
import MachinesList from './pages/machines/MachinesList';
import ProjectCreate from './pages/projects/ProjectCreate';
import ProjectDetail from './pages/projects/ProjectDetail';
import Projects from './pages/projects/Projects';
import ReportsPage from './pages/reports/ReportsPage';
import SafetyFunctionDetail from './pages/safety/SafetyFunctionDetail';
import SafetyFunctionsList from './pages/safety/SafetyFunctionsList';
import ComponentLibrary from './pages/components/ComponentLibrary';

// Context
import { useAuth } from './contexts/AuthContext';

// Debug Tools
import DeveloperTools from './components/debug/DeveloperTools';
import DataDebugPage from './pages/debug/DataDebugPage';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // Log pour s'assurer que l'app est bien montée
  useEffect(() => {
    console.log('App component mounted - Authentication status:', isAuthenticated);
  }, [isAuthenticated]);
  
  useEffect(() => {
    console.log('App component mounted');
  }, []);

  // Helper pour gérer la redirection basée sur l'authentification
  const renderProtectedRoute = (Component: React.ComponentType<any>) => {
    return isAuthenticated ? <Component /> : <Navigate to="/login" />;
  };

  return (
    <Box sx={{ height: '100vh' }}>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/" />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={renderProtectedRoute(Dashboard)} />
          
          {/* Projects Routes */}
          <Route path="/projects" element={renderProtectedRoute(Projects)} />
          <Route path="/projects/new" element={renderProtectedRoute(ProjectCreate)} />
          <Route path="/projects/:id" element={renderProtectedRoute(ProjectDetail)} />
          
          {/* Machines Routes */}
          <Route path="/machines" element={renderProtectedRoute(MachinesList)} />
          <Route path="/machines/:id" element={renderProtectedRoute(MachineDetail)} />
          <Route path="/projects/:projectId/machines" element={renderProtectedRoute(MachinesList)} />
          
          {/* Safety Functions Routes */}
          <Route path="/safety-functions" element={renderProtectedRoute(SafetyFunctionsList)} />
          <Route path="/safety-functions/:id" element={renderProtectedRoute(SafetyFunctionDetail)} />
          
          {/* Reports Route */}
          <Route path="/reports" element={renderProtectedRoute(ReportsPage)} />
          
          {/* Component Library Route */}
          <Route path="/components" element={renderProtectedRoute(ComponentLibrary)} />
          
          {/* Help/Documentation Route */}
          <Route path="/docs" element={renderProtectedRoute(Help)} />
          
          {/* Debug Route */}
          <Route path="/debug" element={renderProtectedRoute(DataDebugPage)} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} />} />
      </Routes>

      {/* Developer Tools - disponible en mode développement */}
      <DeveloperTools />
    </Box>
  );
};

export default App;
