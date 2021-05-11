const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { body, validationResult, cookie } = require("express-validator");

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
    Product.find().exec((err, products) => {
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
