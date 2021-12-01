
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/isitminabledb');

const app = express();
const port = 3000;

app.set('view engine', 'pug');

app.use(express.static('public'))

app.use(favicon(path.join(__dirname, 'public', 'site_icon.png')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mainRoutes = require("./routes/main_routes.js");
const instructionsRoutes = require("./routes/instructions_routes.js");
const adminRoutes = require("./routes/admin_routes");


app.use(mainRoutes);
app.use("/how-to-mine", instructionsRoutes);
app.use("/panel", adminRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('На сайте нет такой страницы: ' + decodeURI(req.originalUrl));
  err.code = 404;
  res.status(404);
  next(err);
});

// catch error
app.use((err, req, res, next) => {
  console.log("ERR");
  res.render('error', { error: err })
});

app.listen(port, () => {
  console.log(`IsItMinable website is now at http://localhost:${port}`)
});