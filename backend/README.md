# Aegis Backend — API Server

Express.js API server powering Aegis authentication system with JWT-based sessions, MongoDB storage, and email notifications.

---

## 🚀 Tech Stack

- **Express.js** — Web framework
- **TypeScript** — Type-safe development
- **MongoDB + Mongoose** — Database & ODM
- **Zod** — Request validation
- **bcrypt** — Password hashing
- **jsonwebtoken** — JWT generation/verification
- **Resend** — Transactional emails
- **cookie-parser** — Secure cookie handling
- **CORS** — Cross-origin resource sharing

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── config/          # Database connection
│   ├── constants/       # Environment variables, regex patterns
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── schemas/         # Zod validation schemas
│   ├── services/        # Business logic
│   ├── utils/           # Helpers, JWT functions
│   └── index.ts         # App entry point
├── dist/                # Compiled JavaScript (build output)
├── .env                 # Environment variables
├── tsconfig.json        # TypeScript config
└── package.json
```

---

## 🏁 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server
APP_ENV=development
APP_ORIGIN=http://localhost:3005
PORT=8005

# Database
MONGO_URI=xxxxxxxx

# JWT Secrets
JWT_SECRET=xxxxxxxx
JWT_REFRESH_SECRET=xxxxxxxx

# Email (Resend)
EMAIL_SENDER=xxxxxxxx
RESEND_API_KEY=re_xxxxxxxxxxxx
```

> ⚠️ **Important:** Generate strong random secrets for production. Use `openssl rand -base64 32` to create secure keys.

### 3. Start MongoDB

**Local:**

```bash
mongod --dbpath /path/to/data
```

**MongoDB Atlas:**
Update `MONGO_URI` in `.env` with your Atlas connection string.

### 4. Run Development Server

```bash
npm run dev
```

- Auto-restarts on file changes
- Runs on `http://localhost:8005`
- TypeScript compiled on-the-fly with `ts-node-dev`

---

## 📜 Available Scripts

| Script          | Description                            |
| --------------- | -------------------------------------- |
| `npm run dev`   | Start development server (auto-reload) |
| `npm run build` | Compile TypeScript to `dist/`          |
| `npm start`     | Run production build from `dist/`      |

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint                   | Description               | Auth Required |
| ------ | -------------------------- | ------------------------- | ------------- |
| POST   | `/auth/register`           | Create new account        | No            |
| POST   | `/auth/login`              | Login with email/password | No            |
| GET    | `/auth/logout`             | Logout current session    | Yes           |
| GET    | `/auth/refresh`            | Refresh access token      | Yes (cookie)  |
| POST   | `/auth/password/forgot`    | Request password reset    | No            |
| POST   | `/auth/password/reset`     | Reset password with code  | No            |
| GET    | `/auth/email/verify/:code` | Verify email with code    | No            |

### User

| Method | Endpoint                    | Description               | Auth Required |
| ------ | --------------------------- | ------------------------- | ------------- |
| GET    | `/user`                     | Get current user          | Yes           |
| POST   | `/user/resend-verification` | Resend verification email | Yes           |

### Sessions

| Method | Endpoint            | Description             | Auth Required |
| ------ | ------------------- | ----------------------- | ------------- |
| GET    | `/session/sessions` | List all user sessions  | Yes           |
| DELETE | `/session/:id`      | Revoke specific session | Yes           |

---

## 🔒 Authentication Flow

### Registration

1. User submits email + password
2. Password hashed with bcrypt (10 rounds)
3. User created in DB (`verified: false`)
4. Verification email sent via Resend
5. Session created, JWT tokens returned in cookies

### Login

1. User submits email + password
2. Backend verifies credentials (bcrypt compare)
3. New session created with `expiresAt: 30 days`
4. Access token (15min) + Refresh token (30d) returned

### Token Refresh

1. Access token expires → Frontend gets 401
2. Frontend sends refresh token cookie to `/auth/refresh`
3. Backend validates refresh token → creates new access token
4. New access token returned (refresh token rotates if near expiry)

### Session Revocation

1. User clicks "Revoke" on a session
2. Session deleted from DB
3. That device logs out within 15 minutes (access token expiry)

---

## 🗄️ Database Schema

### User Model

```typescript
{
  email: string (unique, indexed)
  password: string (bcrypt hashed)
  verified: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Session Model

```typescript
{
  userId: ObjectId (ref: User)
  userAgent?: string
  expiresAt: Date (30 days from creation)
  createdAt: Date
}
```

### VerificationCode Model

```typescript
{
  userId: ObjectId (ref: User)
  type: "email_verification" | "password_reset"
  expiresAt: Date
  createdAt: Date
}
```

---

## 🛡️ Security Features

- **bcrypt** — Password hashing with salt rounds
- **JWT** — Stateless authentication tokens
- **httpOnly cookies** — Tokens inaccessible to JavaScript
- **CORS** — Restricted to `APP_ORIGIN` domain
- **Zod validation** — All inputs validated before processing
- **MongoDB injection protection** — Mongoose sanitizes queries
- **Rate limiting** — Email verification: 1 per 5 minutes

---

## 🧪 Testing

```bash
# Run tests (once test suite is added)
npm test
```

---

## 📦 Production Deployment

### Build

```bash
npm run build
```

Output: `dist/` directory

### Run

```bash
NODE_ENV=production npm start
```

### Process Manager (PM2)

```bash
pm2 start dist/index.js --name aegis-api
pm2 save
pm2 startup
```

### Environment Variables

Set these in your production environment (Heroku, Railway, AWS, etc.):

- `APP_ENV=production`
- `APP_ORIGIN=https://yourdomain.com`
- `MONGO_URI` (Atlas connection string recommended)
- Strong random values for `JWT_SECRET` and `JWT_REFRESH_SECRET`
- Valid `RESEND_API_KEY`

---

## 📝 Notes

- Passwords are **never** stored in plain text
- Tokens are **never** logged or exposed in responses
- Sessions expire after **30 days** of inactivity
- Access tokens valid for **15 minutes**
- Refresh tokens valid for **30 days**

---

**Built with TypeScript + Express + MongoDB**
