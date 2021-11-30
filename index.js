
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

// catch error
// app.use()

app.use(mainRoutes);
app.use("/how-to-mine", instructionsRoutes);
app.use("/panel", adminRoutes);

app.listen(port, () => {
  console.log(`IsItMinable website is now at http://localhost:${port}`)
});