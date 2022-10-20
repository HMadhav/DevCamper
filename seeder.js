const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Bootcamp = require("./models/Bootcamp");

dotenv.config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGO_URI);

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const importBootcamps = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log("Bootcamps imported.");
    process.exit(1);
  } catch (error) {
    console.log(error);
  }
};

const deleteBootcams = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log("Bootcamps deleted.");
    process.exit(1);
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  importBootcamps();
} else if (process.argv[2] === "-d") {
  deleteBootcams();
}
