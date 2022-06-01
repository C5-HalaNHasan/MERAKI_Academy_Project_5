const connection = require("../models/db");

// Create post function

const createPost = (req, res) => {
  const author_id = req.token.userId;
  const { postText, postImg, postVideo } = req.body;
  const query = `INSERT INTO post (postText,postImg,postVideo,author_id) VALUE (?,?,?,?)`;
  const data = [postText, postImg, postVideo, author_id];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    res.status(201).json({
      success: true,
      message: `Post created successfully`,
      result: result,
    });
  });
};

//create function to get the current user posts
const getUserPosts = (req, res) => {
  const author_id = req.token.userId;
  const query = `SELECT * FROM post WHERE author_id = ? AND isDeleted =0`;
  const data = [author_id];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    res.status(201).json({
      success: true,
      message: `All posts for userId => ${author_id}`,
      result: result,
    });
  });
};

// create function to get posts by user id

const getPostByUserId = (req, res) => {
  const author_id = req.params.id;
  const query = `SELECT * FROM post WHERE author_id=? AND isDeleted=0 `;
  const data = [author_id];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    res.status(201).json({
      success: true,
      message: `All posts for userId => ${author_id}`,
      result: result,
    });
  });

};

//creating function to get user posts then update on them using Post Id
const updatePostById = (req, res) => {
  const { postText, postImg, postVideo } = req.body;
  const id = req.params.id;
  const author_id = req.token.userId;
  const query = `SELECT * FROM post WHERE id=? AND author_id=? `;
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
        massage: `The Post: ${id} is not found`,
        error: error,
      });
    } else {
      const query = `UPDATE post SET postText=?, postImg=?, postVideo=? WHERE id=? `;
      const data = [
        postText || result[0].postText,
        postImg || result[0].postImg,
        postVideo || result[0].postVideo,
        id,
      ];
      connection.query(query, data, (err, result) => {
        if (err) {
          return res.status(404).json({
            success: false,
            massage: `Server error`,
            error: err,
          });
        }
        if (result.affectedRows != 0) {
          res.status(201).json({
            success: true,
            massage: `Post updated`,
            result: result,
          });
        }
      });
    }
  });
};

// create function to delete post using id
const deletePostById = (req, res) => {
  const id = req.params.id;
  const author_id = req.token.userId;
  const query = `UPDATE post SET isDeleted =1 WHERE author_id=? AND id=?`;
  const data = [id, author_id];
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
        massage: `The Post: ${id} is not found`,
        err: err,
      });
    }
    res.status(200).json({
      success: true,
      massage: `Succeeded to delete post with id: ${id}`,
      result: result,
    });
  });
};

//this function will update isReported to 1 if the post reported
const reportPostById = (req, res) => {
  const id = req.params.id;
  const query = `UPDATE post SET isReported=1 WHERE id=?`;
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
        massage: `Post reported`,
        result: result,
      });
    }
  });
};
// this function will remove the reported post by the admin using the id for the post
const removePostByIdAdmin = (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM post WHERE isReported = 1 AND id =?`;
  const data = [id];
  connection.query(query,data, (error, result) => {
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
        massage: `The Post: ${id} is not found`,
        error: error,
      });
    } else {
      const query = `UPDATE post SET isDeleted=1 WHERE id=?`;
      const data = [id];
      connection.query(query, data, (err, result2) => {
        if (!result2.changedRows) {
          return res.status(404).json({
            success: false,
            massage: `The Post: ${id} is not found`,
            err: err,
          });
        }
        res.status(200).json({
          success: true,
          massage: `Succeeded to delete post with id: ${id}`,
          result: result2,
        });

      });
    }
  });
};




module.exports = {
  createPost,
  getUserPosts,
  getPostByUserId,
  updatePostById,
  deletePostById,
  reportPostById,
  removePostByIdAdmin,
};

//