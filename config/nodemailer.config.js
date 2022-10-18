const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
})

module.exports.sendConfirmationEmail = (username, email, confirmationCode) => {
    transport.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Confirmation account',
        html: `
            <div style="padding: .5em; background-color: #333; color: #fafafa;">
                <div style="text-align: center;">
                    <h1>Email confirmation</h1>
                    <h3>Hi ${username}</h3>
                    <p>
                        Thank you for the subscribtion.
                        Please confirm your email by clicking on the following link
                    </p>
                    <a style="color: #fafafa;" href="http://localhost:3000/api/auth/confirmation/${confirmationCode}">Confirm</a>
                </div>
            </div>
        `
    })
}