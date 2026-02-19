# Aegis Frontend — React Client

React client for Aegis authentication system with JWT session management, built using TanStack Query for server state and Tailwind CSS v4 for styling.

---

## 🚀 Tech Stack

- **React 19** — UI library with new hooks
- **TypeScript** — Type-safe development
- **TanStack Query v5** — Server state management, caching, refetching
- **React Router v7** — Client-side routing with layouts
- **Axios** — HTTP client with token refresh interceptor
- **Tailwind CSS v4** — Utility-first styling with CSS variables
- **Vite** — Fast build tool and dev server
- **Syne + DM Sans** — Custom font pairing (Google Fonts)

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── api/             # Axios client + API functions
│   ├── components/
│   │   ├── layout/      # AuthLayout, ProtectedLayout, VerifyEmailLayout
│   │   └── ui/          # FormField, Alert, Spinner, Logo, EyeIcon, PasswordStrengthBar
│   ├── hooks/           # useAuth, useSessions (React Query wrappers)
│   ├── lib/             # validators, errors, utilities
│   ├── pages/           # Login, Register, Profile, Settings, etc.
│   ├── types/           # TypeScript interfaces
│   ├── App.tsx          # Route definitions
│   ├── main.tsx         # Entry point + QueryClientProvider
│   └── index.css        # Tailwind config + design tokens
├── public/
│   └── aegis.svg        # Favicon
├── index.html
├── vite.config.ts
└── package.json
```

---

## 🏁 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8005
```

> This tells the frontend where the backend API is running. Update this for production deployments.

### 3. Start Development Server

```bash
npm run dev
```

- Runs on `http://localhost:3005`
- Hot module replacement (HMR) enabled

---

## 📜 Available Scripts

| Script            | Description                            |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Start development server (HMR enabled) |
| `npm run build`   | Build for production (`dist/` output)  |
| `npm run preview` | Preview production build locally       |
| `npm run lint`    | Run ESLint on source files             |

---

## 🗺️ Routes

| Path                  | Component      | Auth Required | Description                     |
| --------------------- | -------------- | ------------- | ------------------------------- |
| `/`                   | (redirect)     | —             | → `/login` or `/profile`        |
| `/login`              | Login          | No            | Email/password login            |
| `/register`           | Register       | No            | Create new account              |
| `/password/forgot`    | ForgotPassword | No            | Request password reset          |
| `/password/reset`     | ResetPassword  | No            | Reset password with link        |
| `/email/verify/:code` | VerifyEmail    | No            | Verify email with code          |
| `/profile`            | Profile        | Yes           | User info + verification status |
| `/settings`           | Settings       | Yes           | Active sessions + revocation    |

---

## 🎨 Design System

### Colors (CSS Variables)

```css
:root {
  --background: 222 47% 4%; /* Dark blue-black */
  --foreground: 213 31% 91%; /* Off-white text */
  --primary: 250 65% 65%; /* Purple accent */
  --secondary: 270 60% 50%; /* Violet */
  --card: 222 47% 8%; /* Slightly lighter bg */
  --border: 217 33% 20%; /* Subtle borders */
}
```

### Typography

- **Display font:** Syne (headings, logo)
- **Body font:** DM Sans (paragraph text, UI)

### Component Classes

Custom Tailwind classes defined in `src/index.css`:

- `.auth-card` — Auth form card with shadow
- `.field-input` — Text input with focus states
- `.field-label` — Uppercase label with tracking
- `.btn-primary` — Primary CTA button
- `.btn-ghost` — Outline button
- `.btn-danger` — Destructive action button
- `.badge-success` / `.badge-warning` / `.badge-primary` — Status indicators
- `.alert-error` / `.alert-success` — Alert messages

---

## 🔐 Authentication Flow

### Login

1. User submits email + password
2. `loginApi()` called → backend validates credentials
3. Backend sets `accessToken` + `refreshToken` httpOnly cookies
4. Frontend stores user in TanStack Query cache (`USER_QUERY_KEY`)
5. Navigate to `/profile`

### Token Refresh (Automatic)

