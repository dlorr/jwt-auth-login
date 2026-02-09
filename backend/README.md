# JWT Authentication Login – Backend 🔐

Backend service for the **JWT Authentication Login** project.  
Built with **Express**, **TypeScript**, and **MongoDB**. Handles user registration, login, JWT authentication, password hashing, and email notifications.

---

## 🚀 Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB (Mongoose)
- Zod (Validation)
- bcrypt (Password hashing)
- JSON Web Token (JWT)
- Resend (Email notifications)

---

## 📦 Prerequisites

- Node.js (v20+ recommended)
- npm
- MongoDB (running locally or cloud instance)
- Optional: Resend API key for email features

---

## 📂 Project Structure

```
backend/
├── src/
│ ├── config/
│ ├── constants/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── schemas/
│ ├── services/
│ └── utils/
├── dist/ # Compiled JavaScript
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🏁 Getting Started

### 1️⃣ Install dependencies

```bash
npm install
```

---

### 2️⃣ Environment Variables

Create a .env file in the backend folder:

```env
APP_ENV=development
APP_ORIGIN=http://localhost:3005
PORT=8005
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret
EMAIL_SENDER=your-email@yourdomain.com
RESEND_API_KEY=your_resend_api_key
```

> ⚠️ Make sure MongoDB is running and accessible before starting the server

---

### 3️⃣ Run in Development

```bash
npm run dev
```

- Uses ts-node-dev
- Auto-restarts on file changes
- Runs on: http://localhost:8005

---

### 4️⃣ Build & Run Production

#### Build TypeScript

```bash
npm run build
```

#### Start Production Server

```bash
npm start
```

- Runs compiled server from /dist/

---

### 📜 Available Scripts

| Script          | Description                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Run server in development mode |
| `npm run build` | Compile TypeScript             |
| `npm run start` | Run production build           |

---

### 🧠 Notes

- Passwords are hashed using bcrypt
- Authentication is handled with JWT
- Input validation uses Zod
- Email notifications are sent via Resend
- Ensure .env variables are correctly set before running

---

### ✅ Status

- Backend API is fully functional with:
- User registration & login
- JWT authentication
- Password hashing
- Email notifications

---

Happy coding 🚀
