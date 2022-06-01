const express=require("express");
const postRouter = express.Router();
const {createPost}= require("../controllers/post")

const {authentication}=require("../middlewares/authentication");
//endpoint for POST request ==> http://localhost:5000/post==> createPost
postRouter.post("/",authentication,createPost);

module.exports=postRouter;