# DetectFlow UI (Open Source)

Web interface for administering DetectFlow pipelines based on Apache Flink.

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
app/                # Production server (Express)
├── server.js       # Serves the static build, proxies /api, exposes /health
└── package.json    # Server-only runtime dependencies
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

- Node.js 20.19+ (22 LTS recommended)
- Yarn (recommended) or npm

## Installation

```bash
git clone <your-fork-or-repo-url>
cd detectflow-ui
yarn install
```

Alternative with npm:

```bash
npm install
```

## Run Locally

Development mode:

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
yarn preview
```

or

```bash
npm run preview
```

## Run with Docker

The `Dockerfile` builds the frontend and packages it with the Express server from `app/`:

```bash
docker build -t detectflow-ui .
docker run -e VITE_API_PROXY_TARGET=https://your-backend.example.com -p 4173:4173 detectflow-ui
```

The app is available at `http://localhost:4173`; the server proxies `/api` to `VITE_API_PROXY_TARGET` and exposes a health check at `/health`.

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
```

## Scripts

- `yarn watch` / `npm run watch` - start dev server
- `yarn build` / `npm run build` - build for production
- `yarn preview` / `npm run preview` - preview production build
- `yarn lint` / `npm run lint` - run ESLint

## License

Licensed under the terms in `LICENSE`.
