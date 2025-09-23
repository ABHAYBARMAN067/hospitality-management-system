# Restaurant Booking System - Backend

A robust Node.js backend for a restaurant booking and management system with advanced features including authentication, file uploads, caching, and API documentation.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based authentication with role-based access control
- **Restaurant Management**: CRUD operations for restaurants with image uploads
- **Booking System**: Table booking management with status tracking
- **Order Management**: Food ordering system with real-time updates
- **Menu Management**: Dynamic menu creation and management
- **Reviews & Ratings**: Customer review and rating system

### Advanced Features
- **File Upload**: Cloudinary integration for image uploads with optimization
- **Rate Limiting**: Protection against API abuse with configurable limits
- **Security Headers**: Helmet.js for enhanced security
- **API Documentation**: Swagger/OpenAPI documentation with interactive UI
- **Redis Caching**: Performance optimization with intelligent caching
- **Error Handling**: Comprehensive error handling and logging
- **Health Checks**: Built-in health check endpoints

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Caching**: Redis
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet.js, CORS, Rate Limiting
- **Validation**: Joi (for request validation)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Redis (for caching)
- Cloudinary account (for image uploads)

## 🔧 Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update the environment variables with your actual values:
     ```env
     MONGODB_URI=your-mongodb-connection-string
     JWT_SECRET=your-super-secret-jwt-key
     CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
     CLOUDINARY_API_KEY=your-cloudinary-api-key
     CLOUDINARY_API_SECRET=your-cloudinary-api-secret
     REDIS_HOST=localhost
     REDIS_PORT=6379
     ```

4. **Start MongoDB and Redis**
   - Ensure MongoDB is running on your system
   - Ensure Redis is running on your system

5. **Run the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Roles
- **User**: Standard user with booking and ordering capabilities
- **Admin**: Full access to all administrative functions

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.js          # MongoDB connection
│   ├── cloudinary.js        # Cloudinary configuration
│   └── swagger.js           # API documentation
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── restaurantController.js # Restaurant management
│   ├── bookingController.js # Booking management
│   ├── orderController.js   # Order management
│   ├── menuController.js    # Menu management
│   ├── reviewController.js  # Reviews and ratings
│   └── adminController.js   # Admin operations
├── middlewares/
│   ├── auth.js              # Authentication middleware
│   ├── rateLimiter.js       # Rate limiting
│   ├── security.js          # Security headers
│   └── fileUpload.js        # File upload handling
├── helpers/
│   └── cache.js             # Redis caching utilities
├── models/
│   ├── User.js              # User schema
│   ├── Restaurant.js        # Restaurant schema
│   ├── TableBooking.js      # Booking schema
│   ├── Order.js             # Order schema
│   ├── MenuItem.js          # Menu item schema
│   └── Rating.js            # Rating schema
├── .env.example             # Environment variables template
├── server.js                # Main application file
└── README.md                # This file
```

## 🔒 Security Features

- **Helmet.js**: Sets various HTTP headers for security
- **Rate Limiting**: Prevents API abuse with configurable limits
- **CORS**: Configured for cross-origin requests
- **Input Validation**: Request validation and sanitization
- **Error Handling**: Secure error responses without exposing sensitive information

## ⚡ Performance Features

- **Redis Caching**: Intelligent caching for frequently accessed data
- **Database Indexing**: Optimized queries with proper indexing
- **File Optimization**: Image compression and optimization via Cloudinary
- **Connection Pooling**: Efficient database connection management

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Update all environment variables
- [ ] Configure production database
- [ ] Set up SSL certificates
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check the API documentation at /api-docs
- Review the logs for error details

## 📄 License

This project is licensed under the MIT License.
