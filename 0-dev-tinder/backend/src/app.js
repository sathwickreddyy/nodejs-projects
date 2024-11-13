const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
    res.send(["user 1", "user 2", "user 3"]);
})

app.use("/user", userAuth, (req, res, next) => {
        // Route handler
        console.log("In first handler");
        next();
    },
    (req, res) => {
        console.log("handled in the second handler");
        res.send("Hello World from second");
    })

app.listen(7777, () => {
    console.log("Hey Sathwick - Server started on port 7777");
});
