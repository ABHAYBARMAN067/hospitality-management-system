# Hospitality Management System - Table Booking System

## Project Structure Overview

This document provides a comprehensive overview of the file structure for the Hospitality Management System - Table Booking System project.

### Root Directory Structure

```
c:/FreshStart15/hospitality-management-system/table-booking-system/
├── backend/                          # Backend Node.js application
└── frontend/                         # Frontend React application
```

## Backend Structure

### Backend Root Files
- `.gitignore` - Git ignore rules for backend
- `package.json` - Backend dependencies and scripts
- `package-lock.json` - Lock file for exact dependency versions
- `TODO.md` - Backend development tasks and notes

### Backend Source Code (`backend/src/`)

#### Main Application Files
- `app.js` - Main Express application configuration
- `server.js` - Server startup and configuration

#### Configuration (`backend/src/config/`)
- `cloudinary.js` - Cloudinary configuration for image uploads
- `database.js` - Database connection configuration
- `multer.js` - File upload middleware configuration

#### Controllers (`backend/src/controllers/`)
- `adminController.js` - Admin-specific operations
- `authController.js` - Authentication and authorization logic
- `bookingController.js` - Table booking management
- `hotelController.js` - Hotel management operations
- `menuItemController.js` - Menu item management
- `tableController.js` - Table management operations

#### Models (`backend/src/models/`)
- `Booking.js` - Database model for bookings
- `Hotel.js` - Database model for hotels
- `MenuItem.js` - Database model for menu items
- `Table.js` - Database model for tables
- `User.js` - Database model for users

#### Routes (`backend/src/routes/`)
- `adminRoutes.js` - Admin-specific API routes
- `authRoutes.js` - Authentication API routes
- `bookingRoutes.js` - Booking management API routes
- `hotelRoutes.js` - Hotel management API routes
- `menuItemRoutes.js` - Menu item API routes
- `tableRoutes.js` - Table management API routes

#### Middleware (`backend/src/middleware/`)
- `auth.js` - Authentication middleware

### Backend Assets (`backend/uploads/`)

The uploads directory contains a large collection of image files for:
- **Dish Images**: Multiple dish images with naming pattern `dishImage[0-2]-timestamp.extension`
  - Format: `dishImage[0-2]-[timestamp]-[random].[extension]`
  - Extensions: `.webp`, `.avif`, `.jpg`
  - Purpose: Menu item images for the restaurant system

- **Hotel Images**: Hotel property images
  - Format: `hotelImage-[timestamp]-[random].[extension]`
  - Extensions: `.avif`, `.jpg`
  - Purpose: Hotel property showcase images

## Frontend Structure

### Frontend Root Files
- `.gitignore` - Git ignore rules for frontend
- `eslint.config.js` - ESLint configuration
- `index.html` - Main HTML entry point
- `package.json` - Frontend dependencies and scripts
- `package-lock.json` - Lock file for exact dependency versions
- `README.md` - Frontend documentation
- `tailwind.config.js` - Tailwind CSS configuration
- `vite.config.js` - Vite build tool configuration

### Frontend Public Assets (`frontend/public/`)
- `vite.svg` - Vite logo/icon

### Frontend Source Code (`frontend/src/`)

#### Main Application Files
- `App.jsx` - Main React application component
- `index.css` - Global CSS styles
- `main.jsx` - Application entry point

#### Assets (`frontend/src/assets/`)
- `react.svg` - React logo/icon

#### Components (`frontend/src/components/`)
- `Header.jsx` - Application header component
- `ImageUpload.jsx` - Image upload functionality
- `ProtectedRoute.jsx` - Route protection component

#### Contexts (`frontend/src/contexts/`)
- `AuthContext.jsx` - Authentication context provider

#### Pages (`frontend/src/pages/`)
- `AdminDashboard.jsx` - Admin dashboard page
- `Adminregistration.jsx` - Admin registration page
- `BookingForm.jsx` - Table booking form
- `Home.jsx` - Home/landing page
- `HotelDetails.jsx` - Hotel details page
- `Hotels.jsx` - Hotels listing page
- `Login.jsx` - User login page
- `MyBookings.jsx` - User's bookings page
- `Register.jsx` - User registration page

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (based on model structure)
- **File Upload**: Multer
- **Image Storage**: Cloudinary
- **Authentication**: JWT (based on auth controller)

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Language**: JavaScript (JSX)
- **Linting**: ESLint

## Key Features Based on Structure

1. **Authentication System**: Complete user authentication with registration, login, and protected routes
2. **Hotel Management**: CRUD operations for hotels with image uploads
3. **Menu Management**: Menu item management with image uploads
4. **Table Booking System**: Complete booking management system
5. **Admin Panel**: Administrative functions and dashboard
6. **Image Management**: Comprehensive image upload system for hotels and menu items

## Development Status

The project appears to be in active development with:
- Complete MVC architecture implemented
- Authentication system in place
- File upload functionality working
- Multiple image assets already uploaded
- TODO tracking system in place

This structure provides a solid foundation for a full-featured hospitality management system with table booking capabilities.

## Recent Updates (Latest Changes)

### Backend Improvements
- **Enhanced Multer Configuration**: Improved file upload limits (10MB) and support for multiple file formats
- **Advanced Top Dishes Upload**: Support for multiple image upload methods (individual fields + batch upload)
- **Better Error Handling**: Comprehensive logging and error handling for image uploads
- **Flexible File Support**: Accept any file format for better compatibility

### Frontend Improvements
- **Admin Registration Form**: Enhanced form with better validation and error handling
- **Top Dishes Management**: Improved UI for adding dish names and uploading images
- **Form Data Processing**: Better handling of complex form data with multiple file uploads

### Current Issues Being Addressed
- **Top Dishes Image Upload**: Implementing robust solution for uploading multiple dish images to Cloudinary
- **File Format Compatibility**: Ensuring all image formats work properly with the upload system
- **Error Handling**: Improving user feedback for upload failures and validation errors

## Testing Status

### Completed Tests
- ✅ Basic form validation
- ✅ File upload functionality
- ✅ Admin registration flow
- ✅ Authentication system

### Pending Tests
- 🔄 Top dishes image upload to Cloudinary
- 🔄 Multiple file format support
- 🔄 Error handling for failed uploads
- 🔄 Admin dashboard functionality

## Next Steps

1. **Test Top Dishes Upload**: Verify that multiple dish images upload correctly to Cloudinary
2. **Implement Admin Dashboard**: Complete the admin panel functionality
3. **Add Booking System**: Implement table booking features
4. **Testing**: Comprehensive testing of all features
5. **Deployment**: Prepare for production deployment
