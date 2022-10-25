const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");

//@desc     Get All Courses
//@route    GET /api/v1/courses
//@route    GET /api/v1/bootcamps/:bootcampId/courses
//@access   Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query = req.params.bootcampId
    ? Course.find({ bootcamp: req.params.bootcampId })
    : Course.find();

  const courses = await query;

  res.status(201).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});
