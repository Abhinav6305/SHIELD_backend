This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the optimizations are bundled.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you may `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you don't need to eject to use it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
=======
# Chakravyuh AI - Fraud Intelligence Platform Demo

This is a hackathon MVP demonstrating a multi-tenant fraud intelligence platform for banks. It simulates how banks onboard, login, and investigate fraud using network-based analysis.

## Features

- **Landing Page**: Product introduction and entry point
- **Bank Selection**: Simulate login by selecting Demo Bank A or Demo Bank B
- **Bank Dashboard**: Overview of monitored accounts and high-risk alerts
- **Fraud Investigation**: Interactive network graph, risk table, and account details
- **Multi-Tenant Simulation**: Different datasets per bank (simulated via frontend state)

## Tech Stack

- React with React Router for navigation
- Cytoscape.js for network visualization
- Context API for state management
- Responsive CSS for smooth transitions

## Running the App

1. Install dependencies: `npm install`
2. Start the development server: `npm start`
3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Click "Login as Bank" on the landing page
2. Select a demo bank from the dropdown
3. View the bank dashboard with stats
4. Click "Open Fraud Investigation" to explore the fraud analysis tools
5. Interact with the network graph and risk table to investigate accounts

## Notes

- This is a simulation for hackathon demonstration purposes
- No real authentication or backend integration
- Data is mocked for illustration
- Focus on user experience and platform feel

## Backend Integration

The backend (FastAPI) serves different datasets based on bank_id query parameter. See backend/README.md for details.
