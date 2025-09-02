# Restaurant Table Booking - Complete File Structure

## 📁 Project Root
```
restaurant-table-booking/
├── README.md                           # Main project documentation
├── package.json                        # Root package configuration
├── package-lock.json                   # Root dependency lock file
└── filestructure.md                    # This file - complete structure documentation
```

## 🖥️ Frontend Application (`/frontend/`)

### 📁 Source Code (`/frontend/src/`)
```
frontend/src/
├── main.jsx                           # Application entry point with AuthProvider wrapper
├── index.js                           # React DOM rendering entry
├── App.jsx                            # Main App component with routing
├── App.css                            # Main application styles
├── styles.css                         # Global CSS styles
└── assets/                            # Static assets
    └── react.svg                      # React logo SVG
```

### 📁 Pages (`/frontend/src/pages/`)
```
frontend/src/pages/
├── Home.jsx                           # Main landing page with booking flow
├── About.jsx                          # About us information page
├── Services.jsx                       # Services offered page
├── Login.jsx                          # User login form
├── Signup.jsx                         # User registration form
├── MyTable.jsx                        # User's booking history (protected)
├── HotelDetails.jsx                   # Individual hotel details page
└── AdminDashboard.jsx                 # Admin management dashboard (protected)
```

### 📁 Components (`/frontend/src/components/`)
```
frontend/src/components/
├── Navbar.jsx                         # Navigation header component
├── Footer.jsx                         # Footer component
├── CitySelection.jsx                  # City selection interface
├── HotelList.jsx                      # List of hotels in selected city
├── HotelCard.jsx                      # Individual hotel card display
├── HotelDetails.jsx                   # Hotel details component
├── BookingConfirmation.jsx            # Booking confirmation interface
└── AdminSignup.jsx                    # Admin registration form
```

### 📁 Context (`/frontend/src/context/`)
```
frontend/src/context/
└── AuthContext.jsx                    # Authentication context provider
```

### 📁 Utilities (`/frontend/src/utils/`)
```
frontend/src/utils/
└── api.js                             # API utility functions
```

### 📁 Configuration (`/frontend/`)
```
frontend/
├── index.html                         # HTML template
├── public/                            # Public assets
│   ├── index.html                     # Public HTML template
│   └── vite.svg                       # Vite logo
├── package.json                       # Frontend dependencies
├── package-lock.json                  # Frontend dependency lock
├── vite.config.js                     # Vite build configuration
├── eslint.config.js                   # ESLint configuration
└── README.md                          # Frontend documentation
```

## 🗄️ Backend Application (`/backend/`)

### 📁 Source Code (`/backend/src/`)
```
backend/src/
├── server.js                          # Express server entry point
├── app.js                             # Express application setup
├── config/                            # Configuration files
│   ├── db.js                          # Database connection configuration
│   └── cloudinary.js                  # Cloudinary image upload config
├── controllers/                       # Route controllers
│   ├── authController.js              # Authentication logic
│   ├── bookingController.js           # Booking management logic
│   ├── hotelController.js             # Hotel management logic
│   └── tableController.js             # Table management logic
├── middleware/                        # Custom middleware
│   └── authMiddleware.js              # Authentication middleware
├── models/                            # Database models
│   ├── User.js                        # User data model
│   ├── Hotel.js                       # Hotel data model
│   ├── Table.js                       # Table data model
│   └── Booking.js                     # Booking data model
├── routes/                            # API route definitions
│   ├── authRoutes.js                  # Authentication endpoints
│   ├── bookingRoutes.js               # Booking endpoints
│   ├── hotelRoutes.js                 # Hotel endpoints
│   └── tableRoutes.js                 # Table endpoints
└── utils/                             # Utility functions
    └── generateToken.js   
└── .env                
```

### 📁 Configuration (`/backend/`)
```
backend/
├── package.json                       # Backend dependencies
└── package-lock.json                  # Backend dependency lock
```

## 🔐 Authentication Flow

### Frontend Authentication:
- **AuthContext.jsx** → Manages user state and authentication
- **Login.jsx** → User login interface
- **Signup.jsx** → User registration interface
- **AdminSignup.jsx** → Admin registration interface
- **Protected Routes** → MyTable.jsx, AdminDashboard.jsx

### Backend Authentication:
- **authController.js** → Handles login/signup logic
- **authMiddleware.js** → Protects routes
- **User.js** → User data model
- **generateToken.js** → JWT token creation

