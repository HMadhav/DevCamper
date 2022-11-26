const express = require("express");
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");
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

const { protect, authorize } = require("../middleware/auth");

const Bootcamp = require("../models/Bootcamp");
const advancedResult = require("../middleware/advancedResult");

router
  .route("/")
  .get(advancedResult(Bootcamp, "courses"), getBootCamps)
  .post(protect, authorize("publisher", "admin"), createBootCamp);
router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);
router
  .route("/:id")
  .get(getBootCamp)
  .put(protect, authorize("publisher", "admin"), updateBootCamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootCamp);
router.route("/radius/:zipcode/:distance").get(getBootCampsInRedius);

//Include other resource router
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

module.exports = router;
