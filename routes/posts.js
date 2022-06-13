const { Post, validatePost} = require("../models/post");
const express = require("express");
const router = express.Router();

// Get all posts/comments
router.get("/", async (req, res) => {
    try {
      const posts = await Post.find();
      return res.send(posts);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//get all posts by videoId
router.get("/:videoId", async (req, res) => {
    try {
        const posts = await Post.find({videoId: req.params.videoId});
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
      await newPost.save()
      return  res.status(201).send(newPost)
    } catch (ex){
      return res.status(500).send(`Internal Server Error: ${ex}`)
  }
  });

//for a user to update their post
router.put("/:postId", async (req, res) => {
try {
    const { error } = validatePost(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let posts = await Post.findByIdAndUpdate(req.params.postId,req.body,{new:true});
    if(!posts) return res.status(400).send(`Could not find any comments with the ID of ${req.params.postId}`)
} catch (ex){
    return res.status(500).send(`Internal Server Error: ${ex}`)
}
});


//for a user to delete their post
router.delete("/:postId", async (req, res) => {
    try {
        let posts = await Post.findByIdAndDelete(req.params.postId);
        if(!posts) return res.status(400).send(`Could not find any comments with the ID of ${req.params.postId}`)
    } catch (ex){
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
    });


module.exports = router;


