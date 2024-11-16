const express = require("express");
const connectDB = require("./config/database");
const { validateSignUpData } = require("./utils/validation");
const User = require("./models/user");
const bcrpt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    try {
        // Validate the request body
        validateSignUpData(req);

        const { password, firstName, lastName, email } = req.body;

        // Encrypt the password
        const passwordHash = await bcrpt.hash(password, 9);

        // Create a new instance of user model
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });
        await user.save().then((user) => {
            res.send(user);
        }).catch((err) => {
            console.error("Error while saving user", err);
            res.status(400).send({ error: err.message });
        });
    }
    catch (err) {
        console.error("Error while creating user", err);
        res.status(400).send({ error: err.message });
    }
});

app.post("/login",  async(req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email: email});
        if(!user){
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await bcrpt.compare(password, user.password);

        if(!isPasswordValid){
            throw new Error("Invalid Credentials");
        }

        const token = await jwt.sign({_id: user._id}, "Secret@Tinder$790", {
            expiresIn: "1d"
        });
        res.cookie("token", token, {
            expires: new Date(Date.now() + 86400000),
        });
        res.send("Login successful");
    }
    catch (err) {
        console.error("Error while logging in", err);
        res.status(400).send({ error: err.message });
    }
})

app.get("/profile", userAuth, async (req, res) => {
    try {
        res.send(req._user);
    }
    catch (err) {
        console.error("Error while getting profile", err);
        res.status(400).send({ error: "Error while getting profile details: "+ err.message +". Please login again" });
    }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        const user = req._user;
        res.send(user.firstName +" Sending Connection request to");
    }
    catch (err) {
        console.error("Error while sending connection request", err);
        res.status(400).send({ error: err.message });
    }
})

connectDB().then(() => {
    console.log("Database connection successful");
}).catch((err) => {
    console.error("Database connection failed", err);
});

app.listen(7777, () => {
    console.log("Hey Sathwick - Server started on port 7777");
});
