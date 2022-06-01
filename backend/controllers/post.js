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
const getUserPosts =(req,res)=>{
    const author_id = req.token.userId;
    const query = `SELECT * FROM post WHERE author_id = ? AND isDeleted =0`;
    const data = [author_id];
    connection.query(query,data,(error,result)=>{
        if(error){
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
    })

}

// create function to get post by user id
const getPostByUserId =(req,res)=>{
   const author_id = req.params.id;

}

module.exports={
    createPost,
    getUserPosts,

}
