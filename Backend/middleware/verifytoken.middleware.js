const jwt = require('jsonwebtoken')

const verifyToken = (type) =>{return (req, res, next) => {
    try {
        const token = req.params.token
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const payload = jwt.verify(token, process.env.SECERT_KEY);
        req.user = payload;
        if (payload.type !== type) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
}
module.exports = verifyToken