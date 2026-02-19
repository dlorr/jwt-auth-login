# Aegis — JWT Authentication System

A production-ready authentication system with JWT-based session management, built as a full-stack TypeScript monorepo.

**Backend:** Express + MongoDB  
**Frontend:** React + TanStack Query + Tailwind CSS

---

## ✨ Features

- 🔐 **JWT Authentication** — Access tokens (15min) + Refresh tokens (30d)
- 🔄 **Session Management** — Multi-device sessions with per-device revocation
- ✉️ **Email Verification** — Account verification via email links
- 🔑 **Password Reset** — Secure password recovery flow
- 🛡️ **Security First** — Bcrypt hashing, httpOnly cookies, CORS protection
- 📱 **Fully Responsive** — Mobile-first UI with Tailwind CSS v4

---

## 📂 Project Structure

```
aegis/
├── backend/          # Express API server
│   ├── src/
│   ├── dist/
│   └── package.json
├── frontend/         # React client
│   ├── src/
│   ├── public/
│   └── package.json
├── package.json      # Root scripts for running both
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v20+
- **npm** or **pnpm**
- **MongoDB** (local or Atlas)
- **Resend API key** (for emails)

### Installation

```bash
# Install dependencies for both backend and frontend
npm install
```

### Environment Setup

Create `.env` files in both `backend/` and `frontend/`:

**`backend/.env`:**

```env
APP_ENV=development
APP_ORIGIN=http://localhost:3005
PORT=8005
MONGO_URI=JWT_SECRET=xxxxxxxx
JWT_SECRET=xxxxxxxx
JWT_REFRESH_SECRET=xxxxxxxx
EMAIL_SENDER=xxxxxxxx
RESEND_API_KEY=re_xxxxxxxxxxxx
```

**`frontend/.env`:**

```env
VITE_API_URL=http://localhost:8005
VITE_PORT=3005
```

### Run Development Servers

```bash
# Start both backend and frontend concurrently
npm run dev

# Or run individually:
npm run dev:backend   # Backend only (http://localhost:8005)
npm run dev:frontend  # Frontend only (http://localhost:3005)
```

---

## 📜 Available Scripts

Run these from the **root directory**:

| Command                  | Description                   |
| ------------------------ | ----------------------------- |
| `npm run dev`            | Start both backend + frontend |
| `npm run dev:backend`    | Start backend only            |
| `npm run dev:frontend`   | Start frontend only           |
| `npm run build`          | Build both for production     |
| `npm run build:backend`  | Build backend TypeScript      |
| `npm run build:frontend` | Build frontend with Vite      |
| `npm start`              | Start production servers      |

---

## 🏗️ Tech Stack

### Backend

- **Express** — Web framework
- **TypeScript** — Type safety
- **MongoDB + Mongoose** — Database
- **Zod** — Schema validation
- **bcrypt** — Password hashing
- **jsonwebtoken** — JWT generation
- **Resend** — Transactional emails
- **cookie-parser** — Cookie management
- **CORS** — Cross-origin security

### Frontend

- **React 19** — UI library
- **TypeScript** — Type safety
- **TanStack Query v5** — Server state management
- **React Router v7** — Client-side routing
- **Axios** — HTTP client with interceptors
- **Tailwind CSS v4** — Utility-first styling
- **Vite** — Fast build tool

---

## 📖 Documentation

- [Backend README](./backend/README.md) — API endpoints, architecture, database schema
- [Frontend README](./frontend/README.md) — Component structure, routing, state management

---

## 🔒 Security Features

- **Rotating Refresh Tokens** — New refresh token issued on each access token rotation
- **Per-Device Sessions** — Users can view and revoke individual device sessions
- **httpOnly Cookies** — Tokens stored securely, inaccessible to JavaScript
- **CSRF Protection** — SameSite cookies + CORS whitelist
- **Auto Token Refresh** — Axios interceptor handles 401s transparently
- **Password Strength Rules** — Enforces uppercase, lowercase, numbers, special chars
- **Email Verification** — Accounts require email confirmation

---

## 🛠️ Development Workflow

### Backend Development

```bash
cd backend
npm run dev          # Auto-restart on file changes
npm run build        # Compile TypeScript to /dist
npm start            # Run production build
```

### Frontend Development

```bash
cd frontend
npm run dev          # Hot reload with Vite
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 📦 Production Deployment

### Build

```bash
npm run build        # Builds both backend and frontend
```

### Backend Deployment

- Build output: `backend/dist/`
- Set `NODE_ENV=production`
- Use a process manager like **PM2**:
  ```bash
  cd backend
  pm2 start dist/index.js --name aegis-api
  ```

### Frontend Deployment

- Build output: `frontend/dist/`
- Deploy to **Vercel**, **Netlify**, or any static host
- Update `VITE_API_URL` to your production API

---

## 📄 License

MIT License — Free to use for personal and commercial projects.

---

**Built with ❤️ using TypeScript**
