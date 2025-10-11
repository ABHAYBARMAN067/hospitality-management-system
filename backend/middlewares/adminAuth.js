// backend/middlewares/adminAuth.js
import jwt from 'jsonwebtoken';

export default function (req, res, next) {
    // Token check
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access only' });
        }

        req.user = decoded; // attach user info
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}
