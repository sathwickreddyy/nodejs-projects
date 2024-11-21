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
        }).populate("fromUserId", ["firstName", "lastName"]); // With the help of references we can select the required fields of the other collection.

        res.status(200).json({
            "message": "Connection requests fetched successfully",
            "data": connectionRequests
        })
    } catch (err) {
        console.error("Error while getting connection requests", err);
        res.status(400).send({error: err.message});
    }
})


/**
Output looks like below:

    {
        "message": "Connection requests fetched successfully",
        "data": [
            {
                "_id": "6739cd63a392acaa668fd7e5",
                "fromUserId": {
                    "_id": "67393eda6aa0129fb3678a61",
                    "firstName": "Sunny",
                    "lastName": "Reddy"
                },
                "toUserId": "673748d8733444aef05cef97",
                "status": "interested",
                "createdAt": "2024-11-17T11:02:59.530Z",
                "updatedAt": "2024-11-17T11:02:59.530Z",
                "__v": 0
            },
            {
                "_id": "673f518daff0894224b2907f",
                "fromUserId": {
                    "_id": "673926ec7d949ff27d7565e5",
                    "firstName": "Bunny",
                    "lastName": "Reddy"
                },
                "toUserId": "673748d8733444aef05cef97",
                "status": "interested",
                "createdAt": "2024-11-21T15:28:13.978Z",
                "updatedAt": "2024-11-21T15:28:13.978Z",
                "__v": 0
            }
        ]
    }
*/

module.exports = router;