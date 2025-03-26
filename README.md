<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/9113740/201498864-2a900c64-d88f-4ed4-b5cf-770bcb57e1f5.png">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/9113740/201498152-b171abb8-9225-487a-821c-6ff49ee48579.png">
</picture>

<div align="center"><strong>Hopper Dashboard</strong></div>
<div align="center">Built with the Next.js 15 App Router</div>
<br />
<div align="center">
<a href="https://dub.sh/shadcn-dashboard">View Demo</a>
<span>
</div>

## Overview

This is a starter template using the following stack:

- Framework - [Next.js 15](https://nextjs.org/13)
- Language - [TypeScript](https://www.typescriptlang.org)
- Styling - [Tailwind CSS](https://tailwindcss.com)
- Components - [Shadcn-ui](https://ui.shadcn.com)
- Schema Validations - [yup](https://zod.dev)
- State Management - [Redux](https://zustand-demo.pmnd.rs)
- Auth - [Auth.js](https://authjs.dev/)
- Tables - [Tanstack Tables](https://ui.shadcn.com/docs/components/data-table)
- Forms - [React Hook Form](https://ui.shadcn.com/docs/components/form)
- Command+k interface - [kbar](https://kbar.vercel.app/)
- Linting - [ESLint](https://eslint.org)
- Pre-commit Hooks - [Husky](https://typicode.github.io/husky/)
- Formatting - [Prettier](https://prettier.io)

_If you are looking for a React admin dashboard starter, here is the [repo](https://github.com/Kiranism/react-shadcn-dashboard-starter)._

## Pages

| Pages                                                                                 | Specifications                                                                                                                                                 |
| :------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Signup](https://next-shadcn-dashboard-starter.vercel.app/)                           | Authentication with **NextAuth** supports Social logins and email logins (Enter dummy email for demo).                                                         |
| [Dashboard (Overview)](https://next-shadcn-dashboard-starter.vercel.app/dashboard)    | Cards with recharts graphs for analytics.Parallel routes in the overview sections with independent loading, error handling, and isolated component rendering . |
| [Product](https://next-shadcn-dashboard-starter.vercel.app/dashboard/product)         | Tanstack tables with server side searching, filter, pagination by Nuqs which is a Type-safe search params state manager in nextjs                              |
| [Product/new](https://next-shadcn-dashboard-starter.vercel.app/dashboard/product/new) | A Product Form with shadcn form (react-hook-form + zod).                                                                                                       |
| [Profile](https://next-shadcn-dashboard-starter.vercel.app/dashboard/profile)         | Mutistep dynamic forms using react-hook-form and zod for form validation.                                                                                      |
| [Kanban Board](https://next-shadcn-dashboard-starter.vercel.app/dashboard/kanban)     | A Drag n Drop task management board with dnd-kit and zustand to persist state locally.                                                                         |
| [Not Found](https://next-shadcn-dashboard-starter.vercel.app/dashboard/notfound)      | Not Found Page Added in the root level                                                                                                                         |
| -                                                                                     | -                                                                                                                                                              |

## Feature based organization

```plaintext
src/
├── app/ # Next.js App Router directory
│ ├── (client)/ # Auth route group
│ │ ├── (signin)/
│ ├── (dashboard)/ # Dashboard route group
│ │ ├── layout.tsx
│ │ ├── loading.tsx
│ │ └── page.tsx
│ └── api/ # API routes
│
├── components/ # Shared components
│ ├── ui/ # UI components (buttons, inputs, etc.)
│ └── layout/ # Layout components (header, sidebar, etc.)
│
├── features/ # Feature-based modules
│ ├── feature/
│ │ ├── components/ # Feature-specific components
│ │ ├── actions/ # Server actions
│ │ ├── schemas/ # Form validation schemas
│ │ └── utils/ # Feature-specific utilities
│ │
├── lib/ # Core utilities and configurations
│ ├── auth/ # Auth configuration
│ ├── db/ # Database utilities
│ └── utils/ # Shared utilities
│
├── hooks/ # Custom hooks
│ └── use-debounce.ts
│
├── stores/ # Zustand stores
│ └── dashboard-store.ts
│
└── types/ # TypeScript types
└── index.ts
```

## Getting Started

> [!NOTE]  
> We are using **Next 15** with **React 19**, follow these steps:

Clone the repo:

```
git clone https://github.com/Kiranism/next-shadcn-dashboard-starter.git
```

- `pnpm install` ( we have legacy-peer-deps=true added in the .npmrc)
- Create a `.env.local` file by copying the example environment file:
  `cp env.example.txt .env.local`
- Add the required environment variables to the `.env.local` file.
- `pnpm run dev`

You should now be able to access the application at http://localhost:3000.

> [!WARNING]
> After cloning or forking the repository, be cautious when pulling or syncing with the latest changes, as this may result in breaking conflicts.

> [!NOTE]
> This project uses Husky for git hooks, but it's configured to skip installation in CI environments to prevent deployment issues. The `prepare` script in package.json checks for the `CI` environment variable before running Husky with `npx`.

Cheers! 🥂

## Automated Deployment with Vercel and GitHub Actions

This project is configured with an enhanced automated deployment pipeline using GitHub Actions and Vercel. The setup provides a seamless workflow for deploying your application to different environments.

### Key Features

- **Fully Automated Deployment**: Push to designated branches to trigger automatic deployments
- **Environment-Based Deployments**: Different branches deploy to different environments
- **Manual Deployment Option**: Trigger deployments manually with environment selection
- **Prisma Schema Change Detection**: Automatically handles database schema changes
- **Deployment Status Comments**: Automatically adds comments to PRs and commits with deployment status and preview URLs
- **Linting and Quality Checks**: Runs linting before deployment to ensure code quality

### Setup Instructions

1. **Create a Vercel Account and Project**:

   - Sign up or log in to [Vercel](https://vercel.com)
   - Create a new project and import your GitHub repository
   - Complete the initial setup process

2. **Obtain Vercel Deployment Tokens**:

   - Go to your Vercel account settings
   - Navigate to "Tokens" and create a new token with "Full Account" scope
   - Copy the token value (you'll need it for GitHub secrets)
   - In your Vercel project settings, note your "Project ID" and "Organization ID"

3. **Configure GitHub Repository Secrets**:

   - Go to your GitHub repository
   - Navigate to "Settings" > "Secrets and variables" > "Actions"
   - Add the following secrets:
     - `VERCEL_TOKEN`: Your Vercel token
     - `VERCEL_ORG_ID`: Your Vercel Organization ID
     - `VERCEL_PROJECT_ID`: Your Vercel Project ID

4. **Set Up Environment Variables**:

   - Create a `.env.production.local` file with your environment variables
   - Run `npm run setup-vercel` to sync these variables to Vercel
   - For CI/CD, the GitHub Actions workflow will automatically sync environment variables

5. **Test and Deploy Your Application**:

   - **Local Build Testing**: Before deploying, you can test your build locally:
     - Run `npm run vercel-build` to simulate the Vercel build process locally
     - For more detailed build logs, run `npm run vercel-build:debug`
     - This helps identify build issues before deploying to Vercel
     - If you encounter path alias issues (e.g., with `@/` imports):
       - Run `npm run check-paths` to scan for path alias issues in your codebase
       - Run `npm run fix-paths` to automatically fix path alias issues
       - Ensure your tsconfig.json paths are correctly configured
   - **Automatic Deployment**: Push to one of the deployment branches:
     - `main`: Deploys to production environment
     - `staging`: Deploys to staging environment
     - `develop`: Deploys to development environment
   - **Manual Deployment**: Go to the "Actions" tab in your GitHub repository, select the "Deploy to Vercel" workflow, click "Run workflow", and select the environment you want to deploy to.
   - **Manual Deployment via CLI**: You can also deploy directly using the provided scripts:
     - `npm run deploy:dev` - Deploy to development environment
     - `npm run deploy:staging` - Deploy to staging environment
     - `npm run deploy:prod` - Deploy to production environment

### How It Works

The deployment process is organized into modular stages for better maintainability and visibility:

#### Stage 1: Setup and Environment Configuration

- Determines the target environment based on the branch or manual selection
- Sets environment variables for subsequent stages
- Branch mapping:
  - `main` → production
  - `staging` → staging
  - `develop` → development

#### Stage 2: Lint and Check

- Checks out the code and sets up Node.js
- Installs dependencies with `--ignore-scripts` flag and CI environment variable to skip husky installation
- Detects and handles Prisma schema changes
- Runs linting to ensure code quality

#### Stage 3: Deploy to Vercel

- Uses Vercel CLI for deployments
- Automatically handles authentication with Vercel token
- Deploys to the appropriate environment based on branch or manual selection
- Production deployments use the `--prod` flag for Vercel

#### Stage 4: Post-Deployment Notifications

- Adds a comment to the PR or commit with the deployment status
- Includes the preview URL for easy access to the deployed application
- Provides environment information and deployment status

This modular pipeline ensures consistent, reliable deployments across all environments with immediate feedback on deployment status directly in GitHub. Each stage has a clear responsibility, making the workflow easier to maintain and troubleshoot.
