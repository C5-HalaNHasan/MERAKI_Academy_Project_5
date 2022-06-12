const connection = require("../models/db");

// a function that sends message to a user by his id:
const sendMessageToUserById = (req, res) => {
  const sentBy = req.token.userId;
  const receivedBy = req.params.id;
  const { message } = req.body;
  const query = `INSERT INTO message (message,sentBy,receivedBy) VALUE (?,?,?)`;
  const data = [message, sentBy, receivedBy];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    if (result.affectedRows) {
      const query1 = `SELECT * FROM message WHERE id=?`;
      const data1 = [result.insertId];
      connection.query(query1, data1, (error1, result1) => {
        if (error1) {
          return res.status(500).json({
            success: false,
            message: error1.message,
          });
        }
        res.status(201).json({
          success: true,
          message: `message sent successfully`,
          result: result1,
        });
      });
    }
  });
};

// a function that returns all messages received from a user by his id:
const getAllMessagesFromUserById = (req, res) => {
  const sentBy = req.token.userId;
  const receivedBy = req.params.id;
  const query = `SELECT m.id,m.message,m.sentBy,m.receivedBy,m.createdAt,m.isDeleted,u1.firstName,u1.profileImg,u2.firstName AS u2f,u2.profileImg AS u2Img FROM message m INNER JOIN user u1 ON m.sentBy=u1.id INNER JOIN user u2 ON m.receivedBy=u2.id WHERE (m.sentBy=? AND m.receivedBy =? AND m.isDeleted=0) OR(m.receivedBy=? AND m.sentBy =? AND m.isDeleted=0) ORDER BY m.createdAt`;

  const data = [receivedBy, sentBy, receivedBy, sentBy];
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
        message: `user ${sentBy}: you have ${result.length} messages in your inbox`,
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
  // const query = `SELECT m.id,m.message,m.sentBy,m.receivedBy,m.createdAt,m.isDeleted FROM message m INNER JOIN user u ON m.sentBy=u.id WHERE m.receivedBy=? AND m.isDeleted=0 UNION SELECT m.id,m.message,m.sentBy,m.receivedBy,m.createdAt,m.isDeleted FROM message m INNER JOIN user u ON m.receivedBy=u.id WHERE m.sentBy=? AND m.isDeleted=0`;
  // const query = `SELECT * FROM message m INNER JOIN user u ON m.sentBy=u.id WHERE m.receivedBy=? AND m.isDeleted=0 UNION SELECT * FROM message m INNER JOIN user u ON m.receivedBy=u.id WHERE m.sentBy=? AND m.isDeleted=0`;

  const query = `SELECT m.id, m.sentBy,m.receivedBy,u1.id,u1.profileImg,u1.firstName,u1.lastName,u2.id AS u2Id,u2.firstName AS u2f,u2.lastName AS u2l,u2.profileImg AS u2Img FROM message m  INNER JOIN user u1 ON m.sentBy=u1.id INNER JOIN user u2 ON m.receivedBy=u2.id WHERE (m.sentBy =? OR m.receivedBy =?) AND m.isDeleted=0 GROUP BY m.sentBy,m.receivedBy`;
  // const query = `SELECT * FROM message m INNER JOIN user u ON m.sentBy=u.id WHERE m.receivedBy=? AND m.isDeleted=0 UNION SELECT * FROM message m INNER JOIN user u ON m.receivedBy=u.id WHERE m.sentBy=? AND m.isDeleted=0`;

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
    if (result.affectedRows) {
      const query1 = `SELECT * FROM message WHERE id=?`;
      const data1 = [removedMessageId];
      connection.query(query1, data1, (error1, result1) => {
        if (error1) {
          return res.status(500).json({
            success: false,
            message: error1.message,
          });
        }
        res.status(200).json({
          success: true,
          message: "message is deleted",
          result: result1,
        });
      });
    }
  });
};

//room functions:
//a function that creates a new room for the two users after checking that they don't have any
const createNewRoom = (req, res) => {
  //to create new unique room between the current user and the other user by id sent by params
  //first room table is going to be checked if the two connected users have a room or not:
  //if they have: the function will return their current roomId
  //if they don't have: the function will return the created roomId
  const userId = req.token.userId;
  const otherUserId = req.params.id;
  const query1 = `SELECT * FROM ROOM WHERE (sentBy=? AND receivedBy=?) OR (sentBy=? AND receivedBy=?)`;
  const data1 = [userId, otherUserId, otherUserId, userId];
  //! to be continued after creating the room schema in the database
  connection.query(query1, data1, (error1, result1) => {
    if (error1) {
      return res.status(500).json({
        success: false,
        message: error1.message,
      });
    }
    if (result1.length) {
      //! this means that they have a room,their roomId is going to be returned:
      res.status(200).json({
        success: true,
        message: "you already have a room!",
        result: result1, //! to be checked to get roomId instead of the whole result
      });
    } else {
      //! they don't have a room: another query to create a new room:
      const query2 = `SELECT * FROM ROOM WHERE sentBy=? AND receivedBy=?`;
      const data2 = [userId, otherUserId];
      connection.query(query2, data2, (error2, result2) => {
        if (error2) {
          return res.status(500).json({
            success: false,
            message: error2.message,
          });
        }
        res.status(201).json({
          success: true,
          message: "room created successfully!",
          result: result2, //! to be checked to get roomId instead of the whole result
        });
      });
    }
  });
};

// a function that returns all the rooms that the current user is engaged in:4
const getCurrentUserRooms = () => {
  const userId = req.token.userId;
  query = `SELECT * FROM room WHERE sentBy=? OR receivedBy=?`;
  const data = [userId, userId];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    res.status(200).json({
      success: true,
      message: "you  rooms:",
      result: result, //! to be checked to get roomId instead of the whole result
    });
  });
};
module.exports = {
  getAllUserMessages,
  sendMessageToUserById,
  getAllMessagesFromUserById,
  removeSentMessageById,
  //room functions:
  createNewRoom,
  getCurrentUserRooms,
};
