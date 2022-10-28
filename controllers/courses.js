const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

//@desc     Get All Courses
//@route    GET /api/v1/courses
//@route    GET /api/v1/bootcamps/:bootcampId/courses
//@access   Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query = req.params.bootcampId
    ? Course.find({ bootcamp: req.params.bootcampId })
    : Course.find();

  const courses = await query.populate({
    path: "bootcamp",
    select: "name description",
  });

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

//@desc     Get A Single Course
//@route    GET /api/v1/courses/:id
//@access   Private

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

//@desc     Add A Course
//@route    GET /api/v1/bootcamps/:bootcampId/courses
//@access   Private

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});
