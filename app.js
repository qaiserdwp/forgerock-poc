const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const logger = require("morgan");
const nunjucks = require("nunjucks");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const eligibilityRouter = require("./routes/eligibility");
const profileRouter = require("./routes/profile");
const todolistRouter = require("./routes/todolist");
const duplicateRouter = require("./routes/duplicate");
const additionalInfoRouter = require("./routes/additionalinfo");
const selectMfaRouter = require("./routes/selectmfa");
const otpRouter = require("./routes/otp");
const qrCodeRouter = require("./routes/qrcode");
const authenticatorCodeRouter = require("./routes/authenticatorcode");

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
app.use("/eligibility", eligibilityRouter);
app.use("/profile", profileRouter);
app.use("/todolist", todolistRouter);
app.use("/duplicate-gateway-account", duplicateRouter);
app.use("/additional-information", additionalInfoRouter);
app.use("/select-mfa", selectMfaRouter);
app.use("/enter-otp", otpRouter);
app.use("/scan-qr-code", qrCodeRouter);
app.use("/google-authenticator-code", authenticatorCodeRouter);

module.exports = app;
