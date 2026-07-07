const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const verifyRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "Login Again.." });  
    }

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET); 
        

        if (!payload.userId) {
            return res.status(401).json({ message: "User not found" }); 
        }
        req.user = payload
        next();          

    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};
module.exports = verifyRefreshToken