const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { validationResult } = require("express-validator");

const MAX_IMAGE_SIZE = 2097152;

exports.getProductById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: "Product not found!",
            });
        }

        req.product = product;

        next();
    });
};

exports.getProduct = (req, res) => {
    return res.status(200).json(req.product);
};

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 9;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
        .populate("category")
        .sort([[sortBy, "asc"]])
        .limit(limit)
        .exec((err, products) => {
            if (err || !products) {
                return res.status(400).json({
                    error: "Products not found!",
                });
            }

            return res.status(200).json(products);
        });
};

exports.createProduct = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            ErrorsMessage: errors.array()[0].msg,
            ErrorType: errors.array()[0].param,
        });
    }

    /* Using formidable */
    let form = new formidable.IncomingForm({
        keepExtensions: true,
    });

    form.parse(req, (error, fields, files) => {
        if (error) {
            return res.status(400).json({
                error: "Problem with Image",
            });
        }

        let product = new Product(fields);

        // Restrictions
        const { name, description, price, category, stock } = fields;

        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: "Please fill all the fields",
            });
        }

        // handle file
        if (files.photo) {
            if (files.photo.size > MAX_IMAGE_SIZE) {
                return res.status(400).json({
                    error: "Image size is too large",
                });
            }

            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.ContentType = files.photo.type;
        }

        product.save((err, product) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    error: "Unable to save product",
                });
            }

            return res.status(200).json(product);
        });
    });
};

exports.deleteProduct = (req, res) => {
    Product.findByIdAndDelete({
        _id: req.product._id,
    }).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: "Product not found",
            });
        }

        return res.status(200).json({
            message: `${product.name} is successfully deleted`,
        });
    });
};

exports.getAllUniqueCategories = (req, res) => {
    // console.log("getAllUniqueCategories");

    Product.distinct("category", {}, (err, category) => {
        if (err) {
            return res.status(400).json({
                error: "No Category found",
            });
        }

        res.json(category);
    });
};

exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map((product) => {
        return {
            updateOne: {
                filter: { _id: product._id },
                update: {
                    $inc: { stock: -product.count, sold: +product.count },
                },
            },
        };
    });

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err) {
            return res.status(400).json({
                error: "Stock updation failed!",
            });
        }

        next();
    });
};
