const transporter = require('../config/email.config')

exports.WelcomeAndSendVerifcation = async (email, username, token) => {
    try {
        const link = `http://localhost:8001/users/verify/${token}`
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

exports.statusChangeEmail = async (email, username, ticketTitle, newStatus) => {
    try {
        await transporter.sendMail({
            from: `"Incident Management System" <${process.env.email_user}>`,
            to: email,
            subject: `Ticket Status Updated: ${ticketTitle}`,
            html: `<h2>Hello, ${username}</h2>
                <p>The status of your ticket "<strong>${ticketTitle}</strong>" has been updated to <strong>${newStatus}</strong>.</p>
                <p>Please log in to view the details.</p>
                <p style="color:gray; font-size:12px; margin-top:20px;">
                    This is an automated message. Please do not reply.
                </p>`
        })
    } catch (err) {
        console.log(err);
    }
};

exports.ticketCreatedEmail = async (email, username, ticketTitle) => {
    try {
        await transporter.sendMail({
            from: `"Incident Management System" <${process.env.email_user}>`,
            to: email,
            subject: `Ticket Created: ${ticketTitle}`,
            html: `<h2>Hello, ${username}</h2>
                <p>Your ticket "<strong>${ticketTitle}</strong>" has been created successfully.</p>
                <p>Please log in to track its progress.</p>
                <p style="color:gray; font-size:12px; margin-top:20px;">
                    This is an automated message. Please do not reply.
                </p>`
        })
    } catch (err) {
        console.log(err);
    }
};

exports.ticketAssignedEmail = async (email, username, ticketTitle) => {
    try {
        await transporter.sendMail({
            from: `"Incident Management System" <${process.env.email_user}>`,
            to: email,
            subject: `Ticket Assigned: ${ticketTitle}`,
            html: `<h2>Hello, ${username}</h2>
                <p>Ticket "<strong>${ticketTitle}</strong>" has been assigned to you.</p>
                <p>Please log in to start working on it.</p>
                <p style="color:gray; font-size:12px; margin-top:20px;">
                    This is an automated message. Please do not reply.
                </p>`
        })
    } catch (err) {
        console.log(err);
    }
};

exports.resetPasswordEmail = async (email, username, token) => {
    try {
        const link = `http://localhost:8001/users/resetpassword/${token}`
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
