const nodemailer = require('nodemailer');

// ENVIRONMENT VARIABLES
const PRODUCTION = process.env.NODE_ENV == "production";
const GMAIL = PRODUCTION ? process.env.GMAIL : require("../passwords.json").GMAIL;
const GMAIL_PASS = PRODUCTION ? process.env.GMAIL_PASS : require("../passwords.json").GMAIL_PASS;
const HOST = PRODUCTION ? "isitminable.com" : "localhost:3000";

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
    const tokenUrl = `http://${HOST}/reset-password?t=${token}`;
    // send mail with defined transport object
    let info = transporter.sendMail({
        from: '"IsItMinable.com" <nickeyprod@gmail.com>', // sender address
        to: email, // "bar@example.com, baz@example.com" list of receivers
        subject: "Сброс пароля на сайте IsItMinable.com",
        html: `<h3>IsItMinable.com: Сброс пароля</h3>
            <div>
                <p>Вы получили это письмо, потому что кто-то пытается изменить пароль 
                от вашего аккаунта на сайте IsItMinable.com. Если это вы, то для сброса 
                пароля переидите по ссылке в письме. В противном случае, позаботьтесь 
                о безопасности соего аккаунта!</p>.
                </br></br>
                <p>Ссылка для сброса пароля: <a href='${tokenUrl}'>${tokenUrl}</a></p>
            </div>`, // html body
    }, cb);
};

module.exports.sendResetInstructions = sendResetInstructions;