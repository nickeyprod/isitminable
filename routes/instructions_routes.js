const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    const coin = req.query.coin.toString().toLowerCase().replace(/ /g, '_');
    return res.render(`instructions/${coin}`, {title: `Майнинг ${coin[0].toUpperCase() + coin.substring(1, coin.length)}`});
});
  

module.exports = router;