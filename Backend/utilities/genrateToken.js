const jwt = require('jsonwebtoken')

const generateToken =(user,type)=>{
     let expiresIn;

    switch (type) {
        case 'login':
            expiresIn = '7d';
            break;

        case 'verify':
            expiresIn = '1d';
            break;

        case 'reset':
            expiresIn = '1h';
            break;
        case 'refresh':
            expiresIn = '7d';
            break;

        default:
            throw new Error('Invalid token type');
    }

    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
            role:user.role,
            type:type
            
        }
        ,process.env.SECERT_KEY,
        { expiresIn }
    );
};

module.exports = generateToken