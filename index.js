require("dotenv").config();
const connectDB = require("./startup/db");

const express = require("express");
const cors = require("cors");
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server, {
        cors: {
            origin: "http://localhost:3000"
        }});

const users = require("./routes/users");
const posts = require("./routes/posts")(io);

connectDB();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", users);
app.use("/api/posts", posts);
server.listen(5000, ()=>{
    console.log("Sever Started Port 5000")
});