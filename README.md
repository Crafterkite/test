# Crafterkite

A premium multi-tenant Creative Operations OS built for modern creative teams.

## Project Structure

```
crafterkite/
├── app/                    # Next.js 14 frontend (App Router)
│   ├── (auth)/            # Auth pages: login, register
│   ├── (dashboard)/       # Protected dashboard pages
│   └── onboarding/        # Org creation flow
├── backend/               # NestJS API server
│   ├── prisma/            # Database schema & migrations
│   └── src/
│       ├── auth/          # JWT auth with refresh tokens
│       ├── common/        # Middleware, guards, decorators
│       ├── organization/  # Multi-tenant org management
│       ├── prisma/        # Prisma service
│       └── workspace/     # Workspace CRUD
├── components/            # React components
│   ├── layout/            # Sidebar, Header
│   └── ui/                # shadcn/ui components
├── hooks/                 # React Query hooks
├── lib/                   # API client, utilities
├── store/                 # Zustand state management
├── types/                 # TypeScript interfaces
├── docker-compose.yml     # Full stack Docker setup
└── .env.example           # Environment variables template
```

## Tech Stack

**Frontend**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (state management)
- TanStack Query (data fetching)
- React Hook Form + Zod (forms)

**Backend**
- NestJS + TypeScript (strict)
- Prisma + PostgreSQL
- Redis + BullMQ
- JWT (access + refresh tokens)
- Passport.js

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm 10+

## Quick Start

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd crafterkite
npm install
cd backend && npm install && cd ..
```

### 2. Start infrastructure with Docker

```bash
docker compose up postgres redis -d
```

### 3. Set up backend environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your values
```

### 4. Run database migrations

```bash
npm run prisma:migrate
npm run prisma:generate
```

### 5. Set up frontend environment

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### 6. Start development servers

```bash
# Terminal 1 - Frontend (Next.js)
npm run dev

# Terminal 2 - Backend (NestJS)
npm run backend:dev
```

Frontend runs at: http://localhost:3000
Backend API at: http://localhost:3001
Swagger docs at: http://localhost:3001/api/docs

## Docker (Full Stack)

```bash
docker compose up -d
```

## Environment Variables

### Frontend (`.env.local`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL | `http://localhost:3000` |

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Access token signing secret |
| `JWT_REFRESH_SECRET` | Refresh token signing secret |
| `JWT_ACCESS_EXPIRES_IN` | Access token TTL (default: `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL (default: `7d`) |
| `FRONTEND_URL` | Frontend URL for CORS |

## Architecture

### Multi-Tenancy

Every database table (except `organizations`) has an `org_id` column. The `TenantMiddleware` extracts and validates the `x-org-id` header on all protected routes, ensuring complete data isolation between organizations.

### Authentication Flow

1. User registers or logs in → receives JWT access token (15m) + refresh token (7d)
2. Access token sent in `Authorization: Bearer <token>` header
3. On expiry, refresh token used to obtain new tokens (rotation + reuse detection)
4. Refresh tokens are bcrypt-hashed in the database

### Security Features

- Refresh token rotation with reuse detection (all tokens revoked on reuse)
- Bcrypt hashing for passwords (12 rounds) and refresh tokens (10 rounds)
- Timing-safe login to prevent user enumeration
- Helmet.js security headers
- CORS with credentials
- Global JWT guard with `@Public()` opt-out pattern

## API Endpoints

### Auth
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

### Organizations
```
POST   /api/v1/organizations
GET    /api/v1/organizations
GET    /api/v1/organizations/:id
PATCH  /api/v1/organizations/:id
DELETE /api/v1/organizations/:id
GET    /api/v1/organizations/:id/members
```

### Workspaces (requires `x-org-id` header)
```
POST   /api/v1/workspaces
GET    /api/v1/workspaces
GET    /api/v1/workspaces/:id
PATCH  /api/v1/workspaces/:id
DELETE /api/v1/workspaces/:id
```
