const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
var cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
var xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
var hpp = require("hpp");
var cors = require("cors");

//Route Files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

//Load config
dotenv.config({ path: "./config/config.env" });

const app = express();

//Body Parser
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

//Connect Database
connectDB();

//Register Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//File Upload
app.use(fileupload());

//Sanitize
app.use(mongoSanitize());

//Set Security headers
app.use(helmet());

//Sanitize to prevent xss attack
app.use(xss());

//Prevent http param pollution
app.use(hpp());

//Apply the rate limiting middleware to all requests
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(limiter);

//Enable CORS
app.use(cors());

//Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

//Mount Router
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
