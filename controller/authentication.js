const User = require("../models/user");

exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            console.error(err);
            return res.status(400).json({
                error: "Failed to save user in Database",
            });
        }

        return res.status(200).json({
            firstname: user.firstname,
            email: user.email,
            id: user._id,
        });
    });
};

exports.signout = (req, res) => {
    return res.status(200).json({
        message: "User signout",
    });
};
