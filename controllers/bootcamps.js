//@desc     Get All Bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootCamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
};

//@desc     Get Single Bootcamp
//@route    GET /api/v1/bootcamp/:id
//@access   Private
exports.getBootCamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Show bootcamp ${req.params.id}` });
};

//@desc     Create Bootcamp
//@route    POST /api/v1/bootcamp/:id
//@access   Private
exports.createBootCamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Create new bootcamp` });
};

//@desc     Update Bootcamp
//@route    PUT /api/v1/bootcamp/:id
//@access   Private
exports.updateBootCamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
};

//@desc     Delete Bootcamp
//@route    DELETE /api/v1/bootcamp/:id
//@access   Private
exports.deleteBootCamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};
