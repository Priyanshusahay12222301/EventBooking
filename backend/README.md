# Event Booking Backend

This folder contains the backend API for the Event Booking System.

Stack: Node.js, Express, MongoDB (Mongoose)

Quick start

1. Copy `backend/.env.example` to `backend/.env` and update `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies:

```powershell
cd backend
npm install
```

3. Start server (development):

```powershell
npm run dev
```

API overview

- POST /api/auth/register
- POST /api/auth/login
- GET /api/events
- GET /api/events/:id
- POST /api/events (admin)
- PUT /api/events/:id (admin)
- DELETE /api/events/:id (admin)
- POST /api/bookings (auth)
- GET /api/bookings/user/:id (auth)
- GET /api/bookings (admin)

Notes

- The controllers are basic and intended as a scaffold. Add validation, error handling, and payment integration as needed.
