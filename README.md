# Project Demo

This project is a demo web application with a backend (Express) and frontend (React), along with Playwright-based tests for both API and UI. The project demonstrates how to integrate frontend and backend with tests, and is used to examine different options for test management.

## Project Structure

- React frontend code
- Express backend code
- Playwright test scripts
- GitHub Actions CI/CD configuration
- Dependencies for the whole project
- Project description and setup instructions

## Prerequisites

- Node.js (v18 or above) installed
- npm or yarn package manager

## Installation

To set up the project, clone the repository and install dependencies for both frontend and backend.

### 1. Clone the repository:
```bash
git clone https://github.com/your-username/project-demo.git
cd project-demo
```

### 2. Install dependencies:
- Backend: Go to the /backend folder and run:
```bash
cd backend
npm install
```

- Frontend: Go to the /frontend folder and run:
```bash
cd frontend
npm install
```

## Running the project

### 1. Running the Backend:
```bash
cd backend
npm start
```

### 2. Running the Frontend:
```bash
cd frontend
npm start
```

### 3. Running the Tests:

- To run the backend tests, go to the /backend folder and run:
```bash
cd backend
npm run tests
```

- To run the frontend tests, go to the /backend folder and run:
```bash
cd frontend
npm run tests
```

Here is the content in markdown format:

markdown
Copy code
## CI/CD Pipeline

The project includes a CI/CD pipeline set up with GitHub Actions. When pushing to GitHub, the tests are automatically run in the pipeline, ensuring the backend and frontend code is correctly tested and deployed.

### GitHub Actions Workflow:

The CI/CD pipeline configuration is stored in the `.github` directory, and it will trigger the following steps:

1. Install dependencies.
2. Run both backend and frontend tests.
3. Deploy the application (if applicable).
