const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const logger = require("morgan");
const nunjucks = require("nunjucks");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: 'f85cdd6fa2',
  resave: false,
  saveUninitialized: false,
}));

app.set("views", path.join(__dirname, "views"));
nunjucks.configure(
  [
    "node_modules/govuk-frontend/",
    "node_modules/govuk-frontend/components/",
    "views"
  ],
  {
    express: app,
    autoescape: true
  }
);
app.set("view engine", "njk");

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(authRouter);

module.exports = app;
