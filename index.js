
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const e = process.env;
const PRODUCTION = e.NODE_ENV === "production";
const MONGODB_URI = PRODUCTION ? e.MONGODB_URI : require("./passwords.json").MONGODB_URI;
const PORT = PRODUCTION ? e.PORT : 3000;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// add an error handler
mongoose.connection.on('error', console.error.bind(console, 'mongodb connection error:'));

const app = express();

// use sessions for tracking logins
app.use(session({
  secret: PRODUCTION ? e.SECRET_COOKIE : require("./passwords.json").SECRET_COOKIE,
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: "auto",
    maxAge: 1000 * 60 * 60 * 24 * 28
  },
  store: new MongoStore({
    mongoUrl: MONGODB_URI,
    ttl: 24 * 60 * 60, // = 24 hours, after that time - delete
  })
}));

// set locals
app.use(function (req, res, next) {
  res.locals.userId = req.session.userId;
  res.locals.admin = req.session.admin;
  next();
});

app.set('view engine', 'pug');

app.use(express.static('public'))

app.use(favicon(path.join(__dirname, 'public', 'site_icon.png')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mainRoutes = require("./routes/main_routes.js");
const instructionsRoutes = require("./routes/instructions_routes.js");
const cryptosafetyRoutes = require("./routes/cryptosafety_routes.js");
const adminRoutes = require("./routes/admin_routes");


app.use(mainRoutes);
app.use("/how-to-mine", instructionsRoutes);
app.use("/crypto-safety", cryptosafetyRoutes);
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
  res.render('error', {title: "Ошибка", error: err });
});

app.listen(PORT, () => {
  console.log(`IsItMinable website is now at http://localhost:${PORT}`)
});