
const isAdmin = (req, res, next) => {
    if (req.session && req.session.admin === true) {
        return next();
    } else {
        return res.redirect("/");
    }
};

const isLoggedIn = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        return res.redirect("/");
    }
};

const isLoggedOut = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return next();
    }
    else {
        return res.redirect("/");
    }
};

module.exports.isAdmin = isAdmin;
module.exports.isLoggedIn = isLoggedIn;
module.exports.isLoggedOut = isLoggedOut;
