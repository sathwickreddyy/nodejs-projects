const express = require("express");
const {userAuth} = require("../middlewares/auth");
const router = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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
        const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "age", "skills", "gender"];
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
});

router.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req._user;
        const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "age", "skills", "gender"];

        /**
         * Say A is loggedIn User
         *
         * Feed shouldn't have users whom A is already connected with & whom he ignored & himself & Other users who are not connected with A & if he already sent connection
         * request sent.
         *
         * Example: There are 10 existing users say names Sunny, Bunny, Rina, Jenny, Sathwick, Rithwick, Bharath, Trump, Elon, Modi
         * A new user Amit came in
         *      * Amit should see all the users except himself.
         *      * Amit should not see the users who are already connected with Amit.
         *      * Amit should not see the users who are already ignored by Amit.
         *      * Amit should not see the users who are already sent connection request to Amit.
         *      * Amit should not see the users who are already sent connection request from Amit.
         */

        const hideUsersFromFeed = new Set();

        // find all connections for all the sent and received connection requests
        const connectionRequests = await ConnectionRequest.find({
            "$or": [
                    {
                        fromUserId: loggedInUser._id
                    },
                    {
                        toUserId: loggedInUser._id
                    }
            ]
        }).select("fromUserId toUserId status");

        connectionRequests.forEach((connectionRequest) => {
            hideUsersFromFeed.add(connectionRequest.fromUserId.toString());
            hideUsersFromFeed.add(connectionRequest.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_SAFE_DATA);

        res.status(200).json({
            "message": "Feed fetched successfully",
            "data": users
        });

    }
    catch (err) {
        console.error("Error while getting feed", err);
        res.status(400).send({error: err.message});
    }
});


module.exports = router;
