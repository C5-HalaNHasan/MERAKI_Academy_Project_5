const connection = require("../models/db");

// a function that sends message to a user by his id:
const sendMessageToUserById = (req, res) => {
  const sentBy = req.token.userId;
  const receivedBy = req.params.id;
  const { message } = req.body; //! if message is empty:it will be handeled in FE
  const query = `INSERT INTO message (message,sentBy,receivedBy) VALUE (?,?,?)`;
  const data = [message, sentBy, receivedBy];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    res.status(201).json({
      success: true,
      message: `message sent successfully`,
      result: result,
    });
  });
};

// a function that returns all messages received from a user by his id:
const getAllMessagesFromUserById = (req, res) => {
  const sentBy = req.token.userId;
  const receivedBy = req.params.id;
  const query = `SELECT * FROM message m INNER JOIN user u ON m.sentBy=u.id  WHERE m.receivedBy=? AND m.sentBy=? AND m.isDeleted=0 UNION SELECT * FROM message m INNER JOIN user u ON m.receivedBy=u.id WHERE m.receivedBy=? AND m.sentBy=? AND m.isDeleted=0`;
  const data = [receivedBy, sentBy, sentBy, receivedBy];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    if (result.length > 0) {
      res.status(200).json({
        success: true,
        message: `user ${receivedBy}: you have ${result.length} messages in your inbox`,
        result: result,
      });
    } else if (result.length == 0) {
      res.status(404).json({
        success: false,
        message: `no messages received from user ${receivedBy}`,
      });
    }
  });
};

// a function that returns all messages for the logged in user:
const getAllUserMessages = (req, res) => {
  const userId = req.token.userId;
  const query = `SELECT * FROM message m INNER JOIN user u ON m.sentBy=u.id WHERE m.receivedBy=? AND m.isDeleted=0 UNION SELECT * FROM message m INNER JOIN user u ON m.receivedBy=u.id WHERE m.sentBy=? AND m.isDeleted=0`;
  const data = [userId, userId];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    if (result.length > 0) {
      res.status(200).json({
        success: true,
        message: `user#${userId}: you have ${result.length} messages in your inbox`,
        result: result,
      });
    } else if (result.length == 0) {
      res.status(404).json({
        success: false,
        message: `user#${userId}: you don't have messages in your inbox,`,
      });
    }
  });
};

const removeSentMessageById = (req, res) => {
  const removedMessageId = req.params.id;
  const userId = req.token.userId;
  const query = `UPDATE message SET isDeleted=1 WHERE id=? AND sentBy=?`;
  const data = [removedMessageId, userId];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    res.status(200).json({
      success: true,
      message: "message is deleted",
    });
  });
};
module.exports = {
  getAllUserMessages,
  sendMessageToUserById,
  getAllMessagesFromUserById,
  removeSentMessageById,
};
