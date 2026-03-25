# FitVault

A full-stack, production-ready fitness tracking web application focused on gym users and strength training. Built with Next.js, Express, and MongoDB.

## Features
- **Workout Logging**: Track exercises, sets, reps, and weights with an embedded logger.
- **Nutrition Tracking**: Log meals, track calories, and monitor macros against goals.
- **Dashboard**: Complete daily overview with dynamic Recharts visualizations.
- **Workout Programs**: Browse, save, and follow daily plans (e.g., Push Pull Legs).
- **Progress Tracking**: Personal records (PRs) auto-track off workout data, plus body weight charting.
- **AI Coach**: Personalized biometric-based recommendations for calories, protein, and sleep.
- **Dark Gym Theme**: Sleek, immersive UI built completely with custom CSS (no Tailwind).
- **Admin Panel**: Manage users and view global statistics.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React, Recharts, Axios
- **Backend**: Node.js, Express, Mongoose, JWT Auth, Multer
- **Database**: MongoDB

---

## Local Development Guide

### Prerequisites
1. Node.js (v18+)
2. MongoDB installed & running locally on port `27017`

### 1. Setup Backend
```bash
cd server
npm install
```

Ensure your `.env` in `server/` contains:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitvault
JWT_SECRET=fitvault_super_secret_key_2024_change_in_production
JWT_EXPIRE=30d
```

Seed the database with default exercises, foods, programs, and the admin user:
```bash
npm run seed
```

Start the backend:
```bash
npm run dev
```

### 2. Setup Frontend
Open a new terminal.
```bash
cd client
npm install
```

Start the Next.js frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Default Admin Credentials
- **Email:** admin@fitvault.com
- **Password:** admin123

---

## Deployment Suggestions

### 1. Frontend (Next.js) -> Vercel
Vercel is the natural choice for Next.js applications:
1. Push this repository to GitHub.
2. Go to Vercel, import the repository.
3. Set the Root Directory to `client`.
4. Add the environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api`
5. Deploy.

### 2. Backend (Express) -> Render / Heroku
Render offers a free tier for Node.js services:
1. Connect your repository to Render.
2. Select it as a Web Service.
3. Set the Root Directory to `server`.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add environment variables (`MONGODB_URI`, `JWT_SECRET`, etc.).

### 3. Database -> MongoDB Atlas
Do not use localhost for production.
1. Create a free cluster on MongoDB Atlas.
2. Whitelist IPs (allow anywhere `0.0.0.0/0` for Render).
3. Get the connection string and put it in your backend's `.env` config.

## Architecture & Structure
- Clean MVC structure on backend (`controllers`, `models`, `routes`, `middleware`).
- Token-based authentication via HTTP-only Cookies and Bearer headers.
- Next.js App router grouping `(auth)` and `(app)` for isolated layout logic.
