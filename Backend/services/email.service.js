const transporter = require('../config/email.config')

exports.WelcomeAndSendVerifcation = async (email, username, token) => {
    try {
        const link = `http://localhost:3000/users/verify/${token}`
        await transporter.sendMail({
            from: `"Incident Management System" <${process.env.email_user}>`,
            to: email,
            subject: "welcome to our website",
            html: `<h2>Hello, ${username}</h2>
                <p>Thanks for signing up! Please verify your email address to activate your account.</p>
                <a href="${link}" target="_blank" style="
                background-color: #ADD8E6;
                padding: 10px 20px;
                text-decoration: none;
                color: black;
                border-radius: 5px;
                display: inline-block;
                font-weight: bold;">Verify Email</a>
                <p style="color:gray; font-size:12px; margin-top:20px;">
                    This link expires in 24 hours. If you didn't create an account, ignore this email.
                </p>`
        })
    } catch (err) {
        console.log(err);
        throw new Error("Failed to send email");
    }
}

exports.changePasswordEmail = async (email, username) => {
    try {
        
        await transporter.sendMail({
            from: `"Incident Management System" <${process.env.email_user}>`,
            to: email,
            subject: "Change Password",
            html: `<h2>Hello, ${username}</h2>
                <p>Your password was recently changed.</p>
                <p>If you made this change, no action is needed.</p>
                <p style="color:red;">
                    If you did <strong>not</strong> make this change, 
                    please reset your password immediately.
                </p>`
        })
    } catch (err) {
        console.log(err);
        throw new Error("Failed to send email");
    }
}

exports.resetPasswordEmail = async (email, username, token) => {
    try {
        const link = `http://localhost:3000/users/resetpassword/${token}`
        await transporter.sendMail({
            from: `"Incident Management System" <${process.env.email_user}>`,
            to: email,
            subject: "Reset Password",
            html:
                `<h2>Hello, ${username}</h2>
                <p>We received a request to reset your password. Click the button below to proceed.</p>
                <a href="${link}" target="_blank" style="
                background-color: #ADD8E6;
                padding: 10px 20px;
                text-decoration: none;
                color: black;
                border-radius: 5px;
                display: inline-block;
                font-weight: bold;">Reset Password</a>
                <p style="color:gray; font-size:12px; margin-top:20px;">
                    This link expires in 1 hour. If you didn't request a reset, ignore this email.
                </p>`

        })

    } catch (err) {
        console.log(err);
        throw new Error("Failed to send email");
    }
}
