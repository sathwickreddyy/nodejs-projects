const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    // Create a new instance of user model
    const user = new User(req.body);
    await user.save().then((user) => {
        console.log("User saved successfully");
        res.send(user);
    }).catch((err) => {
        console.error("Error while saving user", err);
        res.status(400).send({ error: err.message });
    });
});

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

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    }
    catch (err) {
        console.error("Error while finding users", err);
        res.status(500).send({ error: "Error while finding users" });
    }
})

app.delete("/user", async (req, res) => {
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

app.patch("/user/:userId", async (req, res) => {
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
