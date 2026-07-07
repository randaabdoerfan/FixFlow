const jwt = require('jsonwebtoken');

const verifyToken = (type) => (req, res, next) => {
    try {
        let token;  
        if (req.params.token) {
            token = req.params.token;
        } else {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ success: false, message: 'No token provided' });
            }
            token = authHeader.split(' ')[1];
            req.token = token
        }
        const decoded = jwt.verify(token, process.env.SECERT_KEY);

        if (decoded.type !== type) {
            return res.status(401).json({ success: false, message: 'Invalid token type' });
        }

        req.user = decoded; 
        next();
    } catch (err) {
        
        return res.status(401).json({ success: false, message: 'Token expired or invalid' });
    }
};

module.exports = verifyToken;