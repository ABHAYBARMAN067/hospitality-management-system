# Restaurant Management System

A full-stack web application for managing restaurants, menus, orders, bookings, and user interactions. Built with Node.js/Express for the backend and React/Vite for the frontend, this system provides a complete solution for restaurant owners and customers.

## Features

### User Features
- **User Authentication**: Secure login and registration with JWT-based authentication.
- **Restaurant Discovery**: Browse and view restaurant details, menus, and reviews.
- **Reviews and Ratings**: Users can leave reviews and ratings for restaurants.
- **Table Bookings**: Book tables at restaurants.
- **Order Management**: Place and track orders.
- **User Profiles**: Manage personal profiles and preferences.

### Admin Features
- **Admin Dashboard**: Comprehensive dashboard for managing the system.
- **Restaurant Management**: Add, edit, and manage restaurant information.
- **Menu Management**: Create and update menu items with images and descriptions.
- **User Management**: Oversee user accounts and permissions.
- **Analytics**: View system statistics and reports.

## Technologies Used

### Backend
- **Node.js**: Runtime environment for server-side JavaScript.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing data.
- **Mongoose**: ODM for MongoDB to model data.
- **JWT**: For secure authentication and authorization.
- **Bcrypt**: For password hashing.
- **Multer**: For handling file uploads.
- **Cloudinary**: For cloud-based image storage and management.
- **CORS**: For handling cross-origin requests.

### Frontend
- **React**: JavaScript library for building user interfaces.
- **Vite**: Fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **React Router**: For client-side routing.
- **Axios**: For making HTTP requests to the backend API.
- **React Icons**: For icons in the UI.

## Required Packages

### Backend Dependencies
- `bcryptjs`: For password hashing.
- `cloudinary`: For cloud-based image storage.
- `cors`: For handling cross-origin requests.
- `dotenv`: For environment variable management.
- `express`: Web framework for Node.js.
- `jsonwebtoken`: For JWT authentication.
- `mongoose`: MongoDB object modeling.
- `multer`: For handling file uploads.
- `react-router-dom`: For routing (client-side).
- `uuid`: For generating unique identifiers.

### Frontend Dependencies
- `@tailwindcss/vite`: Tailwind CSS plugin for Vite.
- `axios`: For making HTTP requests.
- `classnames`: For conditional CSS class names.
- `dotenv`: For environment variable management.
- `react`: Core React library.
- `react-dom`: React DOM rendering.
- `react-icons`: Icon library for React.
- `react-router-dom`: For client-side routing.
- `tailwindcss`: Utility-first CSS framework.

## Project Structure

```
/
├── backend/                 # Backend server
│   ├── config/             # Configuration files (database, cloudinary)
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Custom middlewares (auth, file upload)
│   ├── models/             # MongoDB models (User, Restaurant, MenuItem, etc.)
│   ├── routes/             # API routes
│   ├── helpers/            # Utility functions
│   ├── index.js            # Main server file
│   ├── package.json        # Backend dependencies
│   └── README.md           # Backend-specific documentation
├── frontends/              # Frontend application
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── context/        # React contexts (Auth, Theme)
│   │   ├── api/            # API utility functions
│   │   ├── assets/         # Images and icons
│   │   └── App.jsx         # Main app component
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind configuration
│   └── README.md           # Frontend-specific documentation
├── flow.md                 # Project workflow documentation
└── TODO.md                 # Task list for development
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account for image uploads

### Backend Setup
1. Navigate to the `backend` directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the server:
   ```
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

### Frontend Setup
1. Navigate to the `frontends` directory:
   ```
   cd frontends
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the `frontends` directory with the following variables:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

## Usage

1. **Access the Application**: Open your browser and go to `http://localhost:5173`.
2. **Register/Login**: Create an account or log in to access features.
3. **Browse Restaurants**: View available restaurants and their details.
4. **Admin Access**: Use admin credentials to access the admin dashboard at `/admin/dashboard`.
5. **Manage Content**: Admins can add restaurants, manage menus, and view reports.

## Frontend Routes

The frontend application runs on `http://localhost:5173` and includes the following routes:

- **Home**: `http://localhost:5173/` - Main landing page with restaurant listings.
- **Restaurant Details**: `http://localhost:5173/restaurant/:id` - View specific restaurant details, menu, and reviews.
- **Login**: `http://localhost:5173/login` - User login page.
- **Register**: `http://localhost:5173/register` - User registration page.
- **Admin Dashboard**: `http://localhost:5173/admin/dashboard` - Admin panel for managing restaurants and users.
- **User Profile**: `http://localhost:5173/profile` - User profile management.
- **Menu Management**: `http://localhost:5173/menu-management` - Manage menu items (admin feature).
- **Review Form**: `http://localhost:5173/review` - Submit reviews for restaurants.

## Backend API Endpoints

The backend API runs on `http://localhost:5000` and includes the following endpoints:

- **Authentication**: `/api/auth` (login, register, profile)
- **Restaurants**: `/api/restaurants` (list, details, create, update)
- **Menu**: `/api/menu` (menu items, categories)
- **Admin**: `/api/admin` (admin-specific operations)
- **Bookings**: `/api/bookings` (table bookings)
- **Orders**: `/api/orders` (order management)

## Development Notes

- The project is in active development with several features outlined in `TODO.md`.
- Ensure to handle environment variables securely.
- For production deployment, consider using process managers like PM2 for the backend and a static host for the frontend.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Submit a pull request.

## License

This project is licensed under the MIT License.
