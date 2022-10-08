//@desc     Get All Bootcamps
//@route    GET /api/v1/bootcamps
//@access   Public
exports.getBootCamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "show all bootcamps" });
};
