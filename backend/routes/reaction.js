//create the reactionRouter and its endpoints
const express=require("express");
const {getAllPostsReactions,addReactionToPost,removeReactionFromPost}=require("../controllers/reaction");
const {authentication}=require("../middlewares/authentication");

const reactionRouter=express.Router();

//endpoint for GET request ==> http://localhost:5000/reaction/post ==> getAllPostsReactions
reactionRouter.get("/post",authentication,getAllPostsReactions);

//endpoint for POST request ==> http://localhost:5000/reaction/post/:id ==> addReactionToPost
reactionRouter.post("/post/:id",authentication,addReactionToPost);

//endpoint for GET request ==> http://localhost:5000/reaction/post/:id ==> removeReactionFromPost
reactionRouter.delete("/post/:id",authentication,removeReactionFromPost);





module.exports=reactionRouter;
