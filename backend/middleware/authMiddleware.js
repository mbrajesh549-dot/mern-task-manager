const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Header se token nikalna
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    try {
        // Token verify karna
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Request me userId add karna
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid.' });
    }
};

module.exports = authMiddleware;