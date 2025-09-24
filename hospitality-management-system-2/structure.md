# Project File Structure

This document outlines the file structure of the Hospitality Management System project.

## Root Directory
```
c:/FreshStart15/hospitality-management-system/hospitality-management-system-2/
├── TODO.md
├── backend/
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── server.js
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── database.js
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   ├── reportsController.js
│   │   ├── restaurantController.js
│   │   ├── reviewController.js
│   │   └── userController.js
│   ├── helpers/
│   │   └── cache.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── fileUpload.js
│   │   ├── rateLimiter.js
│   │   ├── restaurantOwnerAuth.js
│   │   └── security.js
│   ├── models/
│   │   ├── MenuItem.js
│   │   ├── Order.js
│   │   ├── Rating.js
│   │   ├── Restaurant.js
│   │   ├── TableBooking.js
│   │   └── User.js
│   └── uploads/
│       ├── 0d4dd2e3c03969f83dc1ad3050e21fe4
│       ├── 1a9532939adf8aeef520fc56b7590970
│       ├── 6c7174fbc94de3d4d76f3b8f6cce029f
│       ├── 08c1ba99f5eb89a61bcb82f909e82e7a
│       ├── 9e065fea8e66f0508b2cc23d2e38e162
│       ├── 35aa5b10ec608de7d550858a2439af97
│       ├── 58bdf3135fbe0bd7687e402c4ccd464f
│       ├── 69e16a1a4a201b95ec61d06d3e90787d
│       ├── 47400b3abe3e474bd837ed545c636389
│       ├── 0424793ba1bf1099aad32e30f15a4adb
│       ├── ac90fb3dd715d074a40bc06c861d8c21
│       ├── ada632c176691c196c5505a69db457e9
│       ├── c30ef4ab44471667cf5f96b03f37d3e3
│       ├── dfaad069fe812ec07ae8bdf285eacd7e
│       ├── ef511dea36267561a9159e59089d6cbe
│       └── f4d02de25bfdf9dc6b23175b1a4d7c06
└── frontend/
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── vite.config.js
    ├── public/
    │   └── vite.svg
    └── src/
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── assets/
        │   └── react.svg
        ├── components/
        │   ├── Admin.jsx
        │   ├── Bookings.jsx
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── MenuManagement.jsx
        │   ├── Orders.jsx
        │   ├── Register.jsx
        │   ├── Reports.jsx
        │   ├── Restaurant.jsx
        │   ├── RestaurantOwnerDashboard.jsx
        │   ├── ReviewForm.jsx
        │   ├── Reviews.jsx
        │   ├── UserProfile.jsx
        │   ├── Layout/
        │   │   ├── AdminLayout.jsx
        │   │   └── PublicLayout.jsx
        │   └── UI/
        │       ├── AdminSidebar.jsx
        │       ├── LoadingSpinner.jsx
        │       ├── Navbar.jsx
        │       ├── SkeletonLoader.jsx
        │       └── ThemeToggle.jsx
        └── context/
            ├── AuthContext.jsx
            └── ThemeContext.jsx
```

## Project Overview

### Backend
- **Language**: Node.js
- **Framework**: Express.js (inferred from structure)
- **Database**: MongoDB (based on models and mongoose usage)
- **Key Components**:
  - Controllers for handling API endpoints
  - Models for database schemas
  - Middlewares for authentication, file uploads, etc.
  - Configuration files for database, cloudinary, etc.

### Frontend
- **Framework**: React.js (based on .jsx files and Vite config)
- **Build Tool**: Vite
- **Key Components**:
  - React components for UI
  - Context providers for state management
  - Layout components for structure

### Key Files
- **Backend Entry**: `backend/server.js` or `backend/index.js`
- **Frontend Entry**: `frontend/src/main.jsx`
- **Database Models**: Located in `backend/models/`
- **API Controllers**: Located in `backend/controllers/`

This structure supports a full-stack hospitality management application with user authentication, restaurant management, bookings, orders, and reviews.
