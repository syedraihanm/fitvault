# FitVault

FitVault is a full-stack fitness tracking application for gym users and strength training. It combines workout logging, nutrition tracking, progress analytics, structured programs, and account management in a Next.js and Express application.

## What It Includes

- Workout logging for exercises, sets, reps, weight, duration, and calories burned
- Exercise library with categories, equipment, difficulty, and instructions
- Nutrition logging with meals, calories, protein, carbohydrates, and fats
- Daily dashboard with nutrition, workout, hydration, steps, and chart summaries
- Workout programs such as Push/Pull/Legs, upper/lower, full body, and strength plans
- Progress logs, body-weight charts, and automatically tracked personal records
- Water, step, goal, and notification tracking
- Coach suggestions based on user profile and fitness data
- User registration, login, profile management, password changes, and profile photos
- Admin tools for user management, statistics, and bulk exercise/food imports

## Stack

| Area | Technologies |
| --- | --- |
| Web client | Next.js 16.1.6, React 19, Recharts, Axios |
| API | Node.js, Express 4, Mongoose 8 |
| Authentication | JWT bearer tokens, bcryptjs |
| Uploads | Multer |
| Database | MongoDB or MongoDB Atlas |

## Project Structure

```text
fitvault/
├── client/                 # Next.js App Router frontend
│   ├── app/                # Authenticated and public routes
│   ├── components/         # Shared UI and feature components
│   └── lib/                # API client and authentication state
├── server/                 # Express API
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth, validation, and errors
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route modules
│   └── seeds/              # Default exercises, foods, programs, and admin
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB instance, either:
	- Local MongoDB at `mongodb://localhost:27017/fitvault`, or
	- A MongoDB Atlas cluster and database user

MongoDB Atlas does not require an Atlas API key for this application. The server only needs a MongoDB connection string with a database username and password.

## Local Setup

### 1. Configure the API

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitvault
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRE=30d
```

For MongoDB Atlas, use a connection string similar to:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/fitvault?retryWrites=true&w=majority
```

The Atlas database user must have access to the target database, and your development IP address must be allowed in Atlas Network Access. URL-encode special characters in the database password.

### 2. Install and seed the server

```powershell
cd server
npm install
npm run seed
```

The seed command adds the predefined exercises, food items, workout programs, and the default admin account if that account does not already exist.

Start the API:

```powershell
npm run dev
```

The API runs at `http://localhost:5000` and its health check is available at `http://localhost:5000/api/health`.

### 3. Configure and start the client

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Install and start the client in a second terminal:

```powershell
cd client
npm install
npm run dev
```

Open `http://localhost:3000` in a browser.

Restart the Next.js process after changing `.env.local`, because environment variables are loaded when the development server starts.

## Default Admin Account

The seed script creates this account only when it does not already exist:

```text
Email:    admin@fitvault.com
Password: admin123
```

Running `npm run seed` does not reset an existing admin password. Change this password for any shared or deployed environment.

## Useful Commands

Run these commands from the relevant package directory.

### Client

```bash
npm run dev       # Start Next.js development server
npm run build     # Create a production build
npm run start     # Serve the production build
npm run lint      # Run ESLint
```

### Server

```bash
npm run dev       # Start Express with nodemon
npm start         # Start Express normally
npm run seed      # Seed predefined data and the default admin
```

## API Areas

The server exposes these route groups under `/api`:

- `/auth` - registration, login, profile, and password changes
- `/exercises` - exercise library management
- `/workouts` - workout sessions and statistics
- `/programs` - programs and followed programs
- `/nutrition` - foods, meals, and nutrition statistics
- `/progress` - body-weight logs and personal records
- `/tracking` - water, steps, goals, and notifications
- `/dashboard` - daily dashboard data
- `/coach` - personalized suggestions
- `/admin` - protected administration endpoints
- `/health` - API health check

All application routes use authentication. Admin endpoints additionally require an account with the `admin` role.

## Troubleshooting

### MongoDB authentication failed

Check the Atlas database username and password, confirm the database user has the required permissions, and allow your current IP address in Atlas Network Access. This is separate from an Atlas API key.

### Frontend cannot reach the API

Confirm that the server is running on port `5000` and that `client/.env.local` contains:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

If port `5000` is already in use, stop the other server or update both the server port and client API URL to match.

### Admin login is rejected

The seed script does not overwrite an existing admin password. Use the current password for that account or reset it through an administrative database operation.

### Port already in use

Only start one server process per port. A second `npm run dev` will fail with `EADDRINUSE` while the original process is still running.

## Security Notes

- Never commit `.env`, `.env.local`, database passwords, or JWT secrets.
- Replace the development JWT secret before deployment.
- Replace the default admin password before sharing or deploying the application.
- Use a restricted Atlas database user instead of an owner-level account.
- Configure production CORS, HTTPS, upload storage, and secret management before deployment.
