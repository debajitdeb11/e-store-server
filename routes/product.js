const express = require("express");
const router = express.Router();

const {
    getAllUniqueCategories,
    getProductById,
    getProduct,
    getAllProducts,
    createProduct,
    deleteProduct,
} = require("../controller/product");
const { getCategoryById, createCategory } = require("../controller/category");
const { getUserById } = require("../controller/user");
const {
    isSignedIn,
    isAdmin,
    isAuthenticated,
} = require("../controller/authentication");
const { check } = require("express-validator");

// Product param
router.param("productId", getProductById);

// Category param
// router.param("categoryId", getCategoryById);

// User param
router.param("userId", getUserById);

// Get a product
router.get("/product/:productId", getProduct);

// Get all products
router.get("/products", getAllProducts);

// Create a product
router.post(
    "/product/create/:userId",
    [
        check("name").isEmpty().withMessage("Name cannot be empty"),
        check("description")
            .isEmpty()
            .withMessage("Description cannot be empty"),
        check("price").isEmpty().withMessage("Price cannot be empty"),
        check("category").isEmpty().withMessage("Category cannot be empty"),
        check("stock").isEmpty().withMessage("Stock cannot be empty"),
    ],
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createProduct
);

// Get all unique categories
router.get("/products/categories", getAllUniqueCategories);

// Delete a product
router.delete("/product/:productId", deleteProduct);

module.exports = router;
