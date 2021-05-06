const mongoose = require("mongoose");
const path = require("path");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },

        price: {
            type: Number,
        },

        category: {
            type: ObjectId,
            ref: "Category",
            required: true,
        },

        stock: {
            type: Number,
        },

        sold: {
            type: Number,
            default: 0,
        },

        photo: {
            data: Buffer,
            contentType: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
