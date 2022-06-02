const express = require("express");
const commentRouter = express.Router();

const {createComment,getCommentsByPostId,updateCommentById,deleteCommentById}= require("../controllers/comment");

const {authentication}=require("../middlewares/authentication");

//endpoint for POST request ==> http://localhost:5000/comment/post/:id==> createPost
commentRouter.post("/post/:id",authentication,createComment);

//endpoint for GET request ==> http://localhost:5000/comment/post/:id==> getCommentsByPostId
commentRouter.get("/post/:id",getCommentsByPostId);



//endpoint for PUT request ==> http://localhost:5000/comment/:id==> updateCommentById
commentRouter.put("/:id",authentication,updateCommentById);


//endpoint for DELETE request ==> http://localhost:5000/comment/:id==> deleteCommentById
commentRouter.delete("/:id",authentication,deleteCommentById);
module.exports=commentRouter;