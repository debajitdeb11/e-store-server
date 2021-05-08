const express = require("express");
const {
    signout,
    signup,
    signin,
    isSignedIn,
} = require("../controller/authentication");
const router = express.Router();
const { check } = require("express-validator");

/* signup route */
router.post(
    "/signup",
    [
        /* Validation Check */
        check("firstname").isLength({ min: 3 }),
        check("email").isEmail().withMessage("Please Provide a valid email"),
        check("password")
            .isLength({ min: 5 })
            .withMessage("Password is too short"),
    ],
    signup
);

/* signin route */
router.post(
    "/signin",
    [
        /* Validation Check */
        check("email").isEmail().withMessage("Please Provide a valid email"),
        check("password")
            .isLength({ min: 5 })
            .withMessage("Password is required!"),
    ],
    signin
);

// signout route
router.get("/signout", signout);

// test route
router.get("/test", isSignedIn, (req, res) => {
    res.send("This is a protected Route");
});

module.exports = router;
