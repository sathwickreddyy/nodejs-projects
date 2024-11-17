const express = require("express");
const {validateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        // Validate the request body
        validateSignUpData(req);

        const { password, firstName, lastName, email } = req.body;

        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 9);

        // Create a new instance of user model
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });
        await user.save().then((user) => {
            res.send(user);
        }).catch((err) => {
            console.error("Error while saving user", err);
            res.status(400).send({ error: err.message });
        });
    }
    catch (err) {
        console.error("Error while creating user", err);
        res.status(400).send({ error: err.message });
    }
});

router.post("/login",  async(req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email: email});
        if(!user){
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await user.validatePassword(password);

        if(!isPasswordValid){
            throw new Error("Invalid Credentials");
        }

        const token = await user.getJWT();

        res.cookie("token", token, {
            expires: new Date(Date.now() + 86400000),
        });
        res.send("Login successful");
    }
    catch (err) {
        console.error("Error while logging in", err);
        res.status(400).send({ error: err.message });
    }
});

module.exports = router;

