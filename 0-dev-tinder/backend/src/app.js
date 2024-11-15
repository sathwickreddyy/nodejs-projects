const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    const userObj = req.body;
    // Create a new instance of user model
    const user = new User(userObj);
    await user.save().then((user) => {
        console.log("User saved successfully");
        res.send(user);
    }).catch((err) => {
        console.error("Error while saving user", err);
        res.status(500).send({ error: "Error while saving user" });
    });
});

connectDB().then(() => {
    console.log("Database connection successful");
}).catch((err) => {
    console.error("Database connection failed", err);
});

app.listen(7777, () => {
    console.log("Hey Sathwick - Server started on port 7777");
});
