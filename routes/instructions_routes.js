const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const coin = req.query.coin.toString().toLowerCase();
    res.render(`instructions/${coin}`, {title: `Майнинг ${coin[0].toUpperCase() + coin.substring(1, coin.length)}`});
});
  

module.exports = router;