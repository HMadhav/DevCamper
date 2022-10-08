const express = require("express");
const router = express.Router();
const { getBootCamps } = require("../controllers/bootcamps");

router.route("/").get(getBootCamps);
module.exports = router;
