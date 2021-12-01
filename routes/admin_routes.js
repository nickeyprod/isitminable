const express = require('express');
const router = express.Router();

const Project = require("../models/Project");
const Request = require("../models/Request");

const mid = require("../middleware/middleware");

router.get('/', mid.isAdmin, (req, res, next) => {
    Project.find().exec((err, projects) => {
        if (err) {
            console.log("Error during searching for projects");
            return next(err);
        }
        res.render("admin/panel", {title: "Панель управления"});
    });
});

router.get('/add-project', (req, res) => {
    res.render("admin/add_project", {title: "Добавить проект"});
});

router.post('/add-project', (req, res) => {

    const { name, ticker, link } = req.body;

    if (!name || name == "") {
        return res.send({result: "ERROR", message: "Project name is absent!"});
    } else if (!ticker || ticker == "") {
        return res.send({result: "ERROR", message: "Project ticker is absent!"});
    }

    Project.create({name, ticker, link}, (err, projects) => {
        if (err) {
            return res.send({result: "ERROR", message: err.message });
        }
        res.send({result: "OK", message: "Project successfully added!"});
    });
});

router.get('/edit-project', (req, res, next) => {
    const _id = req.query.id;
    
    if (!_id) {
        const error = new Error("Project ID is absent");
        return next(error);
    }

    Project.findOne({ _id }).exec((err, project) => {
        if (err) {
            console.log("Error during searching for projects");
            return next(err);
        }
        return res.render("admin/edit_project", {title: "Редактировать проект", project});
    });
});

router.post('/edit-project', (req, res) => {

    const { _id, name, ticker, link } = req.body;

    if (!name || name == "") {
        return res.send({result: "ERROR", message: "Project name is absent!"});
    } else if (!ticker || ticker == "") {
        return res.send({result: "ERROR", message: "Project ticker is absent!"});
    }

    Project.updateOne({ _id }, {$set: { name, ticker, link }}, (err, project) => {
        if (err) {
            return res.send({result: "ERROR", message: err.message });
        }
        res.send({result: "OK", message: "Project successfully updated!"});
    });
});

router.get('/rm-hide-project', (req, res, next) => {
    Project.find().exec((err, projects) => {
        if (err) {
            console.log("Error during searching for projects");
            return next(err);
        }
        res.render("admin/rm_hide_project", {title: "Удалить/Спрятать проект", projects});
    });
});

router.post('/rm-hide-project', (req, res) => {
    const {_id, hidden, action } = req.body;
    if (!_id || _id == "") {
        return res.send({result: "ERROR", message: "Project ID is absent!"});
    } else if (action == "vis" && hidden === "" || action == "vis" && (hidden != true && hidden != false)) {
        return res.send({result: "ERROR", message: "Project hidden property is absent!"});
    } 
    if (action === "vis") {
        Project.updateOne({ _id }, { $set: { hidden } }).exec((err, result) => {
            if (err) {
                console.log("Error during updating project visibility");
                return res.send({result: "ERROR", message: err.message });
            }
            return res.send({result: "OK", message: "Project visibility successfully changed!"});
        });
    } else if (action == "rm") {
        Project.deleteOne({ _id }).exec((err, result) => {
            if (err) {
                console.log("Error during removing project");
                return res.send({result: "ERROR", message: err.message });
            }
            return res.send({result: "OK", message: "Project has been removed!"});
        });
    }
});

router.get('/requests', (req, res, next) => {
    Request.find().exec((err, requests) => {
        if (err) {
            console.log("Error during searching for requests");
            return next(err);
        }
        res.render("admin/requests_to_add", {title: "Запросы на добалвение проектов", requests});
    });
});

router.post('/requests', (req, res, next) => {
    const { _id } = req.body;

    if (!_id || _id == "") {
        console.log("Error, element ID is absent");
        return res.send({result: "ERROR", message: "Element ID is absent!" });    
    }

    Request.deleteOne({ _id }).exec((err, result) => {
        if (err) {
            console.log("Error during removing request");
            return res.send({result: "ERROR", message: err.message });
        }
        return res.send({result: "OK", message: "Request has been removed!"});
    });
});


module.exports = router;