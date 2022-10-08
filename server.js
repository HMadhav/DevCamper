const express = require("express");
const dotenv = require("dotenv");

//Route Files
const bootcamps = require("./routes/bootcamps");

//Load config
dotenv.config({ path: "./config/config.env" });

const app = express();

//Mount Router
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5001;
app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
