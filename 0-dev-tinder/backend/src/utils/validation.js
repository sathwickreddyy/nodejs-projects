const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName || !email || !password) {
        throw new Error("firstName, lastName, email and password are required");
    }

    if(!validator.isEmail(email)) {
        throw new Error("Invalid email");
    } else if(!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password");
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "photoURL", "description", "skills", "about", "age", "gender"];
    return  Object.keys(req.body).every((key) => allowedEditFields.includes(key));
}

module.exports = {
    validateSignUpData,
    validateEditProfileData
}