var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const nunjucks = require("nunjucks");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

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

module.exports = app;
