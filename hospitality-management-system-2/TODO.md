# Hotel Table Booking System - Implementation TODO

## Backend Setup
- [ ] Update backend/package.json with required dependencies (express, mongoose, bcryptjs, jsonwebtoken, multer, cloudinary, nodemailer, cors, dotenv)
- [ ] Create app.js (Express app setup with middleware)
- [ ] Create server.js (server startup)
- [ ] Create models/User.js (admin user model)
- [ ] Create models/Reservation.js (reservation model)
- [ ] Create models/Settings.js (optional settings)
- [ ] Create middlewares/authMiddleware.js (JWT verification)
- [ ] Create middlewares/errorHandler.js
- [ ] Create controllers/authController.js (login/register)
- [ ] Create controllers/reservationController.js (CRUD reservations)
- [ ] Create controllers/uploadController.js (image upload)
- [ ] Create routes/auth.js
- [ ] Create routes/reservation.js
- [ ] Create routes/upload.js
- [ ] Create utils/cloudinary.js
- [ ] Update config/database.js (MongoDB connection)
- [ ] Create .env file with secrets (DB_URI, JWT_SECRET, CLOUDINARY, EMAIL)

## Frontend Setup
- [ ] Update frontend/package.json with dependencies (react, react-router-dom, axios, tailwindcss)
- [ ] Create src/pages/Home.jsx (hero + Book CTA)
- [ ] Create src/pages/Book.jsx (booking form)
- [ ] Create src/pages/AdminLogin.jsx
- [ ] Create src/pages/AdminDashboard.jsx (reservations list)
- [ ] Create src/components/BookingForm.jsx
- [ ] Create src/components/ReservationList.jsx
- [ ] Create src/components/AdminPanel.jsx
- [ ] Create src/context/AuthContext.jsx
- [ ] Create src/api/axios.js (axios instance)
- [ ] Update src/App.jsx with routing
- [ ] Add Tailwind CSS setup

## Features Implementation
- [ ] Implement public reservation creation (POST /api/reservations)
- [ ] Implement admin auth (POST /api/auth/login)
- [ ] Implement admin reservation management (GET/PUT/DELETE /api/reservations)
- [ ] Implement image upload (POST /api/upload)

- [ ] Add search/filter/export in admin panel
- [ ] Add validation (date/time/partySize)
- [ ] Make UI responsive

## Testing & Deployment
- [ ] Test backend APIs
- [ ] Test frontend booking flow
- [ ] Test admin panel
- [ ] Deploy backend (Railway/Render)
- [ ] Deploy frontend (Vercel/Netlify)
