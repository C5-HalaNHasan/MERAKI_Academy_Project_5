const connection = require("../models/db");

// a function that sends message to a user by his id:
const sendMessageToUserById = (req, res) => {
  const sentBy = req.token.userId;
  const receivedBy = req.params.id;
  const { message, room } = req.body;
  const query = `INSERT INTO message (message,room,sentBy,receivedBy) VALUE (?,?,?,?)`;
  const data = [message, room, sentBy, receivedBy];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    if (result.affectedRows) {
      const query1 = `SELECT * FROM message WHERE id=?`; //! to show the sent message
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
  // const roomId = req.params.roomId;
  const query = `SELECT m.id,m.message,m.sentBy,m.receivedBy,m.createdAt,m.isDeleted,u1.firstName,u1.profileImg,u2.firstName AS u2f,u2.profileImg AS u2Img FROM message m INNER JOIN user u1 ON m.sentBy=u1.id INNER JOIN user u2 ON m.receivedBy=u2.id WHERE (m.sentBy=? AND m.receivedBy =? AND m.isDeleted=0 ) OR(m.receivedBy=? AND m.sentBy =? AND m.isDeleted=0)  ORDER BY m.createdAt`;
  // const query = `SELECT m.id,m.message,m.sentBy,m.receivedBy,m.createdAt,m.isDeleted,u1.firstName,u1.profileImg,u2.firstName AS u2f,u2.profileImg AS u2Img FROM message m INNER JOIN user u1 ON m.sentBy=u1.id INNER JOIN user u2 ON m.receivedBy=u2.id WHERE room=? AND m.isDeleted=0 ORDER BY m.createdAt`;
  // const data = [roomId];
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
        message: `you have ${result.length} messages with this user`,
        result: result,
      });
    } else if (result.length == 0) {
      //! room is to be deleted if no messages are available
      res.status(404).json({
        success: false,
        message: `no messages in this room`,
      });
    }
  });
};

// a function that returns all messages for the logged in user: //! not used/replaced by getCurrentUserRooms
const getAllUserMessages = (req, res) => {
  const userId = req.token.userId;
  const query = `SELECT m.id, m.sentBy,m.receivedBy,u1.id,u1.profileImg,u1.firstName,u1.lastName,u2.id AS u2Id,u2.firstName AS u2f,u2.lastName AS u2l,u2.profileImg AS u2Img FROM message m  INNER JOIN user u1 ON m.sentBy=u1.id INNER JOIN user u2 ON m.receivedBy=u2.id WHERE (m.sentBy =? OR m.receivedBy =?) AND m.isDeleted=0 GROUP BY m.sentBy,m.receivedBy`;

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
//this function: creates a new room for the two users if they don't have a room OR returns their current roomId
const openRoom = (req, res) => {
  //to create new unique room between the current user and the other user by id sent by params
  //first room table is going to be checked if the two connected users have a room or not:
  //if they have: the function will return their current roomId
  //if they don't have: the function will return the created roomId
  //if there's arrom but it doesn't have any messages: the room is going to be deleted!
  const userId = req.token.userId;
  const otherUserId = req.params.id;
  const query1 = `SELECT * FROM room WHERE (sentBy=? AND receivedBy=? AND isDeleted=0) OR (sentBy=? AND receivedBy=? AND isDeleted=0) `;
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
      //!but first check if the room has messages or not: if not; then the room is going to be deleted
      const query3 = `SELECT * FROM MESSAGE WHERE room=?`;
      const data3 = [result1[0].id];
      connection.query(query3, data3, (error3, result3) => {
        if (error3) {
          return res.status(500).json({
            success: false,
            message: error3.message,
          });
        }
        if (result3.length == 0) {
          //this means that the room is empty
          const query4 = `UPDATE room SET isDeleted=1 WHERE id=?`;
          const data4 = [result1[0].id];
          connection.query(query4, data4, (error4, result4) => {
            if (error4) {
              return res.status(500).json({
                success: false,
                message: error4.message,
              });
            }
            res.status(200).json({
              success: true,
              message: `room ${result1[0].id} is deleted successfully`,
              result: result1[0].id,
            });
          });
        } else {
          res.status(200).json({
            success: true,
            message: "you already have a room!,your roomId is:",
            result: result1[0].id,
          });
        }
      }); //! end of q3
    } else {
      //! they don't have a room: another query to create a new room:
      const query2 = `INSERT INTO room (sentBy,receivedBy) VALUE (?,?)`;
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
          message: "room created successfully!,your roomId is:",
          result: result2.insertId, //! to be checked to get roomId instead of the whole result
        });
      });
    }
  });
};

// a function that returns all the rooms that the current user is engaged in:
const getCurrentUserRooms = (req, res) => {
  const userId = req.token.userId;
  query = `SELECT r.id AS roomId, r.sentBy,r.receivedBy,u1.id,u1.profileImg,u1.firstName,u1.lastName,u2.id AS u2Id,u2.firstName AS u2f,u2.lastName AS u2l,u2.profileImg AS u2Img FROM room r  INNER JOIN user u1 ON r.sentBy=u1.id INNER JOIN user u2 ON r.receivedBy=u2.id WHERE (r.sentBy =? OR r.receivedBy =? AND r.isDeleted=0)`;
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
      message: "your rooms:",
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
  openRoom,
  getCurrentUserRooms,
};
