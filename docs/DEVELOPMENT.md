# Sistema-Cloud Development Guide

This document provides detailed instructions for developers working on the Sistema-Cloud project.

## 🛠️ Prerequisites

Before you start, make sure you have the following installed:

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- [VS Code](https://code.visualstudio.com/) with [Remote Development Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)
- [Git](https://git-scm.com/downloads)
- [Python 3.11+](https://www.python.org/downloads/) (if developing outside Docker)
- [Node.js 18+](https://nodejs.org/) (if developing outside Docker)

## 🚀 Development with VS Code DevContainer

The easiest way to develop Sistema-Cloud is using VS Code's DevContainer feature:

1. Clone the repository:
   ```bash
   git clone https://github.com/ntexier-belenos/Sistema-Cloud.git
   cd Sistema-Cloud
   ```

2. Open the project in VS Code:
   ```bash
   code .
   ```

3. When prompted, click "Reopen in Container" or run the "Remote-Containers: Open Folder in Container" command from the VS Code command palette.

4. VS Code will build and start the development container based on the configuration in `.devcontainer/devcontainer.json`.

5. Once the container is running, you can:
   - Run the backend server: `cd /app && uvicorn app.main:app --reload`
   - Access the services:
     - Backend API: [http://localhost:8000](http://localhost:8000)
     - Frontend: [http://localhost:3000](http://localhost:3000)
     - Database: `localhost:5432`

## 👨‍💻 Manual Development Setup

If you prefer not to use the DevContainer:

### Backend

1. Navigate to the `backend` directory.
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Database

For local development without Docker:

1. Install PostgreSQL on your system.
2. Create a database named `sistema_cloud`.
3. Configure a user with username `sistema` and password `sistema`.

## 🧪 Testing

### Backend Tests

Run the backend tests with:

```bash
cd backend
pytest
```

### Frontend Tests

Run the frontend tests with:

```bash
cd frontend
npm test
```

## 📦 Building for Production

### Docker

Build and run the production containers:

```bash
docker-compose -f docker-compose.prod.yml up --build
```

### Custom Build

For custom builds, refer to the Dockerfiles in the `backend` and `frontend` directories.

## 🔄 CI/CD Pipeline

The project includes GitHub Actions workflows for continuous integration. The workflows run automatically on push to `main` and `dev` branches, as well as on pull requests to these branches.

- Backend CI: `.github/workflows/backend-ci.yml`
- Frontend CI: `.github/workflows/frontend-ci.yml`

## 🧰 Code Style

This project follows:

- [PEP 8](https://www.python.org/dev/peps/pep-0008/) for Python code
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) for JavaScript/TypeScript

Code formatting is enforced using:
- Black for Python
- ESLint + Prettier for JavaScript/TypeScript

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
