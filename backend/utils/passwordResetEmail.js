const nodemailer = require('nodemailer');

async function sentPasswordResetEmail(user, emailToken){
const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    auth:{
        user: process.env.password_reset_email,
        pass: process.env.password_reset_email_password
    }
});

const mailOptions = {
    from: 'shahradhey90@gmail.com',
    to: user.email,
    subject: 'Ecommerce App Password Reset Email Link',
    text: `Please click on the link below to reset your password: \n\n ${req}://localhost:3000/api/v1/user/updatepassword/${emailToken}`
}

await transporter.sendMail(mailOptions);

}

module.exports = sentPasswordResetEmail;