const express = require("express");
const {userAuth} = require("../middlewares/auth");
const router = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

// Get all pending connection requests for the loggedIn user
router.get("/user/requests/received", userAuth, async (req, res) => {
    const loggedInUser = req._user;
    try {
        /**
         * 1. Filter the connection requests for this user Id as toUserId and make sure they are in interested state
         */
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl"]); // With the help of references we can select the required fields of the other collection.

        res.status(200).json({
            "message": "Connection requests fetched successfully",
            "data": connectionRequests
        })
    } catch (err) {
        console.error("Error while getting connection requests", err);
        res.status(400).send({error: err.message});
    }
})

router.get("/user/connections", userAuth, async (req, res) => {
    try{
        const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl"];
        const loggedInUser = req._user;
        /**
         * Say I am user A
         *
         * A -> B Connection Request Accepted
         * C -> A Connection Request Accepted
         *
         * Now i should have both B and C in my connections
         */
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {
                    fromUserId: loggedInUser._id,
                    status: "accepted"
                },
                {
                    toUserId: loggedInUser._id,
                    status: "accepted"
                }
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((connectionRequest) => {
            if(connectionRequest.fromUserId.toString() === loggedInUser._id.toString()) {
                return connectionRequest.toUserId;
            }
            return connectionRequest.fromUserId;
        });

        res.status(200).json({
            "message": "Connection requests fetched successfully",
            "data": data
        });
    }
    catch (err) {
        console.error("Error while getting connection requests", err);
        res.status(400).send({error: err.message});
    }
})

module.exports = router;
