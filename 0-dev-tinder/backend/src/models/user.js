const mongoose= require("mongoose");

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
        trim: true
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
    },
    photoURL: {
        type: String
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
});

const User = mongoose.model("User", userSchema);

module.exports = User;
