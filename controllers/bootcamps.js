const path = require("path");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const asyncHandler = require("../middleware/async");

//@desc     Get All Bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
  res.status(201).json(res.advancedResult);
});

//@desc     Get Single Bootcamp
//@route    GET /api/v1/bootcamps/:id
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
//@route    POST /api/v1/bootcamps/:id
//@access   Private
exports.createBootCamp = asyncHandler(async (req, res, next) => {
  //Add User to body
  req.body.user = req.user.id;

  //Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with the id of ${req.user.id} has already published a bootcamp.`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);
  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }
  res.status(201).json({ success: true, data: bootcamp });
});

//@desc     Update Bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@access   Private
exports.updateBootCamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with id of ${req.params.id} is not authorized`,
        404
      )
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({ success: true, data: bootcamp });
});

//@desc     Delete Bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with id of ${req.params.id} is not authorized`,
        404
      )
    );
  }

  bootcamp.remove();
  res.status(201).json({ success: true, data: {} });
});

//@desc     Get Bootcamp within a radius
//@route    GET /api/v1/bootcamps/radius/:zipcode/:distance
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

//@desc     Upload Bootcamp Photo
//@route    PUT /api/v1/bootcamps/:id/photo
//@access   Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with id of ${req.params.id} is not authorized`,
        404
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please Upload a Photo`, 400));
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please Upload an image file`, 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please Upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse("Problem with file upload", 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, {
      photo: file.name,
    });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
