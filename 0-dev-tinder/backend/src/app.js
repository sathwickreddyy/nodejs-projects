const express = require("express");

const app = express();

app.use("/user", (req, res, next) => {
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
