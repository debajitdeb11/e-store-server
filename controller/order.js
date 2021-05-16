const { Order } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
        .populate("products.product", "name price")
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({
                    error: `No order found with ${id} order id`,
                });
            }

            req.order = order;
            next();
        });
};

exports.getOrder = (req, res) => {
    return res.json(req.order);
};

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;

    const order = new Order(req.body.order);
    order.save((err, order) => {
        if (err) {
            return res.status(400).json({
                error: "Unable to place the order",
            });
        }

        res.json(order);
    });
};

exports.getAllOrders = (req, res) => {
    Order.find()
        .populate("user", "_id firstname email")
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: "Order not found",
                });
            }

            return res.status(200).json(orders);
        });
};

exports.getOrderStatus = (req, res) => {
    Order.findById(req.order._id).exec((err, order) => {
        if (err) {
            return res.status(400).json({
                error: "Order not found",
            });
        }

        return res.json(order.status);
    });
};

exports.updateOrderStatus = (req, res) => {
    Order.findByIdAndUpdate(
        { _id: req.order._id },
        { $set: { status: req.body.status } },
        { new: true, useFindAndModify: false },
        (err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "Unable to update Order status",
                });
            }

            return res.json(order);
        }
    );
};
