const express = require("express");
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/profile/view", userAuth, async (req, res) => {
    try {
        res.send(req._user);
    }
    catch (err) {
        console.error("Error while getting profile", err);
        res.status(400).send({ error: "Error while getting profile details: "+ err.message +". Please login again" });
    }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateEditProfileData(req))
        {
            throw new Error("Invalid Edit request");
        }
        const currentUser = req._user;
        Object.keys(req.body).forEach((key) => (currentUser[key] = req.body[key]));
        await currentUser.save();
        res.send({
            "message": `${currentUser.firstName}, your profile Updated Successful`,
            "data": currentUser
        });
    }
    catch (err) {
        console.error("Error while editing profile", err);
        res.status(400).send({ error: err.message });
    }
});

router.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const currentUser = req._user;
        const {newPassword} = req.body;
        if(!validator.isStrongPassword(newPassword)) {
            throw new Error("Please enter a strong password");
        }
        const passwordHash = await bcrypt.hash(newPassword, 9);
        currentUser.password = passwordHash;
        await currentUser.save();
        res.send(`${currentUser.firstName}, your password Updated Successful`);
    }
    catch (err) {
        console.error("Error while updating Password", err);
        res.status(400).send({ error: err.message });
    }
})


module.exports = router;
