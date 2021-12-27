const nodemailer = require('nodemailer');

// ENVIRONMENT VARIABLES
const PRODUCTION = process.env.NODE_ENV == "production";
const GMAIL = PRODUCTION ? process.env.GMAIL : require("../passwords.json").GMAIL;
const GMAIL_PASS = PRODUCTION ? process.env.GMAIL_PASS : require("../passwords.json").GMAIL_PASS;

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: GMAIL,
      pass: GMAIL_PASS,
    },
});


const sendResetInstructions = (email, token, cb) => {
    const tokenUrl = `http://localhost:3000/reset-password?t=${token}`;
    // send mail with defined transport object
    let info = transporter.sendMail({
        from: '"IsItMinable.com" <nickeyprod@gmail.com>', // sender address
        to: email, // "bar@example.com, baz@example.com" list of receivers
        subject: "Сброс пароля",
        html: `<h3>IsItMinable.com: Сброс пароля</h3><div><p>Для сброса пароля, переидите по ссылке в письме. Если вы не знаете откуда это сообщение, просто проигнорируйте его. Ссылка для сброса пароля: <a href='${tokenUrl}'>${tokenUrl}</a></p></div>`, // html body
    }, cb);
};

module.exports.sendResetInstructions = sendResetInstructions;