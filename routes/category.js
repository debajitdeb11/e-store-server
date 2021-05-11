const express = require("express");
const {
    getCategoryById,
    getCategory,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} = require("../controller/category");
const { check } = require("express-validator");

const { getUserById } = require("../controller/user");
const {
    isSignedIn,
    isAuthenticated,
    isAdmin,
} = require("../controller/authentication");
const router = express.Router();

// get a category

// param for category
router.param("categoryId", getCategoryById);

// param for user
router.param("userId", getUserById);

// Retrive a category
router.get("/category/:categoryId", getCategory);

// Retrive all categories
router.get("/categories", getAllCategories);

// Create a category
router.post(
    "/category/create/:userId",
    [
        check("name")
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please enter a valid category name"),
    ],
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createCategory
);

// Update a category
router.put(
    "/category/update/:categoryId/:userId",
    [
        check("name")
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please enter a valid category name"),
    ],
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateCategory
);

// Delete a category
router.delete(
    "/category/:categoryId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    deleteCategory
);

module.exports = router;
