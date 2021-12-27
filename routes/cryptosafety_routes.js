const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    return res.render("crypto_safety/crypto_safety", {title: "Криптобезопасность"});
});

module.exports = router;