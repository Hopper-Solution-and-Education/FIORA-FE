# 📖 Guide to Hopper Dashboard

Welcome to the **Hopper Dashboard**!  
This is a powerful frontend project built with **Next.js**, designed with a feature-based architecture to optimize developer experience (DX) and performance for administrative, reporting, transactional, and settings modules.

---

## 🛠 Project Overview
The Hopper Dashboard is a modern, scalable frontend application tailored for efficient management and visualization of data. It leverages a robust tech stack to ensure type safety, responsive UI, and seamless state management.

**Key Technologies:**
- **Framework:** Next.js 15 (React 19) 🚀
- **Language:** TypeScript 🛡️
- **UI/Styling:** Tailwind CSS, shadcn/ui, Radix UI 🎨
- **State Management:** Redux Toolkit, Redux Persist 🗃️
- **Authentication:** Auth.js (NextAuth) 🔐
- **Forms:** React Hook Form, Yup/Zod 📝
- **Data Tables:** TanStack Table 📊
- **Data & Utilities:** SWR, date-fns, lodash, kbar, recharts ⚙️
- **Code Quality:** ESLint, Prettier, Husky, lint-staged ✅
- **ORM:** Prisma (database pull/generate) 🗄️

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
Ensure you have the following installed:
- Node.js (v18 or higher recommended) 🟢
- bun (preferred) or pnpm/npm/yarn 📦
- Git 🌿

### 2️⃣ Installation
```bash
git clone <repo_url>
cd FIORA-FE-DEV
npm install  # or bun install / pnpm install / yarn install
```

### 3️⃣ Environment Setup
You can use either `.env` or `.env.development.local` for environment variables.

**Option 1:** `.env`
```bash
cp .env.example .env.local
```
**Option 2:** `.env.development.local`
If you want to use `.env.development.local`, install `dotenv-cli` globally:
```bash
npm install -g dotenv-cli
cp .env.example .env.development.local
```

### 4️⃣ Prisma Setup
```bash
npx prisma db pull && npx prisma generate
```

### 5️⃣ Running the Development Server
```bash
npm run dev
```
App runs at: <a>http://localhost:3000</a>

## 🏗️ Building the Application
```bash
npm run build
```

## 🧹 Code Formatting & Linting
```bash
npm run format   # Format code
npm run check    # Check formatting
npm run lint     # Lint code
```

## 🗑️ Cleaning the Project
```bash
npm run clean
```

## 🌍 Environment Variables
Example `.env.example`:
```bash
NODE_ENV='development'
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
NEXTAUTH_URL=http://localhost:3000/

NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# DATABASE_URL=

SENDGRID_API_KEY=
SENDER_EMAIL=
REDIS_URL=
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_AMPLITUDE_API_KEY=

NEXT_PRIVATE_GROWTHBOOK_API_KEY=
NEXT_DECRYPTION_GROWTHBOOK_KEY=
NEXT_PUBLIC_GROWTHBOOK_API_HOST=
NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY=
NEXT_PUBLIC_GROWTHBOOK_API_ENDPOINT=

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Other APIs
EXCHANGE_RATE_API_KEY=
```

## 🛠 Troubleshooting
### Build issues:
```bash
npm run clean
npm install
```

### Prisma issues:
- Ensure `DATABASE_URL` is set
- Verify keys in .env / .env.development.local
```bash
npx prisma db pull && npx prisma generate
```
### Happy coding! 🚀