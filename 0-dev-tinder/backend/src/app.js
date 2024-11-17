const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require(("./routes/authRouter"));
const profileRouter = require(("./routes/profileRouter"));
const requestRouter = require(("./routes/requestRouter"));

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);


connectDB().then(() => {
    console.log("Database connection successful");
}).catch((err) => {
    console.error("Database connection failed", err);
});

app.listen(7777, () => {
    console.log("Hey Sathwick - Server started on port 7777");
});
