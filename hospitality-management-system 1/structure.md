# Project File Structure

```
hospitality-management-system/
├── TODO.md
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── logs/
│   ├── uploads/
│   └── src/
│       ├── server.js
│       ├── app.js
│       ├── config/
│       │   └── cloudinary.js
│       ├── controllers/
│       │   ├── hotelController.js
│       │   ├── tableController.js
│       │   ├── bookingController.js
│       │   └── authController.js
│       ├── models/
│       │   ├── Hotel.js
│       │   ├── Table.js
│       │   ├── Booking.js
│       │   └── User.js
│       ├── routes/
│       │   ├── hotelRoutes.js
│       │   ├── tableRoutes.js
│       │   ├── bookingRoutes.js
│       │   └── authRoutes.js
│       ├── middleware/
│       │   └── authMiddleware.js
│       └── utils/
│           └── (other utilities)
└── frontend/
    └── (frontend files - React app)
