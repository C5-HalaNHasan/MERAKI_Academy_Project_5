const express = require("express");
const commentRouter = express.Router();

const {createComment,getCommentsByPostId}= require("../controllers/comment");

const {authentication}=require("../middlewares/authentication");

//endpoint for POST request ==> http://localhost:5000/comment/post/:id==> createPost
commentRouter.post("/post/:id",authentication,createComment);

//endpoint for POST request ==> http://localhost:5000/comment/post/:id==> getCommentsByPostId
commentRouter.get("/post/:id",getCommentsByPostId);


module.exports=commentRouter;