const mongoose = require("mongoose");

const path = require("path");

const productCartSchema = new mongoose.Schema({
    product: {
        type: mongoose.ObjectId,
        ref: "Product",
    },
    name: String,
    count: Number,
    price: Number,
});

const ProductCart = mongoose.model("ProductCart", productCartSchema);

const orderSchema = new mongoose.Schema(
    {
        products: [productCartSchema],
        transaction_id: {},
        amount: {
            type: Number,
        },
        address: {
            type: String,
        },
        updated: Date,

        status: {
            type: String,
            default: "Received",
            enum: [
                "Cancelled",
                "Delivered",
                "Shipped",
                "Processing",
                "Received",
            ],
        },

        user: {
            type: mongoose.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, ProductCart };
