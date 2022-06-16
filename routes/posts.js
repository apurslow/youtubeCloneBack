const { Post, validatePost } = require("../models/post");
const express = require("express");
const router = express.Router();

module.exports = function (io) {


    io.on("connection", function (socket) {
        // Everytime a client logs in, display a connected message
        console.log("Server-Client Connected!");
    });

    // Get all posts/
    router.get("/", async (req, res) => {
        try {
            let response = await Post.find();
            return res.send(response);
        } catch (ex) {
            return res.status(500).send(`Internal Server Error: ${ex}`);
        }
    });

    //get all posts by videoId
    router.get("/:videoId", async (req, res) => {
        try {
            const posts = await Post.find({ videoId: req.params.videoId });
            return res.send(posts);
        } catch (ex) {
            return res.status(500).send(`Internal Server Error: ${ex}`);
        }
    });


    //for a user to create a new post
    router.post("/", async (req, res) => {
        try {
            const { error } = validatePost(req.body);
            if (error) return res.status(400).send(error.details[0].message);

            let newPost = await new Post(req.body);
            await newPost.save();
            io.emit("new-post");
            return res.status(201).send(newPost)
        } catch (ex) {
            return res.status(500).send(`Internal Server Error: ${ex}`)
        }
    });

    //for a user to update their post
    router.put("/:postId", async (req, res) => {
        try {
            const { error } = validatePost(req.body);
            if (error) return res.status(400).send(error.details[0].message);

            let post = await Post.findByIdAndUpdate(req.params.postId, req.body, { new: true });
            if (!post) return res.status(400).send(`Could not find any comments with the ID of ${req.params.postId}`)
            io.emit("updated-post");
            return res.send(post);
        } catch (ex) {
            return res.status(500).send(`Internal Server Error: ${ex}`)
        }
    });


    //for a user to delete their post
    router.delete("/:postId", async (req, res) => {
        try {
            let post = await Post.findByIdAndDelete(req.params.postId);
            if (!post) return res.status(400).send(`Could not find any comments with the ID of ${req.params.postId}`);
            io.emit("deleted-post");
            return res.send("Post Deleted");
        } catch (ex) {
            return res.status(500).send(`Internal Server Error: ${ex}`)
        }
    });
    return router;

};



