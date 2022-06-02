const connection = require("../models/db");

//function to create new comment using id for the post

const createComment = (req, res) => {
  const post_id = req.params.id;
  const author_id = req.token.userId;
  const { comment } = req.body;
  const query = `INSERT INTO comment (post_id,author_id,comment) VALUE (?,?,?)`;
  const data = [post_id, author_id, comment];
  connection.query(query, data, (error, result) => {
    if (error) {
      res.status(404).json({
        success: false,
        massage: "something went wrong while creating a new comment",
        error: error,
      });
    }
    res.status(201).json({
      success: true,
      massage: "The comment has been created successfully",
      result: result,
    });
  });
};

// create function to get all comment in the post.
const getCommentsByPostId = (req, res) => {
  const post_id = req.params.id;
  const query = `SELECT * FROM comment WHERE post_id =? AND isDeleted=0`;
  const data = [post_id];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    res.status(201).json({
      success: true,
      message: `All comment for post_id => ${post_id}`,
      result: result,
    });
  });
};

// create function to update comment
const updateCommentById = (req, res) => {
  const { comment } = req.body;
  const id = req.params.id;
  const author_id = req.token.userId;
  const query = `SELECT * FROM comment WHERE id=? AND author_id=? `;
  const data = [id, author_id];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(404).json({
        success: false,
        massage: `Server error`,
        error: error,
      });
    }
    if (!result) {
      res.status(404).json({
        success: false,
        massage: `The Comment: ${id} is not found`,
        error: error,
      });
    } else {
      const query = `UPDATE comment SET comment =? WHERE id  = ?`;
      const data = [comment, id];
      connection.query(query, data, (error2, result2) => {
        if (error2) {
          return res.status(404).json({
            success: false,
            massage: `Server error`,
            error: error2,
          });
        }
        if (result.affectedRows != 0) {
          res.status(201).json({
            success: true,
            massage: `Comment updated`,
            result: result2,
          });
        }
      });
    }
  });
};

const deleteCommentById = (req, res) => {
  const id = req.params.id;
  const author_id = req.token.userId;
  const query = `UPDATE comment SET isDeleted =1 WHERE author_id=? AND id=?`;
  const data = [author_id,id];
  connection.query(query, data, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        massage: "Server Error",
        err: err,
      });
    }
    if (!result.changedRows) {
      return res.status(404).json({
        success: false,
        massage: `The Comment: ${id} is not found`,
        err: err,
      });
    }
    res.status(200).json({
      success: true,
      massage: `Succeeded to delete comment with id: ${id}`,
      result: result,
    });
  });
};

module.exports = {
  createComment,
  getCommentsByPostId,
  updateCommentById,
  deleteCommentById
};
