# Sistema-Cloud Frontend

This directory contains the React TypeScript frontend for the Sistema-Cloud application, a platform for machine safety analysis.

## Features

- Authentication (Login, Register, Forgot Password)
- Dashboard for system overview
- Project management
- Machine management
- Safety function analysis
- Theme switching (dark/light mode)

## Technologies Used

- React 18
- TypeScript 4.9
- Material-UI (MUI) 5
- React Router 6
- Formik & Yup for form handling
- Chart.js for data visualization

## Development

1. Start the frontend:

   ```bash
   cd /workspace
   ./dev-start.sh
   ```

2. The application will be available at http://localhost:3000

## Project Structure

- `src/components/` - Reusable UI components
- `src/contexts/` - React context providers (auth, theme)
- `src/pages/` - Application pages and views
- `src/services/` - API and data services
- `src/utils/` - Utility functions and helpers

## Mock Data

Currently using mock data services for development. The backend API integration will be added in a future phase.

## Notes

This is a development version with mock data. For production use, connect to the Sistema-Cloud backend API.
