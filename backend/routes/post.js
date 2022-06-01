const express=require("express");
const postRouter = express.Router();
const {createPost,getUserPosts,getPostByUserId,updatePostById}= require("../controllers/post")

const {authentication}=require("../middlewares/authentication");
//endpoint for POST request ==> http://localhost:5000/post==> createPost
postRouter.post("/",authentication,createPost);

//endpoint for GET request ==> http://localhost:5000/post==> getUserPosts
postRouter.get("/",authentication,getUserPosts);

//endpoint for GET request ==> http://localhost:5000/post/user/:id==> getPostByUserId
postRouter.get("/user/:id",getPostByUserId);

//endpoint for PUT request ==> http://localhost:5000/post/:id==> getPostByUserId
postRouter.put("/:id",authentication,updatePostById);

module.exports=postRouter;