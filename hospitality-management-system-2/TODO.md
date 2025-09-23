# TODO - Fix 401 Unauthorized Error for User Profile

## Issue
The UserProfile.jsx component is receiving a 401 Unauthorized error when trying to fetch user data from `/api/auth/profile`. This is caused by the JWT_SECRET not being properly configured in the environment.

## Root Cause
- The auth middleware and controller were using `process.env.JWT_SECRET` directly
- The `.env` file likely doesn't have JWT_SECRET set
- The `database.js` config file has a fallback, but it wasn't being used in the auth files

## Changes Made
- ✅ Updated `backend/middlewares/auth.js` to import and use `config.jwtSecret`
- ✅ Updated `backend/controllers/authController.js` to import and use `config.jwtSecret`
- ✅ Both JWT signing and verification now use the fallback secret from `database.js`

## Next Steps
- Test the fix by restarting the backend server and trying to access the user profile
- Verify that the profile endpoint now returns user data successfully
- If the issue persists, check for other potential causes (e.g., token format, user existence)

## Files Modified
- `backend/middlewares/auth.js`
- `backend/controllers/authController.js`
