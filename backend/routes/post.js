const express=require("express");
const postRouter = express.Router();
const {createPost,getUserPosts}= require("../controllers/post")

const {authentication}=require("../middlewares/authentication");
//endpoint for POST request ==> http://localhost:5000/post==> createPost
postRouter.post("/",authentication,createPost);

//endpoint for GET request ==> http://localhost:5000/post==> getUserPosts
postRouter.get("/",authentication,getUserPosts);

module.exports=postRouter;