const express = require("express");
const courseRouter = require("./courses");
const router = express.Router();
const {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootCampsInRedius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

const Bootcamp = require("../models/Bootcamp");
const advancedResult = require("../middleware/advancedResult");

router
  .route("/")
  .get(advancedResult(Bootcamp, "courses"), getBootCamps)
  .post(createBootCamp);
router.route("/:id/photo").put(bootcampPhotoUpload);
router
  .route("/:id")
  .get(getBootCamp)
  .put(updateBootCamp)
  .delete(deleteBootCamp);
router.route("/radius/:zipcode/:distance").get(getBootCampsInRedius);

//Include other resource router
router.use("/:bootcampId/courses", courseRouter);

module.exports = router;
