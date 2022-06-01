//create the reactionRouter and its endpoints
const express=require("express");
const {addReactionToPost,getAllReactionByPostId}=require("../controllers/reaction");
const {authentication}=require("../middlewares/authentication");

const reactionRouter=express.Router();

//endpoint for POST request ==> http://localhost:5000/reaction/post/:id ==> addReactionToPost
reactionRouter.post("/post/:id",authentication,addReactionToPost);

//endpoint for GET request ==> http://localhost:5000/reaction/post/:id ==> getAllReactionByPostId
reactionRouter.get("/post/:id",authentication,getAllReactionByPostId);





module.exports=reactionRouter;
