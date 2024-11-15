const mongoose= require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 100
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid email");
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "other"].includes(value)) {
                throw new Error("Invalid gender");
            }
        }
    },
    photoURL: {
        type: String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL");
            }
        }
    },
    description: {
        type: String
    },
    skills: {
        type: [String]
    },
    about: {
        type: String,
        default: "Please update your profile sections to show your skills and experience"
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
