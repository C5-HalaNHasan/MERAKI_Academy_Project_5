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

// // create function to update comment
// const updateCommentById = (req,res)=>{
    
// }

module.exports = {
  createComment,
  getCommentsByPostId,
};
