const User = require("../models/user");

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
