const nodeMailer = require("nodemailer");

exports.sendEmailWithNodemailer = (req, res, emailData) =>
{

    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    return transporter
        .sendMail(emailData)
        .then((info) =>
        {
            console.log(`Message sent: ${info.response}`);
            return res.json({
                success: true,
            });
        })
        .catch((err) => console.log(`Problem sending email: ${err}`));
};
