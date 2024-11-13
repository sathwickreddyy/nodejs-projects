const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://sathwick:XiGLI6FAmR7LCU6k@sathwicknodepractise202.i0q7q.mongodb.net/", {
        dbName: "devtinder"
    });
}

module.exports = connectDB;
