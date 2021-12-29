const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    const coin = req.query.coin.toString().toLowerCase().replaceAll(' ', '_');
    try {
        res.render(`instructions/${coin}`, {title: `Майнинг ${coin[0].toUpperCase() + coin.substring(1, coin.length)}`});
    } catch (err) {
        err.message = "Инструкции для данного проекта не найдены на сервере."
        next(err);
    }
});
  

module.exports = router;