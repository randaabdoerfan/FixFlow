const jwt = require('jsonwebtoken')

const verifyToken = (type) =>{return (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const payload = jwt.verify(token, process.env.SECERT_KEY);
        req.user = payload;
        // console.log(req.user)
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