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
        const toUserExists = await User.findById(toUserId);
        if(!toUserExists) {
            return res.status(400).json({
                message: "Invalid User Id: "+ toUserId
            })
        }

        // user can't send request to himself
        if(fromUserId.equals(toUserId)) {
            return res.status(400).json({
                message: "Invalid Request: You can't send request to yourself"
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
            message: "Connection Request Sent Successfully",
            data
        });
    }
    catch (err) {
        console.error("Error while sending connection request", err);
        res.status(400).send({ error: err.message });
    }
});

module.exports = router;
