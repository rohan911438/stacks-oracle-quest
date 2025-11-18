# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/9580911c-6bdf-41f0-94e1-c1f38caa2693

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9580911c-6bdf-41f0-94e1-c1f38caa2693) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9580911c-6bdf-41f0-94e1-c1f38caa2693) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## CI/CD Workflows (GitHub Actions)

This repo includes end-to-end workflows to keep the app healthy and easy to ship:

- CI (`.github/workflows/ci.yml`): Runs on push/PR to `main`.
	- Installs deps, lints, TypeScript typechecks, and builds.
	- Uploads the production `dist` as a build artifact.
- Pages Deploy (`.github/workflows/deploy-pages.yml`): Builds and deploys the frontend to GitHub Pages on push to `main`.

### Configure Deployments

- Enable Pages: Repo Settings → Pages → Build and deployment → GitHub Actions.
- Optional backend URL: If your API is hosted separately, set a repo secret `VITE_API_URL` to the API origin (e.g. `https://oracle-quest-api.example.com`). The frontend will call `${VITE_API_URL}/api/...` when provided; otherwise it uses same-origin.
- Local env: Copy `.env.example` to `.env` and set `VITE_API_URL` if needed.

### Useful Commands

```cmd
:: Install dependencies
npm i

:: Run full dev (client + server)
npm run dev

:: Lint and typecheck locally
npm run lint
npm run typecheck

:: Build production assets
npm run build
```

## Next: Contract Deployment

Once you're ready to deploy smart contracts, share your target chain and toolchain (e.g., Stacks/Clarity, EVM/Foundry/Hardhat). I can wire a dedicated workflow that:

- Lints and tests the contracts.
- Builds/artifacts and posts them as PR artifacts.
- Automates testnet deploys on tag/PR.
- Promotes to mainnet on a protected `release` workflow with manual approval.

We’ll also add environment variables and secrets for keys securely via GitHub Environments.

## Wallet Connection

- Supported wallets: Leather and Xverse via `@stacks/connect`.
- If a wallet is not detected, the connect dialog shows install links:
	- Leather: https://leather.io/
	- Xverse: https://www.xverse.app/download
- Mobile: Open this site in Xverse’s in-app browser for the smoothest connect experience.
- Local network default: testnet. To switch:

```cmd
:: Use testnet (default in .env)
set VITE_STACKS_NETWORK=testnet

:: Or switch to mainnet
set VITE_STACKS_NETWORK=mainnet
```

If you deploy the API separately, set `VITE_API_URL` to the API origin. For GitHub Pages, the build already sets a base path for correct asset URLs.
