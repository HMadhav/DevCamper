const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("./async");
const User = require("../models/User");

//Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //Set Token with header
    token = req.headers.authorization.split(" ")[1];
  }
  //Set Token with cookies
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  //Make Sure Token Exists
  if (!token) {
    return next(new ErrorResponse("Not Authorized to access this route", 401));
  }

  try {
    //Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse("Not Authorized to access this route", 401));
  }
});

exports.authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
