# Project Folder Structure

```
backend/
    index.js
    package.json
    README.md
    config/
        cloudinary.js
        database.js
    controllers/
        adminController.js
        authController.js
        menuController.js
        restaurantController.js
    helpers/
    middlewares/
        adminAuth.js
        auth.js
        fileUpload.js
    models/
        MenuItem.js
        Order.js
        Restaurant.js
        TableBooking.js
        User.js
    routes/
        admin.js
        auth.js
        menu.js
        restaurants.js

frontends/
    eslint.config.js
    index.html
    package.json
    README.md
    vite.config.js
    public/
        vite.svg
    src/
        App.css
        App.jsx
        index.css
        main.jsx
        api/
            api.js
        assets/
            react.svg
        components/
            Admin.jsx
            Home.jsx
            Login.jsx
            MenuManagement.jsx
            Register.jsx
            Restaurant.jsx
            ReviewForm.jsx
            UserProfile.jsx
            UI/
                LoadingSpinner.jsx
                Navbar.jsx
                SkeletonLoader.jsx
                ThemeToggle.jsx
        context/
            AuthContext.jsx
            ThemeContext.jsx
```

- `backend/` : Node.js/Express backend with all API, models, controllers, middlewares, and config.
- `frontends/` : React frontend with all components, context, assets, and config files.

This structure keeps backend and frontend code clean and separated for easy development and deployment.
