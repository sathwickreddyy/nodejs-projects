const express = require("express");
const {userAuth} = require("../middlewares/auth");
const router = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

// Get all pending connection requests for the loggedIn user
router.get("/user/requests/received", userAuth, async (req, res) => {
    const loggedInUser = req._user;
    try{
        /**
         * 1. Filter the connection requests for this user Id as toUserId and make sure they are in interested state
         */
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        });

        res.status(200).json({
            "message": "Connection requests fetched successfully",
            "data": connectionRequests
        })
    }
    catch (err) {
        console.error("Error while getting connection requests", err);
        res.status(400).send({ error: err.message });
    }
})





module.exports = router;