const express = require("express");
const router = express.Router();

const {
    getUserById,
    getUser,
    getAllUser,
    updateUser,
    userPurchaseList,
} = require("../controller/user");
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
router.get("/users/:userId", isSignedIn, isAuthenticated, isAdmin, getAllUser);

// update User
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

// retrives order from user account
router.get(
    "/user/:userId/orders",
    isSignedIn,
    isAuthenticated,
    userPurchaseList
);

module.exports = router;
