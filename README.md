restaurant-table-booking/
│
├── backend/                     # Node.js + Express (API server)
│   ├── src/
│   │   ├── config/              # Config files (MongoDB, Cloudinary, etc.)
│   │   │   ├── db.js
│   │   │   └── cloudinary.js
│   │   │
│   │   ├── models/              # Mongoose Models
│   │   │   ├── User.js
│   │   │   ├── Hotel.js
│   │   │   ├── Table.js
│   │   │   └── Booking.js
│   │   │
│   │   ├── routes/              # Express Routes (APIs)
│   │   │   ├── authRoutes.js
│   │   │   ├── hotelRoutes.js
│   │   │   ├── tableRoutes.js
│   │   │   └── bookingRoutes.js
│   │   │
│   │   ├── controllers/         # Logic for APIs
│   │   │   ├── authController.js
│   │   │   ├── hotelController.js
│   │   │   ├── tableController.js
│   │   │   └── bookingController.js
│   │   │
│   │   ├── middleware/          # Middlewares (auth, error handling)
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── utils/               # Helper functions (if needed)
│   │   │   └── generateToken.js
│   │   │
│   │   ├── app.js               # Express app setup
│   │   └── server.js            # Server entry point
│   │
│   ├── .env                     # Secrets (Mongo URI, Cloudinary keys, JWT secret)
│   ├── package.json
│   └── README.md
│
├── frontend/                    # React.js app
│   ├── public/                  # Static files
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   └── HotelCard.js
│   │   │
│   │   ├── pages/               # Main pages
│   │   │   ├── Home.js
│   │   │   ├── About.js
│   │   │   ├── Services.js
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── MyTable.js
│   │   │   ├── HotelDetails.js
│   │   │   └── AdminDashboard.js
│   │   │
│   │   ├── context/             # Auth / Global state context
│   │   │   └── AuthContext.js
│   │   │
│   │   ├── utils/               # Helper (API calls etc.)
│   │   │   └── api.js
│   │   │
│   │   ├── App.js               # Main React app
│   │   └── index.js             # Entry point
│   │
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md



📄 README.md
# Restaurant Table Booking System

## Project Overview
A seamless online platform for customers to book tables in restaurants and for hotels to manage their table reservations easily.

---

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js + Express.js
- **Database:** MongoDB with Mongo Atlas
- **Media Storage:** Cloudinary
- **Authentication:** JWT (login, signup, session management)
- **Other Tools:** Axios (API calls), React Context (Auth State), CORS

---

## File Structure & Purpose

### Frontend (`/frontend`)


frontend/
├── public/
│ └── index.html # Main HTML file
├── src/
│ ├── components/ # Reusable UI components
│ │ ├── Navbar.jsx # Navigation bar with links and logo
│ │ ├── Footer.jsx # Footer for all pages
│ │ └── HotelCard.jsx # Card component to display hotel info
│ │
│ ├── pages/ # Main pages
│ │ ├── Home.jsx # Landing page showing hotels
│ │ ├── About.jsx # About the system
│ │ ├── Services.jsx # Services offered
│ │ ├── Login.jsx # Login form
│ │ ├── Signup.jsx # Signup form
│ │ ├── MyTable.jsx # User's booking history
│ │ ├── HotelDetails.jsx # Hotel info + table booking
│ │ └── AdminDashboard.jsx # Admin dashboard for managing tables/bookings
│ │
│ ├── context/
│ │ └── AuthContext.jsx # Global auth state (login/logout)
│ │
│ ├── utils/
│ │ └── api.js # Axios helper to call backend APIs
│ │
│ ├── App.js # Main React app + routes
│ └── index.js # Entry point of React app
├── package.json # React dependencies
└── README.md # Frontend description


---

### Backend (`/backend`)


backend/
├── src/
│ ├── config/
│ │ ├── db.js # MongoDB connection setup
│ │ └── cloudinary.js # Cloudinary config for image storage
│ │
│ ├── models/ # Mongoose models
│ │ ├── User.js # User schema (name, email, password, role)
│ │ ├── Hotel.js # Hotel schema (name, address, images, top dishes)
│ │ ├── Table.js # Table schema (hotel, seats, availability)
│ │ └── Booking.js # Booking schema (user, hotel, table, date, status)
│ │
│ ├── routes/ # API endpoints
│ │ ├── authRoutes.js # Login/Signup endpoints
│ │ ├── hotelRoutes.js # Hotel CRUD endpoints
│ │ ├── tableRoutes.js # Table CRUD endpoints
│ │ └── bookingRoutes.js # Booking endpoints
│ │
│ ├── controllers/ # Business logic for APIs
│ │ ├── authController.js # Login/Signup logic
│ │ ├── hotelController.js # Hotel CRUD logic
│ │ ├── tableController.js # Table CRUD logic
│ │ └── bookingController.js # Booking create, fetch, update logic
│ │
│ ├── middleware/
│ │ └── authMiddleware.js # JWT auth & admin route protection
│ │
│ ├── utils/
│ │ └── generateToken.js # JWT token generation
│ │
│ ├── app.js # Express app setup (middlewares + routes)
│ └── server.js # Server start + MongoDB connection
├── .env # Secrets (Mongo URI, JWT secret, Cloudinary keys)
├── package.json # Backend dependencies
└── README.md # Backend description


---

## Key Features
- Customers can browse hotels and book tables online.
- Hotels have dedicated dashboards to manage tables and bookings.
- Users can see their booking history in **MyTable** page.
- Admin-only routes for creating/updating hotels and tables.
- JWT-based authentication for secure access.

---

## How to Run

### Frontend
```bash
cd frontend
npm install
npm start

Backend
cd backend
npm install
node src/server.js


Make sure to create a .env file in backend with MongoDB URI, JWT_SECRET, and Cloudinary credentials.

Tech Stack Visual

Frontend: React.js + Axios + Context API

Backend: Node.js + Express.js + MongoDB

Media: Cloudinary

Auth: JWT (login/signup/session)



### =====================================================================================================================================================
npm install react-router-dom

1️⃣ Backend Setup & Run
Step 1: Install dependencies
cd backend
npm install

Step 2: Create .env file

Example .env:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000

Step 3: Start the server
node src/server.js


If nodemon is installed:

nodemon src/server.js


Terminal will show:

MongoDB connected
Server running on http://localhost:5000


✅ Backend is ready.

2️⃣ Frontend Setup & Run
Step 1: Install dependencies
cd frontend
npm install

Step 2: Start React app
npm start


The browser will automatically open http://localhost:3000

React frontend will connect with backend APIs (api.js baseURL = http://localhost:5000/api)

3️⃣ Test Workflow
Backend working check:

Open browser and visit: http://localhost:5000/

You should see:

Restaurant Table Booking API is running...

Frontend working check:

Open Login / Signup page

Check the list of hotels

Try booking a table

💡 Notes:

Backend port: 5000

Frontend port: 3000

Run backend and frontend in separate terminals.

.env must be properly configured for MongoDB & Cloudinary.

