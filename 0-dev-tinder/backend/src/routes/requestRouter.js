const express = require("express");
const {userAuth} = require("../middlewares/auth");

const router = express.Router();

router.post("/request/send/interested/:userId", userAuth, async (req, res) => {
    try {
        const currentUser = req._user;
        res.send(currentUser.firstName +" Sending Connection request to");
    }
    catch (err) {
        console.error("Error while sending connection request", err);
        res.status(400).send({ error: err.message });
    }
});

module.exports = router;
