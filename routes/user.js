const express = require("express");
const router = express.Router();

const { getUserById, getUser, getAllUser } = require("../controller/user");
const {
    isSignedIn,
    isAuthenticated,
    isAdmin,
} = require("../controller/authentication");

// Grab a user by _id
router.param("userId", getUserById);

// Get a User
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

// Get all Users
router.get("/users", isSignedIn, isAdmin, getAllUser);

module.exports = router;
