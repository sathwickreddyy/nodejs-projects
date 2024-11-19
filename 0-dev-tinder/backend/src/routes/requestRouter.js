const express = require("express");
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const router = express.Router();

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req._user._id;
        const { toUserId, status } = req.params;

        const allowedStatus = ["ignored", "interested"];

        if(!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid Status Type: "+ status
            })
        }

        // check if toUserId exists
        const toUser = await User.findById(toUserId);
        if(!toUser) {
            return res.status(400).json({
                message: "Invalid User Id: "+ toUserId
            })
        }

        // check if connection request already exists
        const connectionRequestExist = await ConnectionRequest.findOne({
            $or:[
                {
                    fromUserId,
                    toUserId
                },
                {
                    fromUserId: toUserId,
                    toUserId: fromUserId
                }
            ]
        });

        if(connectionRequestExist) {
            return res.status(400).json({
                message: "Connection Request already exists"
            })
        }

        const connectionRequest = new ConnectionRequest(
            {
                fromUserId,
                toUserId,
                status
            }
        );

        const data = await connectionRequest.save();
        res.json({
            message: `${req._user.firstName} ${status} in ${toUser.firstName}`,
            data
        });
    }
    catch (err) {
        console.error("Error while sending connection request", err);
        res.status(400).send({ error: err.message });
    }
});

router.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req._user;
        const { status, requestId } = req.params;
        /**
         * 0. fetch the connection request : verify
         * 1. the toUserId should be the loggedInUser to review or accept
         * 2. update the request to status if interested : validate :status before update
         * 3. if accepted then add to connections of this user and also add to connections of the from user
         */
        const allowedStatus = ["rejected", "accepted"];
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Status not allowed: "+ status
            })
        }

        // find the connection request with the given requestId and also make sure the toUserId is the loggedInUser to review
        // and the connection request status should be interested or else that connection request can be ignored.
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });

        if(!connectionRequest) {
            return res.status(404).json({
                message: "Connection Request Id: "+ requestId+ " Not Found"
            })
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message: `Connection request updated to ${status}`,
            data
        });
    }
    catch (err) {
        console.error("Error while reviewing connection request", err);
        res.status(400).send({ error: err.message });
    }
})

module.exports = router;
