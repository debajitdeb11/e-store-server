const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            maxLength: 32,
            trim: true,
        },

        lastname: {
            type: String,
            maxLength: 32,
            trim: true,
        },

        email: {
            type: String,
            unique: true,
            require: true,
            trim: true,
        },

        userinfo: {
            type: String,
            trim: true,
        },

        encrypted_password: {
            type: String,
            required: true,
        },

        salt: String,

        role: {
            type: Number,
            default: 0,
        },

        purchase: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

userSchema
    .virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = uuidv4();
        this.encrypted_password = this.securePassword(password);
    })
    .get(function () {
        return this._password;
    });

userSchema.methods = {
    securePassword: function (plainPassword) {
        if (!plainPassword) return "";

        try {
            return crypto
                .createHmac("sha256", this.salt)
                .update(plainPassword)
                .digest("hex");
        } catch (err) {
            return "";
        }
    },

    authenticate: function (plainPassword) {
        return this.securePassword(plainPassword) === this.encrypted_password;
    },
};

module.exports = mongoose.model("User", userSchema);
