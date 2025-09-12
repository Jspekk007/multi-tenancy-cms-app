# Multi-Tenant CMS

A modern content management system built with Next.js (frontend) and NestJS (backend).

## Prerequisites

- Node.js (v18 or later)
- Yarn (v1.22 or later)
- PostgreSQL (v14 or later)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd multi-tenant-cms
```

2. Install dependencies:
```bash
yarn install:all
```

3. Set up environment variables:

For the backend, create a `.env` file in the `backend` directory:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name
JWT_SECRET=your_jwt_secret
```

For the frontend, create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Start the development servers:

To run both frontend and backend concurrently:
```bash
yarn dev
```

Or run them separately:
```bash
# Frontend only (runs on http://localhost:3000)
yarn dev:frontend

# Backend only (runs on http://localhost:3001)
yarn dev:backend
```

## Available Scripts

- `yarn dev` - Start both frontend and backend in development mode
- `yarn build` - Build both frontend and backend
- `yarn start` - Start both frontend and backend in production mode
- `yarn install:all` - Install dependencies for all packages

## Project Structure

```
multi-tenant-cms/
├── frontend/          # Next.js frontend application
├── backend/           # NestJS backend application
└── package.json       # Root package.json for managing workspaces
```

## Development

### Frontend (Next.js)

The frontend is built with Next.js and includes:
- TypeScript
- Tailwind CSS
- React Query
- Redux Toolkit

### Backend (NestJS)

The backend is built with NestJS and includes:
- TypeScript
- TypeORM
- PostgreSQL
- JWT Authentication
- Swagger API Documentation

## Releases

Semantic-release is configured to manage versions and GitHub releases per workspace.

- Storybook (GitHub Pages):
  - Config: `frontend/.releaserc.json`
  - Workflow: `.github/workflows/release-storybook.yml`
  - On push to `main` affecting `frontend/**`, builds Storybook, creates a release with tag `storybook-v<version>`, and deploys `frontend/storybook-static` to GitHub Pages.

- Frontend app:
  - Config: `frontend/.releaserc.app.json` with tag `frontend-v<version>`
  - Workflow: `.github/workflows/release-frontend.yml`
  - On push to `main` affecting `frontend/**`, builds the app and publishes a GitHub Release.

- Backend service:
  - Config: `backend/.releaserc.json` with tag `backend-v<version>`
  - Workflow: `.github/workflows/release-backend.yml`
  - On push to `main` affecting `backend/**`, builds, runs tests, and publishes a GitHub Release.

Requirements:
- Conventional commits are required for release notes and versioning (`feat:`, `fix:`, `chore:`, etc.).
- GitHub Pages must be enabled with source set to GitHub Actions for Storybook.
- The default release branch is `main`.

# 📝 Import GitHub Issues Script

This repository includes a Bash script to create GitHub issues from a CSV file. The script handles multiple labels per issue and ensures that the issue title and body are correctly parsed.

### Prerequisites

Before using the script, make sure you have:

GitHub CLI (gh) installed and authenticated

Install: https://cli.github.com/

Authenticate:

gh auth login


Python 3 installed

jq installed for JSON parsing

Install: brew install jq (macOS) or sudo apt-get install jq (Linux)

CSV Format

The script expects a CSV file with the following columns:

Column	Description
title	The title of the GitHub issue
body	The content of the issue
labels	Comma-separated list of labels to apply

Example:

title,body,labels
Add Storybook for frontend components,Set up Storybook to develop and test UI components.,frontend
Improve authentication flow,Review login/logout flow and token persistence.,frontend


⚠️ Important: Commas in the body may break the script if not removed or handled. For simplicity, it is recommended to avoid commas in the body text.

Usage

Place your CSV file in the repository root and name it github_issues.csv (or update the script to point to your file).

Make the script executable:

chmod +x create_issue.sh


Run the script:

./create_issue.sh


The script will:

Read each row from the CSV

Parse the title, body, and labels

Create a GitHub issue in the repository you are authenticated with

Handle multiple labels per issue automatically

Notes

Each row in the CSV creates one GitHub issue.

Labels must already exist in the repository; the script does not create new labels.

Ensure your CSV encoding is UTF-8.

Troubleshooting

Issue not created: Check that you are authenticated with gh and have repository write access.

Labels not applied correctly: Ensure they match exactly the labels in your GitHub repository (case-sensitive).

Commas in the body break issues: Either remove commas or use a CSV-aware parser (future improvement).

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License.