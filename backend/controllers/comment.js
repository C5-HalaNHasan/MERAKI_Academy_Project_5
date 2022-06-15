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
const getCommentById = (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM comment WHERE id =? AND isDeleted=0`;
  const data = [id];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    res.status(201).json({
      success: true,
      message: ` comment for post`,
      result: result,
    });
  });
};

// function to get all comments
const getAllComments = (req, res) => {
  const query = `select post.id, COUNT(distinct post_reaction.id)
  from post
  left join post_reaction on post.id = post_reaction.post_id
   WHERE post.isDeleted=0 AND post_reaction.isDeleted=0
  group by post.id `;
  const query2 = `SELECT post.id, count(distinct comment.id) from post
  LEFT JOIN comment on post.id = comment.post_id WHERE post.isDeleted=0 AND comment.isDeleted=0 group by post.id`
  connection.query(query, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    connection.query(query2,(error2,result2)=>{
      if (error2) {
        return res.status(500).json({
          success: false,
          message: error2.message,
        });
      }
    
    res.status(201).json({
      success: true,
      message: `All comments`,
      reactionCounter: result,
      commentCounter:result2
    });
  });})
};
// const getCounterNumber=(req,res)=>{
//   const query= `SELECT COUNT(post_id) AS postCounter FROM comment WHERE isDeleted=0`
//   connection.query(query, (error, result) => {
//     if (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//     res.status(201).json({
//       success: true,
//       message: `All comments`,
//       result: result,
//     });
//   });
// }
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

// create function to delete comment using id
const deleteCommentById = (req, res) => {
  const id = req.params.id;
  const author_id = req.token.userId;
  const query = `UPDATE comment SET isDeleted =1 WHERE author_id=? AND id=?`;
  const data = [author_id, id];
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

//create function to report the comment to the admin using comment id
const reportCommentById = (req, res) => {
  const id = req.params.id;
  const query = `UPDATE comment SET isReported = 1 WHERE id = ?`;
  const data = [id];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(404).json({
        success: false,
        massage: `Server error`,
        error: err,
      });
    }
    if (result.affectedRows != 0) {
      res.status(201).json({
        success: true,
        massage: `Comment reported`,
        result: result,
      });
    }
  });
};

// this function will remove the reported comment by the admin using the id of the comment
const removeCommentByIdAdmin = (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM comment WHERE isReported=1 AND id=?`;
  const data = [id];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(404).json({
        success: false,
        massage: `Server error`,
        error: err,
      });
    }
    if (!result) {
      res.status(404).json({
        success: false,
        massage: `The Comment: ${id} is not found`,
        error: error,
      });
    } else {
      const query = `UPDATE comment SET isDeleted=1 WHERE id =?`;
      const data = [id];
      connection.query(query, data, (error2, result2) => {
        if (!result2.changedRows) {
          return res.status(404).json({
            success: false,
            massage: `The Post: ${id} is not found`,
            error: error2,
          });
        }
        res.status(200).json({
          success: true,
          massage: `Succeeded to delete comment with id: ${id}`,
          result: result2,
        });
      });
    }
  });
};

const getReportedComments = (req, res) => {
  const limit = 6;
  const page = req.query.page;
  const offset = (page-1)*limit;
  const query = `SELECT comment.id,createdAt,comment.isDeleted ,comment,author_id,comment.isReported,firstName,lastName,profileImg FROM comment INNER JOIN user ON comment.author_id=user.id  WHERE comment.isDeleted =0 AND comment.isReported =1 limit `+limit+" OFFSET " + offset;
  const query2 = `SELECT COUNT(*) FROM comment WHERE isReported =1 AND isDeleted =0`

  connection.query(query, (error, result) => {
    if (error) {
      return res.status(404).json({
        success: false,
        massage: `Server error`,
        error: error,
      });
    }
    connection.query(query2,(error2,result2)=>{
      if (error2) {
        return res.status(500).json({
          success: false,
          message: error2.message,
        });
      }
    res.status(201).json({
      success: true,
      message: `All Reported comments`,
      users_count: result2[0]["COUNT(*)"],
      result: result,
    });
  });})
};

module.exports = {
  createComment,
  getCommentById,
  getAllComments,
  updateCommentById,
  deleteCommentById,
  reportCommentById,
  removeCommentByIdAdmin,
  getReportedComments,
};
