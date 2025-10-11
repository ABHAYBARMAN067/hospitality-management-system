# HospitalityHub 

A full-stack web application for managing restaurants, bookings, menus, and user interactions in a hospitality setting.

## Features

- **User Authentication**: Register and login with JWT-based authentication.
- **Restaurant Management**: Admins can add, view, and manage their restaurants with details like name, address, contact, and images.
- **Menu Management**: Create and manage restaurant menus with items, prices, and descriptions.
- **Table Bookings**: Users can book tables, and admins can approve or reject bookings.
- **Admin Dashboard**: Comprehensive dashboard for admins to oversee restaurants and bookings.
- **Review System**: Users can leave reviews for restaurants.
- **Image Upload**: Cloudinary integration for uploading restaurant and menu images.
- **Responsive UI**: Built with React and Tailwind CSS for a modern, responsive interface.
- **Dark Mode Support**: UI supports light and dark themes.

## Tech Stack

### Frontend
- React (with Vite)
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React (for icons)

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT (JSON Web Tokens)
- Bcryptjs (for password hashing)
- Multer (for file uploads)
- Cloudinary (for image storage)
- CORS

### Dev Tools
- Nodemon (for backend development)
- ESLint (for code linting)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd hospitality-management-system
   ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**:
   - Create a `.env` file in the `backend` directory with the following variables:
     ```
     PORT=5000
     NODE_ENV=development
     MONGODB_URI=mongodb://localhost:27017/hospitality-management-system
     JWT_SECRET=your-jwt-secret
     CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
     CLOUDINARY_API_KEY=your-cloudinary-api-key
     CLOUDINARY_API_SECRET=your-cloudinary-api-secret
     ```
   - Note: For production, use a MongoDB Atlas URI or other database.

5. **Start MongoDB**:
   - Ensure MongoDB is running locally on port 27017, or update `MONGODB_URI` accordingly.

## Usage

1. **Start the backend server**:
   ```bash
   cd backend
   npm run dev
   ```
   The server will run on `http://localhost:5000`.

2. **Start the frontend development server**:
   ```bash
   cd frontend
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

3. **Access the application**:
   - Open your browser and go to `http://localhost:5173`.
   - Register a new account or login.
   - Admins can access `/admin/dashboard` to manage restaurants and bookings.

## File Structure

```
hospitality-management-system/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── database.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── menuController.js
│   │   ├── restaurantController.js
│   │   └── reviewController.js
│   ├── middlewares/
│   │   ├── adminAuth.js
│   │   ├── auth.js
│   │   └── fileUpload.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── MenuItem.js
│   │   ├── Order.js
│   │   ├── Restaurant.js
│   │   ├── Review.js
│   │   ├── TableBooking.js
│   │   └── User.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   ├── menu.js
│   │   ├── restaurants.js
│   │   └── reviews.js
│   ├── .gitignore
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
├── frontend/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   ├── About.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── HotelsDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MenuManagement.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Restaurant.jsx
│   │   │   ├── ReviewForm.jsx
│   │   │   ├── Service.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   └── UI/
│   │   │       ├── LoadingSpinner.jsx
│   │   │       ├── Navbar.jsx
│   │   │       └── SkeletonLoader.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
├── README.md
├── TODO.md

```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/admin/restaurants` - Add a new restaurant (admin)
- `GET /api/admin/my-restaurants` - Get admin's restaurants

### Bookings
- `POST /api/bookings` - Create a booking
- `GET /api/admin/bookings` - Get all bookings (admin)
- `PATCH /api/admin/bookings/:id` - Update booking status (admin)

### Menu
- `GET /api/menu/:restaurantId` - Get menu for a restaurant
- `POST /api/menu` - Add menu item (admin)
- `PUT /api/menu/:id` - Update menu item (admin)
- `DELETE /api/menu/:id` - Delete menu item (admin)

### Reviews
- `POST /api/reviews/:restaurantId` - Create a review for a restaurant
- `GET /api/reviews/:restaurantId` - Get reviews for a restaurant

### Admin
- Additional admin-specific endpoints for managing restaurants and bookings.

## Contributors

- **Astha** – Frontend Development  
- **Abhay** – Backend Development  
- **Anmol** – Database Creation


## License

All rights reserved. No one can use, copy, or distribute this project without permission.
