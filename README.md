# DetectFlow UI

Web interface for administering DetectFlow pipelines.
This project is a component of SOC Prime DetectFlow OSS. See its [README](https://github.com/socprime/detectflow-main) for more details and instructions.

## Description

This project is a React + TypeScript application for:

- viewing pipeline topology and runtime state;
- managing pipelines and their configuration;
- configuring repositories, topics, filters, log sources, and runtime settings.

The repository contains the open-source edition only.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- React Hook Form
- Tailwind CSS + SCSS
- Monaco Editor
- React Flow (`@xyflow/react`)
- TanStack Table
- Radix UI

## Project Structure

```text
src/
├── components/     # Shared UI components
├── pages/          # Route pages
├── hooks/          # Reusable hooks
├── store/          # Zustand stores
├── models/         # API and domain models
├── utils/          # Utilities
├── config/         # App configuration
└── assets/         # Static assets
```

## Requirements

- Node.js 18+
- Yarn (recommended) or npm

### Docker

```bash
docker build -t detectflow-matchnode .
docker run -p 8000:8000 --env-file .env detectflow-matchnode
```

## Development

```bash
git clone <your-fork-or-repo-url>
cd etl-admin-panel-ui
yarn install
```

Alternative with npm:

```bash
npm install
```

## Run Locally


```bash
yarn watch
```

or

```bash
npm run watch
```

By default, the app runs on `http://localhost:5173`.

## Build

```bash
yarn build
```

or

```bash
npm run build
```

Preview production build:

```bash
yarn prod
```

or

```bash
npm run prod
```

## Configuration

Create `.env` in the project root:

Example variables:

```bash
# API base URL
VITE_API_BASE_URL=/api/v1

# Backend proxy target for the dev server
VITE_API_PROXY_TARGET=https://example.com

# Allowed hosts for Vite preview (comma-separated)
VITE_PREVIEW_ALLOWED_HOSTS=example.com

# Optional explicit environment (local | dev | prod)
VITE_ENVIRONMENT_STAGE=local

# SSE controls
VITE_SSE_ENABLED=true
VITE_SSE_RECONNECT=true
VITE_SSE_RECONNECT_INTERVAL=3000
VITE_SSE_RECONNECT_ATTEMPTS=10
```

## Scripts

- `yarn watch` / `npm run watch` - start dev server
- `yarn build` / `npm run build` - build for production
- `yarn prod` / `npm run prod` - preview production build
- `yarn lint` / `npm run lint` - run ESLint

## License

Licensed under the terms in `LICENSE`.