1. User makes request → access token expired (15 min)
2. Axios interceptor catches 401 with `InvalidAccessToken` error code
3. Interceptor calls `/auth/refresh` with `refreshToken` cookie
4. Backend validates refresh token → issues new access token
5. Interceptor retries original request with fresh token
6. User never sees the error — happens transparently

### Logout

1. User clicks "Logout"
2. `logoutApi()` called → backend deletes session from DB
3. Frontend:
   - Cancels any in-flight requests
   - Removes user query from cache
4. Navigate to `/login`

### Session Polling

- `useSessions` refetches every **60 seconds**

---

## 🧩 Key Components

### Layouts

**`AuthLayout`** — Wraps public pages (login, register, forgot password)

- 2-column split: form on left, branding panel on right
- Redirects authenticated users to `/profile`

**`ProtectedLayout`** — Wraps private pages (profile, settings)

- Top nav bar with logo, page links, user avatar, logout
- Hamburger menu on mobile
- Redirects unauthenticated users to `/login`

### Pages

**`Login`** — Email/password login with "Forgot password?" link  
**`Register`** — Registration with password strength meter  
**`ForgotPassword`** — Email input to request reset link  
**`ResetPassword`** — Password reset form (validates link expiry)  
**`VerifyEmail`** — Email verification result (success/error/expired)  
**`Profile`** — User info, verification status, "Resend email" button  
**`Settings`** — Active sessions list with per-device revocation

### Hooks

**`useAuth.ts`** — Wraps all auth API calls in TanStack Query mutations

- `useUser()` — Fetches current user
- `useLogin()` — Login mutation
- `useRegister()` — Register mutation
- `useLogout()` — Logout mutation (clears cache, navigates)
- `useForgotPassword()` — Password reset request
- `useResetPassword()` — Password reset with code
- `useVerifyEmail()` — Email verification
- `useResendVerification()` — Resend verification email

**`useSessions.ts`** — Session management

- `useSessions()` — Fetches all user sessions (polls every 60s)
- `useDeleteSession()` — Revokes a specific session

---

## 🛡️ Security Features

- **httpOnly cookies** — Tokens not accessible to JavaScript (XSS protection)
- **Axios interceptor** — Auto token refresh on 401 errors
- **CSRF protection** — Backend validates origin header
- **Password strength validation** — Enforces uppercase, lowercase, numbers, special chars
- **Email verification** — Accounts start unverified

---

## 📦 Production Build

### Build for Production

```bash
npm run build
```

Output: `dist/` directory (static files ready to deploy)

### Deploy

**Vercel:**

```bash
vercel --prod
```

**Netlify:**

```bash
netlify deploy --prod --dir=dist
```

**Other hosts:** Upload `dist/` contents to any static hosting service.

### Environment Variables (Production)

Update `VITE_API_URL` in your hosting dashboard:

```
VITE_API_URL=https://api.yourdomain.com
```

---

## 🧪 Development Tips

### Testing Token Refresh

1. Set backend `JWT_SECRET` access token expiry to `15s` (instead of `15m`)
2. Login → wait 20 seconds → make any request
3. Watch Network tab: you'll see `/auth/refresh` fire automatically
4. Original request retries with new token

### Testing Session Revocation

1. Login on two browsers (Chrome + Firefox)
2. Open Settings on both → see both sessions listed
3. Revoke Firefox session from Chrome

### Debugging Axios Interceptor

Add console logs in `src/api/apiClient.ts`:

```typescript
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.config.url);
    return response;
  },
  async (error) => {
    console.log("❌ Error:", error.config.url, error.response?.status);
    // ...
  },
);
```

---

## 📝 Notes

- **TanStack Query cache** persists during the browser session (cleared on logout)
- **Polling intervals** can be adjusted in `useAuth.ts` and `useSessions.ts`
- **Design tokens** (colors, fonts) are in `src/index.css` using CSS variables
- **Mobile nav** uses a hamburger menu below `sm:` breakpoint

---

**Built with React + TypeScript + TanStack Query + Tailwind CSS v4**
