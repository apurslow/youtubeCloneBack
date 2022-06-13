require("dotenv").config();
const connectDB = require("./startup/db");
const users = require("./routes/users");
// const posts = require("./routes/posts");
const express = require("express");
const cors = require("cors");
const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", users);
// app.use("/api/posts", posts);
app.listen(5000, ()=>{
    console.log("Sever Started Port 5000")
});