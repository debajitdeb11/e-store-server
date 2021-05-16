const express = require("express");
const {
    getOrderById,
    getOrder,
    createOrder,
    getAllOrders,
    updateOrderStatus,
    getOrderStatus,
} = require("../controller/order");
const { getUserById, pushOrderInPurchaseList } = require("../controller/user");
const {
    isSignedIn,
    isAuthenticated,
    isSeller,
    isAdmin,
} = require("../controller/authentication");
const { updateStock } = require("../controller/product");
const router = express.Router();

// User param
router.param("userId", getUserById);

// Order param
router.param("orderId", getOrderById);

// Get a order
router.get("/order/:orderId", getOrder);

// create an order
router.post(
    "/order/create/:userId",
    isSignedIn,
    isAuthenticated,
    pushOrderInPurchaseList,
    updateStock,
    createOrder
);

// Get all orders
router.get(
    "/order/all/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin || isSeller,
    getAllOrders
);

// Get order status
router.get(
    "/order/:orderId/status/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    getOrderStatus
);

// Update order status
router.put(
    "/order/:orderId/status/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateOrderStatus
);

module.exports = router;
