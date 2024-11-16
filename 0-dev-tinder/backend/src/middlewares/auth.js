const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            res.status(401).send({ error: "Unauthorized, please login" });
            return;
        }
        const decodedMessage = await jwt.verify(token, "Secret@Tinder$790");

        const user = await User.findById(decodedMessage._id);
        if(!user) {
            res.status(404).send("User not found");
            return;
        }
        req._user = user;
        console.log("User", user._id ,"Authenticated!");
        next();
    }
    catch (err) {
        console.error("Error while authenticating user", err);
        res.status(400).send({ error: err.message });
    }
};

module.exports = {
    userAuth
}
