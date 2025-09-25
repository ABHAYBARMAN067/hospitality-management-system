# Hospitality Management System

## Project Title
Hospitality Management System - A comprehensive web application for managing restaurants, bookings, orders, and user interactions in the hospitality industry.

## Introduction
The Hospitality Management System is a full-stack web application designed to streamline restaurant operations, user experiences, and administrative tasks. It provides a platform for users to discover restaurants, make bookings, place orders, and leave reviews, while offering restaurant owners and administrators powerful tools to manage their businesses efficiently.

## File Structure
```
hospitality-management-system/
├── backend/                          # Backend server (Node.js/Express)
│   ├── config/                       # Configuration files
│   ├── controllers/                  # Route controllers
│   ├── helpers/                      # Utility functions
│   ├── middlewares/                  # Custom middleware
│   ├── models/                       # Database models
│   ├── routes/                       # API routes
│   ├── uploads/                      # File uploads directory
│   ├── index.js                      # Main server file
│   ├── server.js                     # Alternative server file
│   ├── package.json                  # Backend dependencies
│   ├── package-lock.json             # Lock file
│   └── README.md                     # Backend documentation
├── frontend/                         # Frontend application (React/Vite)
│   ├── public/                       # Public assets
│   │   └── vite.svg                  # Vite logo
│   ├── src/                          # Source code
│   │   ├── assets/                   # Static assets
│   │   │   └── react.svg             # React logo
│   │   ├── components/               # React components
│   │   │   ├── Layout/               # Layout components
│   │   │   ├── UI/                   # UI components
│   │   │   ├── Admin.jsx             # Admin dashboard
│   │   │   ├── Bookings.jsx          # Bookings management
│   │   │   ├── Home.jsx              # Home page
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── MenuManagement.jsx    # Menu management
│   │   │   ├── Orders.jsx            # Orders management
│   │   │   ├── Register.jsx          # Registration page
│   │   │   ├── Reports.jsx           # Reports page
│   │   │   ├── Restaurant.jsx        # Restaurant details
│   │   │   ├── RestaurantOwnerDashboard.jsx # Owner dashboard
│   │   │   ├── Reviews.jsx           # Reviews page
│   │   │   ├── ReviewForm.jsx        # Review form
│   │   │   └── UserProfile.jsx       # User profile
│   │   ├── context/                  # React contexts
│   │   │   ├── AuthContext.jsx       # Authentication context
│   │   │   └── ThemeContext.jsx      # Theme context
│   │   ├── App.jsx                   # Main app component
│   │   ├── index.css                 # Global styles
│   │   └── main.jsx                  # Entry point
│   ├── .gitignore                    # Git ignore file
│   ├── eslint.config.js              # ESLint configuration
│   ├── index.html                    # HTML template
│   ├── package.json                  # Frontend dependencies
│   ├── package-lock.json             # Lock file
│   ├── README.md                     # Frontend documentation
│   └── vite.config.js                # Vite configuration
└── README.md                         # Project root documentation
```

## Features
- **User Authentication**: Secure login and registration system with role-based access control
- **Restaurant Discovery**: Browse and search for restaurants with detailed information and images
- **Booking Management**: Reserve tables with real-time availability and status tracking
- **Order Processing**: Place and track food orders with status updates
- **Admin Dashboard**: Comprehensive management interface for bookings, orders, and restaurant data
- **Restaurant Owner Dashboard**: Dedicated interface for managing specific restaurant operations
- **Review System**: Users can leave reviews and ratings for restaurants
- **Reports and Analytics**: Generate reports for business insights
- **Responsive Design**: Mobile-friendly interface with dark/light theme support
- **Real-time Updates**: Live status updates for bookings and orders
- **File Upload Support**: Image uploads for restaurants and user profiles
- **Security Features**: Rate limiting, CORS protection, and secure authentication

## Working Flow
1. **User Registration/Login**: Users create accounts and authenticate to access personalized features
2. **Restaurant Browsing**: Users can search and view restaurant details, menus, and reviews
3. **Booking Process**: Users select restaurants, choose dates/times, and make reservations
4. **Order Placement**: Users can place orders for delivery or pickup
5. **Admin Management**: Administrators approve/reject bookings, manage orders, and oversee restaurants
6. **Owner Operations**: Restaurant owners manage their specific restaurant's menu, bookings, and orders
7. **Review and Feedback**: Users provide feedback, and businesses can respond
8. **Reporting**: Generate insights from booking and order data

## 🛠️ Tech Stack & Dependencies
### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **File Upload**: Multer, Cloudinary
- **Security**: Helmet, CORS, express-rate-limit
- **Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Development**: Nodemon

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Notifications**: React Toastify
- **Loading States**: React Spinners
- **Development**: ESLint, Vite plugins

## Installation / Setup Instructions
### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (recommended) or local MongoDB
- Cloudinary account (for image uploads)

### MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
5. Get your connection string from the "Connect" button
6. Replace `<username>`, `<password>`, and `<database>` in the connection string

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB Atlas:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a free cluster
   - Create a database user
   - Whitelist your IP address
   - Get your connection string from the "Connect" button

4. Copy `.env.example` to `.env` and update the variables:
   ```bash
   cp .env.example .env
   ```

5. Update your `.env` file with actual values:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospitality_management
   JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   REDIS_URL=redis://localhost:6379
   FRONTEND_URL=http://localhost:5173
   ```

6. **Optional: Set up Redis (for caching)**
   - Install Redis locally or use a cloud Redis service
   - Update `REDIS_URL` in `.env` if using a different Redis instance
   - Note: The app will work without Redis, but caching will be disabled

7. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## NPM Packages
### Backend Dependencies
- **bcryptjs**: Password hashing
- **cloudinary**: Image upload and management
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **express**: Web application framework
- **express-fileupload**: File upload middleware
- **express-rate-limit**: Rate limiting
- **helmet**: Security middleware
- **jsonwebtoken**: JWT authentication
- **mongoose**: MongoDB object modeling
- **multer**: File upload handling
- **multer-storage-cloudinary**: Cloudinary storage for Multer
- **swagger-jsdoc**: Swagger documentation generation
- **swagger-ui-express**: Swagger UI middleware

### Frontend Dependencies
- **@tailwindcss/vite**: Tailwind CSS Vite plugin
- **axios**: HTTP client
- **framer-motion**: Animation library
- **react**: UI library
- **react-dom**: DOM rendering
- **react-icons**: Icon library
- **react-router-dom**: Routing library
- **react-spinners**: Loading spinners
- **react-toastify**: Notification library
- **tailwindcss**: Utility-first CSS framework

## Future Improvements
- **Mobile App**: Develop native mobile applications for iOS and Android
- **Real-time Notifications**: Implement WebSocket for instant updates
- **Advanced Analytics**: Add more detailed reporting and business intelligence features
- **Multi-language Support**: Internationalization for global markets
- **Payment Integration**: Integrate payment gateways for online transactions
- **AI-powered Recommendations**: Machine learning for personalized restaurant suggestions
- **Offline Support**: Progressive Web App (PWA) features for offline functionality
- **Enhanced Security**: Two-factor authentication and advanced security measures
- **API Rate Limiting**: More sophisticated rate limiting strategies
- **Testing Suite**: Comprehensive unit and integration tests







## dependacy shorcut
