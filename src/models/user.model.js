const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Please provide a valid email address"],
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        fullName: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50,
        },
        transactionPin: {
            type: String,
            select: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);