const express = require("express");

const app = express();

// Order of writing the routes matter in express.js
app.use("/hello", (req, res) => {
    res.send("Hello Sathwick from server");
})

app.use("/", (req, res)=>{
    res.send("Hello World")
});

app.listen(3000, () => {
    console.log("Hey Sathwick - Server started on port 3000");
});