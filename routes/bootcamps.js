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
} = require("../controllers/bootcamps");

router.route("/").get(getBootCamps).post(createBootCamp);
router
  .route("/:id")
  .get(getBootCamp)
  .put(updateBootCamp)
  .delete(deleteBootCamp);
router.route("/radius/:zipcode/:distance").get(getBootCampsInRedius);

//Include other resource router
router.use("/:bootcampId/courses", courseRouter);

module.exports = router;
