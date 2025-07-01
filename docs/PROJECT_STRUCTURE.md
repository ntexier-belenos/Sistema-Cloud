# Sistema-Cloud Project Structure

.
├── .devcontainer/
│   └── devcontainer.json       # VS Code development container config
├── .github/
│   ├── custom_instructions.md  # GitHub specific instructions
│   ├── workflows/              # CI/CD GitHub Actions
│   │   ├── backend-ci.yml
│   │   └── frontend-ci.yml
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI application entry point
│   │   ├── api/                # API endpoints
│   │   ├── core/               # Core functionality (config, security)
│   │   ├── db/                 # Database models and connections
│   │   ├── models/             # Pydantic models for data validation
│   │   └── services/           # Business logic
│   ├── Dockerfile              # Backend Docker config
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── public/                 # Static assets
│   ├── src/                    # React application source
│   │   ├── components/         # UI components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service clients
│   │   ├── utils/              # Utility functions
│   │   ├── App.js              # Main React component
│   │   └── index.js            # Entry point
│   ├── Dockerfile              # Frontend Docker config
│   └── package.json            # Node.js dependencies
├── docker-compose.yml          # Docker Compose configuration
├── .gitignore                  # Git ignore file
├── DEV-EN.md                   # English project specification
├── DEV.md                      # French project specification
└── README.md                   # Project documentation
