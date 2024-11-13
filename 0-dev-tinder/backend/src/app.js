const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", adminAuth);

app.use("/user", (req, res) => {
    throw new Error("Null Pointer Exception");
    res.send("Hello World from Sathwick");
});

app.use("/", (err, req, res, next) => {
    if(err) {
        console.log(err.message)
        res.status(500).send({ error: "Something went wrong" });
    }
})

app.listen(7777, () => {
    console.log("Hey Sathwick - Server started on port 7777");
});
