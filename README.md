# Intranet Project

A full-stack application with PostgreSQL, Express.js API, and React frontend.

## Project Structure

```
.
├── backend/             # Express.js API
│   ├── src/            # Source code
│   ├── db/             # Database scripts
│   └── Dockerfile      # Backend container configuration
├── frontend/           # React frontend
│   ├── src/            # Source code
│   └── Dockerfile      # Frontend container configuration
└── docker-compose.yml  # Docker services configuration
```

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository
2. Start the application:
   ```bash
   docker-compose up --build
   ```

The services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

## Environment Variables

The following environment variables are configured in the docker-compose.yml:

### Database
- POSTGRES_USER=admin
- POSTGRES_PASSWORD=password123
- POSTGRES_DB=intranet_db

### Backend
- DB_HOST=postgres
- DB_PORT=5432
- DB_USER=admin
- DB_PASSWORD=password123
- DB_NAME=intranet_db

### Frontend
- REACT_APP_API_URL=http://localhost:3001

## Development

To make changes to the application:

1. Frontend code is in the `frontend/src` directory
2. Backend code is in the `backend/src` directory
3. Database initialization scripts are in `backend/db/init.sql`

Changes to the code will automatically reload in development mode thanks to volume mounting in Docker Compose. 