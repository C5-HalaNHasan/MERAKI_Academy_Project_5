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
// const getUserPosts = (req, res) => {
//   const author_id = req.token.userId;
//   const query = `SELECT * FROM post WHERE author_id = ? AND isDeleted =0`;
//   const data = [author_id];
//   connection.query(query, data, (error, result) => {
//     if (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//     res.status(201).json({
//       success: true,
//       message: `All posts for userId => ${author_id}`,
//       result: result,
//     });
//   });
// };

//create function to get all posts
const getAllPosts = (req, res) => {
  const query = `SELECT * FROM post WHERE isDeleted=0`;
  connection.query(query, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    
    res.status(201).json({
      success: true,
      message: `All posts`,
      result: result,
    });
  });
};

// create function to get posts by use

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
      const query = `UPDATE post SET postText=?, postImg=? WHERE id=? ;`;
      const data = [
        postText || result[0].postText,
        postImg || result[0].postImg,
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

// this function will get all reported posts and not deleted yet
const getReportedPosts = (req, res) => {
  const query = `SELECT * FROM post WHERE isReported = 1 AND isDeleted=0`;
  connection.query(query, (error, result) => {
    if (error) {
      return res.status(404).json({
        success: false,
        massage: `Server error`,
        error: error,
      });
    }
    res.status(201).json({
      success: true,
      message: `All Reported posts`,
      result: result,
    });
  });
};

// this function will get friends posts with the logged user posts
const getFriendsPosts = (req, res) => {
  const friendshipRequest = req.token.userId;
  const query = `SELECT post.id,createdAt,post.isDeleted ,postText,postImg,postVideo,author_id,post.isPrivate,post.isReported,firstName,lastName,profileImg FROM post INNER JOIN user ON post.author_id=user.id WHERE post.author_id =? OR post.author_id IN(SELECT friendshipAccept FROM friendship  WHERE friendshipRequest=?  AND isDeleted=0) AND post.isDeleted=0  `;
  const data = [friendshipRequest, friendshipRequest];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(404).json({
        success: false,
        massage: `Server error`,
        error: error,
      });
    }
    const query2 = `SELECT comment.author_id, comment.id,createdAt,comment.isDeleted,comment,comment.post_id,comment.isReported,firstName,lastName,profileImg FROM comment INNER JOIN user ON comment.author_id=user.id WHERE comment.isDeleted=0`;
    connection.query(query2, (error, result2) => {
      
      result2.forEach((comment) => {
        result.forEach((post) => {
          if (post.id == comment.post_id) {
            if (post.comments) {
              post.comments.push(comment);
            } else {
              post.comments = [comment];
            }
          }
        });
      });
    
    res.status(200).json({
      success: true,
      massage: "All the posts",
      result: result,
    });
  });
  });
};
// this function will get friends posts
// const getFriendsPosts = (req, res) => {
//   const friendshipRequest = req.token.userId;
//   const query = `SELECT * FROM post WHERE author_id IN(SELECT friendshipAccept FROM friendship WHERE friendshipRequest=?  AND isDeleted=0)`;
//   const data = [friendshipRequest, friendshipRequest];
//   connection.query(query, data, (error, result) => {
//     if (error) {
//       return res.status(404).json({
//         success: false,
//         massage: `Server error`,
//         error: error,
//       });
//     }

//     res.status(201).json({
//       success: true,
//       message: `All friends posts`,
//       result: result,
//     });
//   });
// };

module.exports = {
  createPost,
  //   getUserPosts,
  getAllPosts,
  getPostByUserId,
  updatePostById,
  deletePostById,
  reportPostById,
  removePostByIdAdmin,
  getReportedPosts,
  getFriendsPosts,
};

//
