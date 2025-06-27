# Custom Instructions for Sistema-Cloud Repository

## 🛠️ Development Environment Setup

### Backend

1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the development server:
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

- Default credentials:
  - **User**: `sistema`
  - **Password**: `sistema`
  - **Database**: `sistema_cloud`

## 🚀 Deployment

### Docker

1. Build and start all services:
   ```bash
   docker-compose up --build
   ```
2. Access the services:
   - Backend: [http://localhost:8000](http://localhost:8000)
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Database: `localhost:5432`

### Kubernetes (Optional)

- Use the provided `k8s` manifests for production deployment.

## 📋 Contribution Guidelines

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create a pull request.

## 🧭 Useful Links

- [Documentation](../docs/README.md)
- [Roadmap](../docs/ROADMAP.md)
- [Development Guide](../docs/DEVELOPMENT.md)

---

**🔗 Repository URL:** [https://github.com/ntexier-belenos/Sistema-Cloud](https://github.com/ntexier-belenos/Sistema-Cloud)
