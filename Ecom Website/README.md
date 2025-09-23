# 🏨 Hospitality Management System

A comprehensive full-stack e-commerce platform designed for hospitality businesses, featuring user management, product catalog, shopping cart, payment processing, and a complete admin panel for business operations.

## 🚀 Introduction

This Hospitality Management System is a modern web application that enables hospitality businesses to manage their operations efficiently. Built with the MERN stack (MongoDB, Express.js, React, Node.js), it provides a seamless experience for both customers and administrators.

The platform offers a complete e-commerce solution with features like user authentication, product management, order processing, payment integration, and comprehensive admin controls. It's designed to handle everything from product listings to customer orders with a focus on security, scalability, and user experience.

## ⚡ Features

### 👤 User Features
- **User Authentication**: Secure login and registration system with JWT tokens
- **Product Catalog**: Browse and search through available products
- **Product Details**: Detailed product information with image galleries
- **Shopping Cart**: Add, remove, and manage items in cart
- **Secure Checkout**: Complete checkout process with payment integration
- **Order History**: View and track order status
- **User Profile**: Manage personal information and preferences

### 🛠️ Admin Features
- **Admin Dashboard**: Comprehensive overview of business metrics
- **Product Management**: Add, edit, delete, and manage product inventory
- **Order Management**: View, process, and update order statuses
- **User Management**: Manage customer accounts and permissions
- **Image Upload**: Cloud-based image storage for product galleries
- **Analytics**: Business insights and reporting

### 🔒 Security Features
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Secure cross-origin resource sharing
- **Helmet Security**: HTTP security headers
- **Input Validation**: Comprehensive data validation
- **Password Encryption**: Secure password hashing with bcrypt
- **Protected Routes**: Role-based access control

## 🔄 Working Flow

### Customer Journey
1. **Registration/Login**: Users create accounts or log in securely
2. **Product Discovery**: Browse products with filtering and search
3. **Product Selection**: View detailed product information
4. **Cart Management**: Add items to cart and manage quantities
5. **Checkout Process**: Secure payment processing with Stripe
6. **Order Confirmation**: Email notifications and order tracking
7. **Order History**: Access to past orders and status updates

### Admin Workflow
1. **Admin Login**: Secure admin authentication
2. **Dashboard Overview**: View key business metrics and statistics
3. **Product Management**: Upload images, add/edit product details
4. **Order Processing**: Manage incoming orders and update statuses
5. **User Administration**: Manage customer accounts and permissions
6. **Business Analytics**: Monitor sales and performance metrics

## 📂 File Structure

