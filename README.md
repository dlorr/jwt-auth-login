# JWT Authentication Login

This is a **JWT Authentication Login** project structured as a monorepo, containing separate frontend and backend packages.

- **Backend:** Built with **Express**, **TypeScript**, and **MongoDB**. Handles user registration, login, JWT authentication, and email sending.
- **Frontend:** Built with **React**, **TypeScript**, **TailwindCSS**, and **React Query**. Currently in development.

---

## 📂 Project Structure

```
/ (root)
├── frontend/ # React frontend
├── backend/ # Express backend
└── README.md # This file
```

---

## Getting Started

### 📦 Prerequisites

- Node.js (v20+ recommended)
- npm
- MongoDB (local or cloud)
- Optional: Resend API key for email features

---

### 🏃 Running the Project

#### Backend

```bash
cd backend
npm install
npm run dev
```

The backend will run on `http://localhost:8005`

---

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3005`

---

## 🧠 Notes

- Frontend is under development and may not yet connect fully to the backend.
- Backend includes JWT authentication, password hashing with bcrypt, and email functionality with Resend.
- Environment variables should be defined in `.env` files in each package.

---

## 📁 References

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

---

Happy coding 🚀
