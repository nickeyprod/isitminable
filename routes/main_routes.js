const express = require('express');
const router = express.Router();

const Project = require("../models/Project");
const Request = require("../models/Request");
const User = require("../models/User");

const mid = require("../middleware/middleware");

router.get('/logout', mid.isLoggedIn, (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.log("Error destroying session.")
            return next(err);
        }
        return res.redirect("/");
    });
});

router.get('/login', mid.isLoggedOut, (req, res, next) => {
    return res.render("register/login", { title: "Войти в аккаунт" });
});

router.post('/login',  (req, res) => {
    const { emailOrNick, password, remember } = req.body;

    if (!emailOrNick || emailOrNick == "") {
        console.log("Error, email or nickname is absent!")
        return res.send({ result: "ERROR", message: "Email or nickname is absent!" } )
    } else if (!password || password == "") {
        console.log("Error, password is absent!");
        return res.send({ result: "ERROR", message: "Password is absent!" });
    } 

    User.logIn(emailOrNick, password, (err, result, userId, admin) => {
        if (err) {
            return res.send({ result: "ERROR", message: err.message });
        }

        if (result == null || result == false) {
            return res.send({ result: "Wrong credentials", message: "Check login or password" });
        } else if (result == true) {
            req.session.userId = userId;
            req.session.admin = (admin === true);
            if (remember === false ) {
                req.session.maxAge = 1000 * 60 * 60 * 24;
            }
            return res.send({ result: "Authorised", message: "User has been authorised" });
        }
    });
});

router.get('/register', mid.isLoggedOut, (req, res, next) => {
    return res.render("register/register", {title: "Регистрация на сайте" });
});

router.post('/register', (req, res)=> {

    const { nickname, email, password, passwordRepeat } = req.body;

    if (!nickname || nickname == "") {
        console.log("Error, nickname is absent!");
        return res.send({ result: "ERROR", message: "Nickname is absent" })
    } else if (!email || email == "") {
        console.log("Error, email is absent!");
        return res.send({ result: "ERROR", message: "Email is absent" })
    } else if (!password || password == "") {
        console.log("Error, password is absent!");
        return res.send({ result: "ERROR", message: "Password is absent" })
    } else if (!passwordRepeat || passwordRepeat == "") {
        console.log("Error, password repeat is absent!");
        return res.send({ result: "ERROR", message: "Passwor repeat is absent" })
    } else if (password !== passwordRepeat) {
        console.log("Error, passwords do not match!");
        return res.send({ result: "ERROR", message: "Passwords do not match" })
    }

    User.create({
        nickname,
        email,
        password
    }, (err, user) => {
        if (err) {
            if (err.code == 11000) {
                if (err.message.includes("nickname")) {
                    return res.send({ result: "ERROR", message: "DUP_NICKNAME" });
                } else if (err.message.includes("email")) {
                    return res.send({ result: "ERROR", message: "DUP_EMAIL" });
                }
            }
            console.log("Error during creating new user");
            return res.send({ result: "ERROR", message: err.message });
        }
        req.session.userId = user._id;
        req.session.admin = user.admin;
        req.session.maxAge = 1000 * 60 * 60 * 24;
        return res.send({ result: "OK", message: "User successfully created!" });
    });
});


router.post('/forgot-password', mid.isLoggedOut, (req, res, next) => {
    const { email } = req.body;

    User.resetPassword(email, (err, user) => {
        if (err) {
            console.log("Error during resetting password!");
            return next(err);
        }
        return res.redirect("/instructions-sent");
    });
});

router.get('/forgot-password', mid.isLoggedOut, (req, res, next) => {
    return res.render("register/forgot_password", { title: "Восстановление пароля" });
});

router.get('/instructions-sent', mid.isLoggedOut, (req, res, next) => {
    return res.render("register/instructions_sent", { title: "Инструкции отправлены" });
});

router.get('/reset-password', mid.isLoggedOut, (req, res, next) => {
    const token = req.query.t;
    if (!token || token == "" || token == null) {
        return res.redirect("/");
    }
    User.findOne({token}, (err, user) => {
        if (err) {
            console.log("Error during searching for user");
            return next(err);
        }
        if (user && user !== null) {
            if (user.tokenExpTime > Date.now()) {
                return res.render("register/reset_password", { title: "Придумайте новый пароль", token });
            } else {
                return res.render("register/token_expired", { title: "Срок действия токена истёк"});
            }
        } else {
            return res.render("register/url_used", {title: "Ссылка уже не действительна"});
        }
    });
});


router.post('/reset-password', mid.isLoggedOut, (req, res, next) => {
    const { t, password, passwordRepeat } = req.body;

    if (!t || t == "" || t == null) {
        const err = new Error("Reset token not found");
        return next(err);
    } else if (!password || password == "") {
        const err = new Error("New password not found");
        return next(err);
    } else if (!passwordRepeat || passwordRepeat == "") {
        const err = new Error("Password repeat not found");
        return next(err);
    } else if (password !== passwordRepeat) {
        const err = new Error("Passwords do not match!");
        return next(err);
    }

    User.setPassword(t, password, (err, result) => {
        if (err) {
            console.log("Error during saving new password");
            return next(err);
        }
        if (result == "OK") {
            return res.render("register/password_changed", { title: "Пароль изменён" });
        } else {
            const err = new Error("Unknown error during setting new password");
            return next(err);
        }
    });

});


router.get('/', (req, res, next) => {
    Project.find().exec((err, projects) => {
        if (err) {
            console.log("Error during searching for projects");
            return next(err);
        }
        return res.render("main", {title: "Главная", projects });
    });
});

router.get('/how-to-use', (req, res, next) => {
    return res.render("how_to_use", {title: "Как пользоваться сайтом"});
});

router.get('/request-to-add', (req, res, next) => {
    return res.render("request_to_add", {title: "Запрос на добавление проекта"});
});

router.post("/", (req, res) => {
    const { nameOrTicker } = req.body;
    let searchQuery;
    if (nameOrTicker == "") {
        searchQuery = {};
    } else {
        const regx = new RegExp("^" + nameOrTicker + "+", "i");
        searchQuery = {$or: [{name: { $in: [ regx ] }}, {ticker: { $in: [ regx ] }}]}
    }
    
    Project.find(searchQuery).exec((err, projects) => {
        if (err) {
            console.log("Error during searching for projects");
            return res.send({ result: "ERROR", message: err.message });
        }
        
        return res.send({result: projects, message: "OK"});
    });
});

router.post('/request-to-add', (req, res) => {

    const { name, ticker, link } = req.body;

    if (!name || name == "") {
        return res.send({result: "ERROR", message: "Project name is absent!"});
    } else if (!ticker || ticker == "") {
        return res.send({result: "ERROR", message: "Project ticker is absent!"});
    } else if (!link || link == "") {
        return res.send({result: "ERROR", message: "Project link is absent!"});
    }

    Request.create({name, ticker, link}, (err, result) => {
        if (err) {
            return res.send({result: "ERROR", message: err.message });
        }
        res.send({result: "OK", message: "Project successfully added!"});
    });
});
  
module.exports = router;