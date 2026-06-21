const jwt = require('jsonwebtoken')

const generateToken =(user)=>{
    return jwt.sign( { userId: user._id,email:user.email, role: user.role },process.env.SECERT_KEY,{expiresIn:'1d'})
} 
module.exports = generateToken