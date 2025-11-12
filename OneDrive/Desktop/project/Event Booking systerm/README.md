# Event Booking System (React + Node.js + MongoDB)

This repository contains a scaffold for an Event Booking System with a backend (Express + MongoDB) and a frontend (React + Vite).

Structure

- backend/ — Express API, Mongoose models, routes and controllers
- frontend/ — React app scaffold (Vite)
- docs/ — diagrams and documentation

Quick start

1. Backend

```powershell
cd backend
copy .env.example .env
# edit .env and set MONGO_URI and JWT_SECRET
npm install
npm run dev
```

2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Notes

- The frontend uses relative `/api` calls. During development you can run the backend on port 5000 and configure a proxy or run both on the same origin.
- Add your MongoDB connection string to `backend/.env` before starting the backend.
- This scaffold focuses on structure and minimal functionality — extend with validation, testing, CI, and deployment steps as needed.
