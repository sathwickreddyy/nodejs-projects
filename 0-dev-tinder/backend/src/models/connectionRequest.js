const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "pending", "accepted", "interested"],
            message: `{VALUE} is not a valid status`
        }
    }
}, {
    timestamps: true
});

// middle ware before save method.
connectionRequestSchema.pre("save", function (next) {
    // Check if the fromUserId is same as toUserId
    if(this.fromUserId.toString() === this.toUserId.toString()) {
        throw new Error("From user id and to user id cannot be same");
    }
    next();
})

// Creating a compound index for faster search
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;
