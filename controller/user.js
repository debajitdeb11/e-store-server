const User = require("../models/user");
const { Order } = require("../models/order");

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found in Database",
            });
        }

        req.profile = user;
        next();
    });
};

exports.getUser = (req, res) => {
    // TODO: Get back here for password

    const { _id, firstname, email, role, purchase } = req.profile;

    return res.json({
        id: _id,
        firstname: firstname,
        email: email,
        role: role,
        purchase: purchase,
    });
};

exports.getAllUser = (req, res) => {
    User.find().exec((err, users) => {
        if (err || !users) {
            return res.status(400).json({
                error: "No user found in the database",
            });
        }

        users.forEach((user) => {
            user.salt = undefined;
            user.encrypted_password = undefined;
        });

        return res.status(200).json(users);
    });
};

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true, useFindAndModify: false },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "Update not successful, Un-authorized!",
                });
            }

            user.salt = undefined;
            user.encrypted_password = undefined;

            return res.json(user);
        }
    );
};

exports.userPurchaseList = (req, res) => {
    Order.find({ user: req.profile._id })
        .populate("user", "_id firstname")
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "No orders found",
                });
            }

            return res.json(order);
        });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
    let purchases = [];

    req.body.order.products.forEach((product) => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transactionId,
        });
    });

    // store this into DB

    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { purchases: purchases } },
        { new: true },
        (err, purchases) => {
            if (err) {
                return res.status(400).json({
                    error: "Unable to save purchase list",
                });
            }

            next();
        }
    );
};
