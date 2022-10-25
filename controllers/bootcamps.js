const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const asyncHandler = require("../middleware/async");

//@desc     Get All Bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
  let { select, sort, page, limit, ...query } = req.query;
  query = JSON.parse(
    JSON.stringify(query).replace(
      /\b(gt|lt|gte|lte|ne|in)\b/g,
      (match) => `$${match}`
    )
  );
  select = select && select.replace(/,/g, " ");
  sort = sort ? sort.replace(/,/g, " ") : "-createdAt";
  page = page ? parseInt(page.replace(/,/g, " "), 10) : 1;
  limit = limit ? parseInt(limit.replace(/,/g, " "), 10) : 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  const bootcamps = await Bootcamp.find(query, select, {
    sort,
    skip: startIndex,
    limit: limit,
  });

  res.status(201).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
    pagination,
  });
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

//@desc     Get Bootcamp within a radius
//@route    GET /api/v1/bootcamp/radius/:zipcode/:distance
//@access   Private
exports.getBootCampsInRedius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const { latitude, longitude } = loc[0];

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
