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

module.exports = {
    validateSignUpData
}