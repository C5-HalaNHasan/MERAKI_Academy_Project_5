//create the userRouter and its endpoints
const express=require("express");
const {createUser,loginUser,getAllUsers,updateUserProfile,addFriendById,getAllFriends,removeFriendById,reportUserById,removeUserByIdAdmin}=require("../controllers/user");
const {authentication}=require("../middlewares/authentication");
const { authorization } = require("../middlewares/authorization");

const userRouter=express.Router();

//endpoint for POST request ==> http://localhost:5000/user ==> createUser
userRouter.post("/",createUser);

//endpoint for POST request ==> http://localhost:5000/user/login ==>loginUser
userRouter.post("/login",loginUser);

//endpoint for get request ==> http://localhost:5000/user ==>getAllUsers
userRouter.get("/",getAllUsers);
//endpoint for put request ==> http://localhost:5000/user ==>updateUserProfile
 userRouter.put("/",authentication,updateUserProfile);
//endpoint for post request ==> http://localhost:5000/user/:id ==>addFriendById
userRouter.post("/:id",authentication,addFriendById);

//endpoint for delete request ==> http://localhost:5000/user/:id ==>removeFriendById
userRouter.delete("/:id",authentication,removeFriendById);

//endpoint for get request ==> http://localhost:5000/user/friends ==>getAllFriends
userRouter.get("/friends",authentication,getAllFriends);
//endpoint for put request ==> http://localhost:5000/user/remove/:id ==>reportUserById
userRouter.put("/remove/:id",authentication,reportUserById);
//endpoint for put request ==> http://localhost:5000/user/remove/:id ==>removeUserByIdAdmin
userRouter.put("/remove_1/:id",authentication,authorization('DELETE user'),removeUserByIdAdmin);


module.exports=userRouter;