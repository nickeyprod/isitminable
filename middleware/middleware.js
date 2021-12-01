
const isAdmin = (req, res, next) => {
    if (req.session) {
        return next();
    } else {
        return res.redirect("/");
    }
};

module.exports.isAdmin = isAdmin;