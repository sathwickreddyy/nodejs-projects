const express = require("express");

const app = express();

app.use((req, res) => {
    res.send("Hello Sathwick from server");
})

app.listen(3000, () => {
    console.log("Hey Sathwick - Server started on port 3000");
});