const express = require("express");
const messageRouter = express.Router();

const {getAllUserMessages,sendMessageToUserById,getAllMessagesFromUserById,removeSentMessageById}= require("../controllers/comment");

const {authentication}=require("../middlewares/authentication");
const {authorization} = require("../middlewares/authorization")

//endpoint for GET request ==> http://localhost:5000/message==> getAllUserMessages
messageRouter.get("/",authentication,getAllUserMessages);

//endpoint for POST request ==> http://localhost:5000/messag/:id==> sendMessageToUserById
messageRouter.post("/:id",authentication,sendMessageToUserById);

//endpoint for GET request ==> http://localhost:5000/messag/:id==> getAllMessagesFromUserById
messageRouter.get("/:id",authentication,getAllMessagesFromUserById);

//endpoint for PUT request ==> http://localhost:5000/messag/:id==> removeSentMessageById
messageRouter.put("/:id",authentication,removeSentMessageById);




module.exports=messageRouter;