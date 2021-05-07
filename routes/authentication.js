const express = require("express");
const { signout, signup } = require("../controller/authentication");
const router = express.Router();

/* signup route */
router.post("/signup", signup);

// signout route
router.get("/signout", signout);

module.exports = router;
