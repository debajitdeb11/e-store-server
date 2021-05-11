const User = require("../models/user");
const { body, validationResult, cookie } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const user = require("../models/user");

exports.signup = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            ErrorsMessage: errors.array()[0].msg,
            ErrorType: errors.array()[0].param,
        });
    }

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

exports.signin = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            ErrorsMessage: errors.array()[0].msg,
            ErrorType: errors.array()[0].param,
        });
    }

    const { email, password } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err) {
            return res.status(400).json({
                error: "Email not exist",
            });
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and Password doesn't match",
            });
        }

        // Token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
            algorithm: "HS256",
        });

        // Put Token into Cookie
        res.cookie("token", token, { expire: new Date() + 1000 });

        const { _id, name, email, role } = user;

        // Send Response to the frontend
        return res.json({
            token,
            user: {
                _id,
                name,
                email,
                role,
            },
        });
    });
};

exports.signout = (req, res) => {
    // Deleting Cookie
    res.clearCookie("token");

    return res.status(200).json({
        message: "User signout successfully",
    });
};

// Protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth",
    algorithms: ["HS256"],
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;

    // console.log("REQ PROFILE: ", req.profile._id);
    // console.log("REQ AUTH: ", req.auth._id);

    // console.log(typeof req.profile._id);
    // console.log(typeof req.auth._id);

    // console.log("Checker Status ", checker);

    if (!checker) {
        return res.status(403).json({
            error: "Not Authenticated, Access Denied!",
        });
    }

    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role != 2) {
        return res.status(403).json({
            error: "Not Admin, Access Denied!",
        });
    }

    next();
};

exports.isSeller = (req, res, next) => {
    if (req.profile.role != 1) {
        return res.status(403).json({
            error: "Not Seller, Access Denied!",
        });
    }

    next();
};
