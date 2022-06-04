const connection = require("../models/db");

// a function that sends message to a user by his id:
const sendMessageToUserById= (req, res) => {
  const sentBy = req.token.userId;
const receivedBy=req.token.params;
  const { message } = req.body;
  const query = `INSERT INTO message (message,sentBy,receivedBy) VALUE (?,?,?)`;
  const data = [message,sentBy,receivedBy];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    res.status(201).json({
      success: true,
      message: `message sent successfully successfully`,
      result: result,
    });
  });
};

// a function that gets all messages received from a user by his id:
const getAllMessagesFromUserById= (req, res) => {
    const sentBy = req.token.userId;
  const receivedBy=req.token.params;
    const { message } = req.body;
    const query = `SELECT * FROM message m INNER JOIN user u ON m.sentBy=u.id WHERE m.receivedBy=? UNION SELECT * FROM message m INNER JOIN user u ON m.receivedBy=u.id WHERE m.sentBy=?`;
    const data = [sentBy,receivedBy];
    connection.query(query, data, (error, result) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
      res.status(201).json({
        success: true,
        message: `All messages received from user ${receivedBy}`,
        result: result,
      });
    });
  };

const getAllUserMessages=(req,res)=>{

};

const removeSentMessageById=(req,res)=>{

};
module.exports = {
    getAllUserMessages,
    sendMessageToUserById,
    getAllMessagesFromUserById,
    removeSentMessageById
};