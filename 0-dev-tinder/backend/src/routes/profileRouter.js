const express = require("express");
const {userAuth} = require("../middlewares/auth");

const router = express.Router();

router.get("/profile", userAuth, async (req, res) => {
    try {
        res.send(req._user);
    }
    catch (err) {
        console.error("Error while getting profile", err);
        res.status(400).send({ error: "Error while getting profile details: "+ err.message +". Please login again" });
    }
});

module.exports = router;
