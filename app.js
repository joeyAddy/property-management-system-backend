let express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRouter = require("./router/userRouter");
const propertyRouter = require("./router/propertyRouter");
const reviewRouter = require("./router/reviewRouter");
const rentRouter = require("./router/rentRouter");
const buyOutRouter = require("./router/buyOutRouter");
const transactionRouter = require("./router/transactionRouter");
const paymentRouter = require("./router/paymentRouter");
const profileRouter = require("./router/profileRouter");
const notificationRouter = require("./router/notificationRouter");
const messagesRouter = require("./router/messagesRouter");
const cors = require("cors");

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PATCH,DELETE",
    // credentials: true,
  })
);

// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
    parameterLimit: 50000,
  })
);

app.use(bodyParser.text({ type: "/" }));

// parse application/json
app.use(bodyParser.json({ limit: "50mb" }));

// User Route
app.use("/api/user", userRouter);

// Property Route
app.use("/api/property", propertyRouter);

// Payment Route
app.use("/api/payment", paymentRouter);

// Notification Route
app.use("/api/notification", notificationRouter);

// Messages Route
app.use("/api/messages", messagesRouter);

// Rent Route
app.use("/api/rent", rentRouter);

// Transaction Route
app.use("/api/transaction", transactionRouter);

// Review Route
app.use("/api/review", reviewRouter);

// BuyOut Route
app.use("/api/buyout", buyOutRouter);

// Profile Route
app.use("/api/profile", profileRouter);

module.exports = app;
