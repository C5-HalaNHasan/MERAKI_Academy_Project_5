//create the userRouter and its endpoints
const express = require("express");
const {
  createUser,
  loginUser,
  getAllUsers,
  updateUserProfile,
  addFriendById,
  getAllFriendsByUserId,
  removeFriendById,
  reportUserById,
  removeUserByIdAdmin,
  getReportedUsers,
  getUserById,getSuggestedUser
} = require("../controllers/user");
const { authentication } = require("../middlewares/authentication");
const { authorization } = require("../middlewares/authorization");

const userRouter = express.Router();

//endpoint for POST request ==> http://localhost:5000/user ==> createUser
userRouter.post("/", createUser);

//endpoint for POST request ==> http://localhost:5000/user/login ==>loginUser
userRouter.post("/login", loginUser);

//endpoint for GET request ==> http://localhost:5000/user ==>getAllUsers
userRouter.get("/", getAllUsers);

//endpoint for PUT request ==> http://localhost:5000/user ==>updateUserProfile
userRouter.put("/", authentication, updateUserProfile);

//endpoint for POST request ==> http://localhost:5000/user/:id ==>addFriendById
userRouter.post("/:id", authentication, addFriendById);

//endpoint for DELETE request ==> http://localhost:5000/user/:id ==>removeFriendById
userRouter.delete("/:id", authentication, removeFriendById);

//endpoint for GET request ==> http://localhost:5000/user/friends/:id ==>getAllFriendsByUserId
userRouter.get("/friends/:id", authentication, getAllFriendsByUserId);

//endpoint for PUT request ==> http://localhost:5000/user/remove/:id ==>reportUserById
userRouter.put("/remove/:id", authentication, reportUserById);

//endpoint for PUT request ==> http://localhost:5000/user/remove/:id ==>removeUserByIdAdmin
userRouter.delete(
  "/remove/:id",
  authentication,
  authorization("DELETE user"),
  removeUserByIdAdmin
);

//endpoint for GET request ==> http://localhost:5000/user/remove/==> getReportedUsers
userRouter.get("/remove", authentication, getReportedUsers);

//endpoint for GET request ==> http://localhost:5000/user/:id ==>getUserById
userRouter.get("/:id", authentication, getUserById);
//endpoint for GET request ==> http://localhost:5000/user/Friend/suggestedUser ==>getSuggestedUser
userRouter.get("/Friend/suggestedUser", authentication, getSuggestedUser);

module.exports = userRouter;
