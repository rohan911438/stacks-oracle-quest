# OracleQuest: A Decentralized Prediction Market

[![CI](https://github.com/rohan911438/stacks-oracle-quest/actions/workflows/ci.yml/badge.svg)](https://github.com/rohan911438/stacks-oracle-quest/actions/workflows/ci.yml)
[![Deploy Pages](https://github.com/rohan911438/stacks-oracle-quest/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/rohan911438/stacks-oracle-quest/actions/workflows/deploy-pages.yml)
[![Deploy Contract](https://github.com/rohan911438/stacks-oracle-quest/actions/workflows/deploy-contract.yml/badge.svg)](https://github.com/rohan911438/stacks-oracle-quest/actions/workflows/deploy-contract.yml)

OracleQuest is a full-stack decentralized application (dApp) that allows users to create and participate in prediction markets. It is built on the Stacks blockchain and features a React frontend, an Express.js backend for API and data aggregation, and a Clarity smart contract for on-chain logic.

- **Author**: Rohan Kumar
- **GitHub**: [rohan911438](https://github.com/rohan911438)

## How It Works

The application is composed of three main parts: a frontend for user interaction, a backend for serving data, and a Clarity smart contract for core logic and state.

### 1. Frontend (Vite + React + TypeScript)

The user-facing application is a modern single-page application (SPA) built with Vite, React, and TypeScript.

- **UI**: Built with `shadcn/ui` and `Tailwind CSS` for a responsive and modern design.
- **Wallet Integration**: Connects to the Stacks blockchain using Leather and Xverse wallets via `@stacks/connect`. It gracefully handles cases where a wallet is not installed by guiding the user to the official download pages.
- **State Management**: Uses `React Query` for server-state caching and `React Context` for global UI state like wallet connection status.
- **Routing**: `React Router` handles all client-side navigation.

### 2. Backend (Express.js)

A lightweight Express.js server acts as an API gateway and mock data store.

- **API Routes**: Provides RESTful endpoints for fetching markets, user portfolios, and processing trades.
- **Mock Data**: The `server/store.js` file simulates a database, allowing the frontend to function without a persistent backend. This can be replaced with a real database and on-chain data indexing.
- **Local Development**: Runs concurrently with the Vite dev server for a seamless local development experience.

### 3. Smart Contract (Clarity)

The core logic resides in the `oracle-market.clar` smart contract on the Stacks blockchain.

- **Market Management**: Allows users to create and resolve prediction markets. It includes functions like `create-market-auto` (with auto-incrementing IDs) and `resolve-market`.
- **Admin Controls**: A contract owner (admin) can be set to manage critical functions. The `set-admin` function allows for secure initialization and rotation of the admin principal.
- **Safety and Guards**: The contract includes checks to prevent common issues, such as resolving a market before its end time (`ERR-TOO-EARLY`) or unauthorized actions (`ERR-UNAUTHORIZED`).
- **Versioning**: Includes a `CONTRACT-VERSION` constant for easy tracking of deployed versions.

## Technologies Used

- **Frontend**: Vite, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js
- **Blockchain**: Stacks
- **Smart Contracts**: Clarity
- **Wallet Integration**: `@stacks/connect` (Leather & Xverse)
- **CI/CD**: GitHub Actions

## Getting Started

To run this project locally, you will need Node.js and npm installed.

1.  **Clone the repository:**
    ```cmd
    git clone https://github.com/rohan911438/stacks-oracle-quest.git
    cd stacks-oracle-quest
    ```

2.  **Install dependencies:**
    ```cmd
    npm install
    ```

3.  **Set up local environment variables:**
    - Copy `.env.example` to `.env` for frontend settings (e.g., `VITE_STACKS_NETWORK`).
    - Copy `.env.contracts.example` to `.env.contracts` for contract deployment settings.

4.  **Run the development servers:**
    This command starts both the Vite frontend and the Express backend concurrently.
    ```cmd
    npm run dev
    ```
    The application will be available at `http://localhost:8080`.

## Deployment

This project is configured for automated deployments for both the frontend and the smart contract.

### Frontend (GitHub Pages)

The frontend is automatically deployed to GitHub Pages on every push to the `main` branch.

- **Workflow**: `.github/workflows/deploy-pages.yml`
- **Configuration**: To enable, go to your repository's **Settings > Pages** and set the **Source** to **GitHub Actions**.
- **API URL**: If your API is hosted separately, set a repository secret named `VITE_API_URL`. The frontend will use this URL in production builds.

### Smart Contract (Clarity)

The Clarity contract can be deployed manually via a GitHub Actions workflow.

- **Workflow**: `.github/workflows/deploy-contract.yml`
- **Prerequisites**:
    1.  Create a repository secret named `STACKS_PRIVATE_KEY` containing the private key of the deployer account (use a testnet key for safety).
    2.  Optionally, set `STACKS_API_URL` if you need to use a custom Stacks node.
- **How to Deploy**:
    1.  Go to the **Actions** tab in your GitHub repository.
    2.  Select the **Deploy Clarity Contract** workflow.
    3.  Click **Run workflow**, choose the network (`testnet` or `mainnet`), and confirm. The workflow will deploy the contract and output a link to the transaction in Hiro Explorer.

## CI/CD Workflows

The repository includes the following GitHub Actions workflows:

-   **`ci.yml`**: Runs on every push and pull request to `main`. It installs dependencies, lints the code, runs TypeScript type checks, and builds the frontend to ensure code quality and correctness.
-   **`deploy-pages.yml`**: Deploys the frontend to GitHub Pages.
-   **`deploy-contract.yml`**: Deploys the Clarity smart contract.

## Wallet Connection

-   **Supported Wallets**: Leather and Xverse.
-   **Detection**: The app detects if the chosen wallet is installed. If not, it provides a direct link to the official download page.
-   **Mobile**: On mobile devices, users are advised to use the Xverse in-app browser for the best experience.
-   **Network**: The default network for local development is `testnet`, configured in the `.env` file.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
