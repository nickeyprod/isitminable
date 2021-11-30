const express = require('express');
const router = express.Router();

const Project = require("../models/Project");
const Request = require("../models/Request");

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