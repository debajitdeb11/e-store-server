const Category = require("../models/category");
const { body, validationResult, cookie } = require("express-validator");

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: "Category not found!",
            });
        }

        req.category = category;
        next();
    });
};

exports.getCategory = (req, res) => {
    return res.status(200).json(req.category);
};

exports.getAllCategories = (req, res) => {
    Category.find().exec((err, categories) => {
        if (err || !categories) {
            return res.status(400).json({
                error: "No Category found",
            });
        }

        return res.json(categories);
    });
};

exports.createCategory = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            ErrorsMessage: errors.array()[0].msg,
            ErrorType: errors.array()[0].param,
        });
    }

    const category = new Category(req.body);

    Category.create(category, (err, category) => {
        if (err) {
            return res.status(400).json({
                error: "Unable to save category",
            });
        }

        return res.status(200).json(category);
    });
};

exports.updateCategory = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            ErrorsMessage: errors.array()[0].msg,
            ErrorType: errors.array()[0].param,
        });
    }

    Category.findOneAndUpdate(
        { _id: req.category._id },
        {
            $set: req.body,
        },
        { new: true, useFindAndModify: false },
        (err, category) => {
            if (err) {
                return res.status(400).json({
                    error: "Unable to update category",
                });
            }

            return res.status(200).json(category);
        }
    );
};

exports.deleteCategory = (req, res) => {
    Category.findByIdAndDelete({ _id: req.category._id }, (err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: "Unable to delete category",
            });
        }

        return res.status(200).json({
            message: `${category.name} Category is successfully deleted!`,
        });
    });
};
