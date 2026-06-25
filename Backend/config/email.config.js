const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        user: process.env.email_user,
        pass: process.env.email_password
    }
})

module.exports = transporter