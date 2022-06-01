//create the reactionRouter and its endpoints
const express=require("express");
const {addReactionToPost}=require("../controllers/reaction");
const {authentication}=require("../middlewares/authentication");

const reactionRouter=express.Router();

//endpoint for POST request ==> http://localhost:5000/reaction/post/:id ==> addReactionToPost
reactionRouter.post("/post/:id",authentication,addReactionToPost);





module.exports=reactionRouter;
