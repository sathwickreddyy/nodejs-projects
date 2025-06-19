const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const paymentsRouter = require("./routes/PaymentRouter");
const port = 7777;

const app = express();
app.use(cors({
    // front end url
    // credentials : true for cookies
}));
app.use(express.json());
app.use(cookieParser());
app.use("/", paymentsRouter);

app.listen(port, () => {
    console.log("Server is running on port 7777");
});
