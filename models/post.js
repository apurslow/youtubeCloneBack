const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = mongoose.Schema({
    name:{type:String, required:true, min:1, max:255},
    text:{type:String, required:true, min:1, max:255},
    videoId:{type:String, required:true},
    date:{type:Date, default:(Date.now())},
  });

function validatePost(comment){
    const schema = Joi.object({
        name:Joi.string().required(),
        text:Joi.string().required().min(1).max(255),
        videoId:Joi.string().required()
    })
    return schema.validate(comment)
}
const Post = mongoose.model("Post", postSchema);

module.exports={
    postSchema,
    Post,
    validatePost
}