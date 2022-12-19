// dependency
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
//import middlewares
const errorHandler = require("./middlewares/error.js");

// load config DB
const connectDB = require("./config/db");

//load environement variables
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

// Route files
const auth = require("./routes/auth");
const users = require("./routes/users");
const articles = require("./routes/articles");
const articleCategories = require("./routes/articleCategories");
const messages = require("./routes/message");
const collectPoints = require("./routes/collectPoints");
const collects = require("./routes/collects");
const partners = require("./routes/partners");
const plasticTypes = require("./routes/plastic_types");

// initialize express  application
const app = express();

// Body parser
app.use(express.json());


// Dev logging Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// ======================= Security ====================
// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors( {
  origin:'*'
}));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// =====================================================

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//Mount routers
app.use("/krysto/api/v2/auth", auth);
app.use("/krysto/api/v2/users", users);
app.use("/krysto/api/v2/articles", articles);
app.use("/krysto/api/v2/articleCategories", articleCategories);
app.use("/krysto/api/v2/messages", messages);
app.use("/krysto/api/v2/collectPoints", collectPoints);
app.use("/krysto/api/v2/collects", collects);
app.use("/krysto/api/v2/partners", partners);
app.use("/krysto/api/v2/plasticTypes", plasticTypes);

app.use(errorHandler);

const PORT = process.env.PORT || 5500;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT} root URL : http://localhost${PORT}/krysto/api/v2: `
      .white.underline.bold.bgGreen
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server and exit process
  server.close(() => process.exit(1));
});
