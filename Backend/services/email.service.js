const transporter = require('../config/email.config')

exports.WelcomeAndSendVerifcation = async (email, username, token) => {
    try {
        const link = `http://localhost:3000/users/verify/${token}`
        await transporter.sendMail({
            from: `"Incident Management System" <${process.env.email_user}>`,
            to: email,
            subject: "welcome to our website",
            html: `<h2>Hello, ${username}</h2>

<p>Please verify your email:</p>

<a href="${link}" target="_blank"
   style="background-color:#ADD8E6;
          padding:10px;
          text-decoration:none;
          color:black;
          border-radius:5px;
          display:inline-block;">
   Verify Email
</a>`
        })
    } catch (err) {
        console.log(err);
        throw new Error("Failed to send email");
    }
}

exports.changePasswordEmail = async (email, username, token) => {
    try {
        const link = `http://localhost:3000/users/changepassword/${token}`
        await transporter.sendMail({
            from: `"Incident Management System" <${process.env.email_user}>`,
            to: email,
            subject: "Change Password",
            html: `<h2>Hello, ${username}</h2>
<p>Please click the button below to change your password:</p>
<a href="${link}" target="_blank"
    style="background-color:#ADD8E6;
              padding:10px;
                text-decoration:none;
                color:black;
                border-radius:5px;
                display:inline-block;">
    Change Password
</a>`
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
<p>Please click the button below to reset your password:</p>
<a href="${link}" target="_blank"
    style="background-color:#ADD8E6;
              padding:10px;
                text-decoration:none;
                color:black;
                border-radius:5px;
                display:inline-block;">
    Reset Password
</a>`

        })

    } catch (err) {
        console.log(err);
        throw new Error("Failed to send email");
    }
}