```
hospitality-management-system/
├── backend/                    # Backend API Server
│   ├── config/                # Configuration files
│   │   ├── cloudinary.js      # Cloudinary image storage config
│   │   ├── database.js        # MongoDB connection config
│   │   └── multer.js          # File upload configuration
│   ├── controllers/           # Route controllers
│   │   ├── adminController.js # Admin operations logic
│   │   ├── authController.js  # Authentication logic
│   │   ├── orderController.js # Order management logic
│   │   ├── productController.js # Product operations logic
│   │   └── userController.js  # User management logic
│   ├── middlewares/           # Custom middleware
│   │   ├── adminAuth.js       # Admin authentication middleware
│   │   ├── auth.js            # User authentication middleware
│   │   └── errorHandler.js    # Error handling middleware
│   ├── models/                # Database models
│   │   ├── Order.js           # Order schema
│   │   ├── Product.js         # Product schema
│   │   └── User.js            # User schema
│   ├── routes/                # API routes
│   │   ├── adminRoutes.js     # Admin API endpoints
│   │   ├── authRoutes.js      # Authentication endpoints
│   │   ├── orderRoutes.js     # Order management endpoints
│   │   ├── productRoutes.js   # Product API endpoints
│   │   └── userRoutes.js      # User management endpoints
│   ├── uploads/               # File upload directory
│   ├── package.json           # Backend dependencies
│   └── server.js              # Main server file
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── api/               # API service functions
│   │   │   └── api.js         # Axios configuration and API calls
│   │   ├── components/        # Reusable React components
│   │   │   ├── AdminRoute.jsx # Admin route protection
│   │   │   ├── ErrorBoundary.jsx # Error boundary component
│   │   │   ├── LoadingSpinner.jsx # Loading indicator
│   │   │   ├── Navbar.jsx     # Navigation component
│   │   │   └── ProtectedRoute.jsx # User route protection
│   │   ├── context/           # React context providers
│   │   │   ├── AuthContext.jsx # Authentication state management
│   │   │   └── CartContext.jsx # Shopping cart state management
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Admin panel pages
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminOrders.jsx
│   │   │   │   ├── AdminProducts.jsx
│   │   │   │   └── AdminUsers.jsx
│   │   │   ├── Cart.jsx       # Shopping cart page
│   │   │   ├── Checkout.jsx   # Checkout page
│   │   │   ├── Home.jsx       # Homepage
│   │   │   ├── Login.jsx      # Login page
│   │   │   ├── Orders.jsx     # Order history page
│   │   │   ├── ProductDetails.jsx # Product detail page
│   │   │   ├── Products.jsx   # Product listing page
│   │   │   ├── Profile.jsx    # User profile page
│   │   │   └── Register.jsx   # Registration page
│   │   ├── App.jsx            # Main App component
│   │   ├── index.css          # Global styles
│   │   └── main.jsx           # Application entry point
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   └── index.html             # HTML template
└── README.md                  # Project documentation
```

## 🛠️ Tech Stack & Dependencies

### Backend Technologies
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer + Cloudinary
- **Payment Processing**: Stripe
- **Email Service**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator

### Frontend Technologies
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Heroicons, Lucide React
- **UI Components**: Headless UI

### Development Tools
- **Code Quality**: ESLint
- **Development Server**: Nodemon (Backend), Vite (Frontend)
- **Version Control**: Git

## 📦 Installation / Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/hospitality-system

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-here

   # Server
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173

   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Stripe (for payments)
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Running the Application

1. **Start Backend Server** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend Server** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 🔹 NPM Packages

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.3",
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.2",
  "multer": "^1.4.5-lts.1",
  "cloudinary": "^1.41.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "stripe": "^14.9.0",
  "nodemailer": "^6.9.7",
  "express-rate-limit": "^7.1.5",
  "helmet": "^7.1.0",
  "express-validator": "^7.0.1"
}
```

### Frontend Dependencies
```json
{
  "@headlessui/react": "^2.2.8",
  "@heroicons/react": "^2.2.0",
  "@tailwindcss/vite": "^4.1.13",
  "axios": "^1.12.2",
  "lucide-react": "^0.544.0",
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.9.1",
  "tailwindcss": "^4.1.13"
}
```

## 🚧 Future Improvements

### Planned Enhancements
- **Real-time Notifications**: WebSocket integration for live updates
- **Advanced Analytics**: Detailed sales and customer analytics dashboard
- **Mobile App**: React Native mobile application
- **Multi-language Support**: Internationalization and localization
- **Inventory Management**: Advanced stock tracking and alerts
- **Customer Support**: Integrated ticketing system
- **Marketing Tools**: Email campaigns and promotional features
- **API Documentation**: Comprehensive API documentation with Swagger
- **Testing Suite**: Unit and integration tests
- **Performance Optimization**: Caching strategies and code splitting

### Technical Improvements
- **Microservices Architecture**: Break down into smaller, focused services
- **Containerization**: Docker support for easy deployment
- **CI/CD Pipeline**: Automated testing and deployment
- **Monitoring**: Application performance monitoring
- **Backup Solutions**: Automated database backups
- **Security Enhancements**: Advanced security measures and audits

---

**Note**: This project is designed to be scalable and maintainable, with clean code architecture and modern development practices. All components are modular and can be easily extended or modified based on specific business requirements.
