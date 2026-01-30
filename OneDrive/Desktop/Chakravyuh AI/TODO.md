# Chakravyuh AI MVP Development TODO

## Backend Setup
- [x] Create `/backend` directory
- [ ] Implement `main.py` with FastAPI skeleton
- [x] Create `data_loader.py` to load and clean CSV dataset
- [x] Implement `graph_builder.py` to build NetworkX graph
- [ ] Develop `risk_engine.py` for risk scores and explanations
- [ ] Define `schemas.py` for API response models
- [x] Create sample dataset `sample_transactions.csv`

## API Exposure
- [ ] Add GET /graph/nodes endpoint
- [ ] Add GET /graph/edges endpoint
- [ ] Add GET /account/{id} endpoint

## Frontend Setup
- [x] Create `/frontend` directory with React app
- [x] Implement NetworkGraph.jsx component
- [x] Implement RiskTable.jsx component
- [x] Implement AccountDetails.jsx component
- [x] Ensure responsive design with smooth transitions
- [x] Create LandingPage.jsx
- [x] Create BankLogin.jsx
- [x] Create BankDashboard.jsx
- [x] Create InvestigationPage.jsx
- [x] Implement React Router for navigation
- [x] Add BankContext for state management
- [x] Add Navbar component
- [x] Update README.md for platform explanation

## Integration and Testing
- [x] Install backend dependencies
- [x] Install frontend dependencies
- [ ] Run backend server
- [ ] Run frontend development server
- [ ] Test APIs and UI
- [ ] Optionally integrate AI for explanations
