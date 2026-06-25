const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        user: 'randaerfan12@gmail.com',
        pass: 'jebk lvnj ptpv oivo'
    }
})

module.exports = transporter