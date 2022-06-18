const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const pug = require("pug");

const AppError = require("./utils/appError");

const globalErrorHandler = require("./controllers/errorController");

const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Dev loging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Set security http header
app.use(helmet());

const limiter = rateLimit({
  windowMs: 60 * 60 * 100,
  max: 100,
  message: "Too many request Please try again after an hour",
});

// Set limiter
app.use("/api", limiter);

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// Test middlewares
app.use((req, res, next) => {
  req.requestAt = Date.now();
  next();
});

app.get("/", async function (req, res, next) {
  res.redirect("/overview.html");
});

// Globals routes
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);

app.all("*", (req, res, next) => {
  return next(new AppError("Can\t find any route on this server", 404));
});

// Error Handling
app.use(globalErrorHandler);

module.exports = app;
