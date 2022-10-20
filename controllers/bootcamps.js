const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

//@desc     Get All Bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res
    .status(201)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

//@desc     Get Single Bootcamp
//@route    GET /api/v1/bootcamp/:id
//@access   Private
exports.getBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(201).json({ success: true, data: bootcamp });
});

//@desc     Create Bootcamp
//@route    POST /api/v1/bootcamp/:id
//@access   Private
exports.createBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }
  res.status(201).json({ success: true, data: bootcamp });
});

//@desc     Update Bootcamp
//@route    PUT /api/v1/bootcamp/:id
//@access   Private
exports.updateBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(201).json({ success: true, data: bootcamp });
});

//@desc     Delete Bootcamp
//@route    DELETE /api/v1/bootcamp/:id
//@access   Private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(201).json({ success: true, data: {} });
});
