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

        const token = await jwt.sign({_id: user._id}, "Secret@Tinder$790");
        res.cookie("token", token);
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
})

app.get("/user", async (req, res)=>{
    const firstName = req.body.firstName;
    try
    {
        const users = await User.find({ firstName: firstName }).catch((err) => {
            console.error("Error while finding user", err);
        });
        if(users.length === 0){
            res.status(404).send({ error: "User not found" });
        }
        res.send(users);
    }
    catch (err) {
        console.error("Error while finding user", err);
        res.status(500).send({ error: "Error while finding user" });
    }

})

app.get("/feed", userAuth, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    }
    catch (err) {
        console.error("Error while finding users", err);
        res.status(500).send({ error: "Error while finding users" });
    }
})

app.delete("/user", userAuth ,async (req, res) => {
    try {
        const userId = req.body.userId;
        const response = await User.findByIdAndDelete({"_id": userId});
        res.send(response);
    }
    catch (err) {
        console.error("Error while deleting user", err);
        res.status(500).send({ error: "Error while deleting user" });
    }
});

app.patch("/user/:userId", userAuth,async (req, res) => {
    try {

        const ALLOWED_UPDATES = ["password", "age", "gender", "skills", "about"];
        const userId = req.params.userId;
        const user = req.body;

        const isAllowed = Object.keys(user).every((k) => ALLOWED_UPDATES.includes(k));
        if(!isAllowed) {
            throw new Error("Update not allowed."+ " Allowed updates are " + ALLOWED_UPDATES);
        }
        const response = await User.findByIdAndUpdate({"_id": userId}, user, {
            returnDocument: "after",
            runValidators: true
        })
        res.send(response);
    }
    catch (err) {
        console.error("Error while updating user", err.message);
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