## 🏨 Hotel Management System

### Frontend Components:
- **CitySelection.jsx** → City selection
- **HotelList.jsx** → Display hotels in city
- **HotelCard.jsx** → Individual hotel display
- **HotelDetails.jsx** → Detailed hotel view
- **AdminSignup.jsx** → Hotel registration

### Backend Models:
- **Hotel.js** → Hotel data structure
- **Table.js** → Table availability
- **hotelController.js** → Hotel CRUD operations

## 📅 Booking System

### Frontend Components:
- **BookingConfirmation.jsx** → Booking finalization
- **MyTable.jsx** → User's booking history

### Backend Models:
- **Booking.js** → Booking data structure
- **bookingController.js** → Booking management
- **tableController.js** → Table availability

## 🚀 Development Setup

### Frontend (React + Vite):
```bash
cd frontend
npm install
npm run dev
```

### Backend (Node.js + Express):
```bash
cd backend
npm install
npm start
```

## 📱 Key Features by File

### **User Experience:**
- **Home.jsx** → Complete booking flow
- **CitySelection.jsx** → City-based hotel discovery
- **HotelList.jsx** → Hotel browsing interface

### **Authentication:**
- **AuthContext.jsx** → Global auth state
- **Login.jsx/Signup.jsx** → User authentication
- **AdminSignup.jsx** → Hotel owner registration

### **Admin Features:**
- **AdminDashboard.jsx** → Hotel management
- **AdminSignup.jsx** → Hotel registration form

### **Data Management:**
- **api.js** → Frontend API calls
- **controllers/** → Backend business logic
- **models/** → Database schemas

## 🔧 Technology Stack

### Frontend:
- **React 18** → UI framework
- **Vite** → Build tool
- **React Router** → Navigation
- **Tailwind CSS** → Styling
- **Context API** → State management

### Backend:
- **Node.js** → Runtime environment
- **Express.js** → Web framework
- **MongoDB** → Database (via models)
- **JWT** → Authentication
- **Cloudinary** → Image storage

## 📍 File Organization Principles

1. **Separation of Concerns** → Frontend/Backend clearly separated
2. **Component-Based Architecture** → Reusable React components
3. **MVC Pattern** → Models, Views (components), Controllers
4. **Route-Based Organization** → Pages and components organized by feature
5. **Utility Separation** → Common functions in utils folder
6. **Configuration Management** → Environment-specific configs

## 🎯 Key Directories Explained

- **`/frontend/src/pages/`** → Main application pages
- **`/frontend/src/components/`** → Reusable UI components
- **`/frontend/src/context/`** → Global state management
- **`/backend/src/controllers/`** → Business logic handlers
- **`/backend/src/models/`** → Database schemas
- **`/backend/src/routes/`** → API endpoint definitions
- **`/backend/src/middleware/`** → Request processing functions

This structure provides a clean, scalable architecture for the restaurant table booking application with clear separation between frontend user interface and backend business logic. 




 Complete File Structure Created:
1. Project Root Structure
Main project files and configuration
2. Frontend Application (/frontend/)
Source Code → React components, pages, context
Pages → Main application screens
Components → Reusable UI elements
Context → Authentication state management
Utilities → API functions
Configuration → Build tools and dependencies
3. Backend Application (/backend/)
Source Code → Express server setup
Controllers → Business logic handlers
Models → Database schemas
Routes → API endpoints
Middleware → Authentication and processing
Configuration → Database and cloud services
🎯 Key Information Documented:
File Locations & Purposes:
✅ Which folder → Clear directory paths
✅ Which file → Specific file names
✅ What it does → Function and purpose
✅ How it connects → Relationships between files
Technology Stack:
Frontend: React 18, Vite, Tailwind CSS
Backend: Node.js, Express, MongoDB
Authentication: JWT, Context API
Architecture Patterns:
MVC Pattern → Models, Views, Controllers
Component-Based → Reusable React components
Separation of Concerns → Frontend/Backend split
📁 File Organization:
/frontend/src/pages/ → Main application screens
/frontend/src/components/ → Reusable UI components
/frontend/src/context/ → Global state management
/backend/src/controllers/ → Business logic
/backend/src/models/ → Database structure
/backend/src/routes/ → API endpoints
🚀 Development Setup:
Frontend commands
Backend commands
Clear installation steps
