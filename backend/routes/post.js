const express = require("express");
const postRouter = express.Router();
const {
  createPost,
  getAllPosts,
  getPostByUserId,
  updatePostById,
  deletePostById,
  reportPostById,
  removePostByIdAdmin,
  getReportedPosts,
  getFriendsPosts,
} = require("../controllers/post");

const { authentication } = require("../middlewares/authentication");
const { authorization } = require("../middlewares/authorization");
//endpoint for POST request ==> http://localhost:5000/post==> createPost
postRouter.post("/", authentication, createPost);

//endpoint for GET request ==> http://localhost:5000/post==> getAllPosts
postRouter.get("/", getAllPosts);

//endpoint for GET request ==> http://localhost:5000/post/user/:id==> getPostByUserId
postRouter.get("/user/:id", authentication, getPostByUserId);

//endpoint for PUT request ==> http://localhost:5000/post/:id==> updatePostById
postRouter.put("/:id", authentication, updatePostById);

//endpoint for DELETE request ==> http://localhost:5000/post/:id==> deletePostById
postRouter.delete("/:id", authentication, deletePostById);

//endpoint for PUT request ==> http://localhost:5000/post/remove/:id==> reportPostById
postRouter.put("/remove/:id", reportPostById);

//endpoint for delete request ==> http://localhost:5000/post/remove/:id==> removePostByIdAdmin
postRouter.delete(
  "/remove/:id",
  authentication,
  authorization("Delete_Post"),
  removePostByIdAdmin
);

//endpoint for GET request ==> http://localhost:5000/post/remove==> getReportedPosts
postRouter.get(
  "/remove",
  authentication,
  authorization("Get-Reported_Posts"),
  getReportedPosts
);

//endpoint for GET request ==> http://localhost:5000/post/friends==> getFriendsPosts
postRouter.get("/friends", authentication, getFriendsPosts);

module.exports = postRouter;
