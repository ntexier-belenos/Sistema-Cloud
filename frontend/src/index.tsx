import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProviders } from './AppProviders';

// Configure console to help debug context issues
console.log('Application initializing - Setting up context providers');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // Removing StrictMode temporarily to avoid double mounting which can complicate debugging
  // <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  // </React.StrictMode>
);
