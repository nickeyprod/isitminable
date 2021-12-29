const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    const coin = req.query.coin.toString().toLowerCase();
    try {
        res.render(`instructions/${coin}`, {title: `Майнинг ${coin[0].toUpperCase() + coin.substring(1, coin.length)}`});
    } catch (err) {
        next(err);
    }
});
  

module.exports = router;