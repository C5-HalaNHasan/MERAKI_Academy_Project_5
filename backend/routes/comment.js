const express = require("express");
const commentRouter = express.Router();

const {createComment,
    // getCommentsByPostId,
    getAllComments,
    updateCommentById,deleteCommentById,reportCommentById,removeCommentByIdAdmin,getReportedComments,getCommentById}= require("../controllers/comment");

const {authentication}=require("../middlewares/authentication");
const {authorization} = require("../middlewares/authorization")

//endpoint for POST request ==> http://localhost:5000/comment/post/:id==> createComment
commentRouter.post("/post/:id",authentication,createComment);

//endpoint for GET request ==> http://localhost:5000/comment/post/:id==> getCommentsByPostId
// commentRouter.get("/post/:id",getCommentsByPostId);


//endpoint for GET request ==> http://localhost:5000/comment/==> getAllComments
commentRouter.get("/",getAllComments);

//endpoint for GET request ==> http://localhost:5000/comment/id/:id==> getCommentById
commentRouter.get("/id/:id",getCommentById);

//endpoint for PUT request ==> http://localhost:5000/comment/:id==> updateCommentById
commentRouter.put("/:id",authentication,updateCommentById);


//endpoint for DELETE request ==> http://localhost:5000/comment/:id==> deleteCommentById
commentRouter.delete("/:id",authentication,deleteCommentById);

//endpoint for PUT request ==> http://localhost:5000/comment/remove/:id==> reportCommentById
commentRouter.put("/remove/:id",reportCommentById);

//endpoint for DELETE request ==> http://localhost:5000/comment/remove/:id==> removeCommentByIdAdmin
commentRouter.delete("/remove/:id",authentication,authorization("Delete_Comments"),removeCommentByIdAdmin);

//endpoint for GET request ==> http://localhost:5000/comment/remove/==> getReportedComments
commentRouter.get("/remove",authentication,authorization("Get_Reported_Comments"),getReportedComments);


module.exports=commentRouter;