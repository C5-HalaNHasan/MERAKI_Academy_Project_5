const connection = require("../models/db");


//a function that creates a reaction  for a specific post by post_id
const addReactionToPost = (req, res) => { //! user can react only one time on a post
  const query = `INSERT INTO post_reaction (author_id,post_id) VALUES (?,?)`;
  const post_id = req.params.id;
  const author_id=req.token.userId;
  const data=[author_id,post_id];
  connection.query(query, data, (error, result) => {
    if (error) {
   return res.status(500).json({
        success: false,
        massage: "server error",
        error: error,
      });
    }
    res.status(201).json({
      success: true,
      massage: "reaction created successfully",
      result: result,
    });
  });
};


//a function that gets all reactions related to a specific post by post_id 
const getAllReactionByPostId = (req, res) => {
    const query = `SELECT * FROM post_reaction WHERE post_id=?`;
    const post_id = req.params.id;
    const data=[post_id];
    connection.query(query, data, (error, result) => {
      if (error) {
     return res.status(500).json({
          success: false,
          massage: "server error",
          error: error,
        });
      }
      res.status(201).json({
        success: true,
        massage: `all reactions for post_id ${post_id}`,
        result: result,
      });
    });
  };

  //a function that removes a rection from a specific post by post_id 
const removeReactionFromPost = (req, res) => {
    // const query = `UPDATE  post_reaction SET isDeleted=1 WHERE id=? AND user_id=?`;
    // const post_id = req.params.id;
    // const data=[post_id];
    // connection.query(query, data, (error, result) => {
    //   if (error) {
    //  return res.status(500).json({
    //       success: false,
    //       massage: "server error",
    //       error: error,
    //     });
    //   }
    //   res.status(201).json({
    //     success: true,
    //     massage: `all reactions for post_id ${post_id}`,
    //     result: result,
    //   });
    // });
  };


module.exports={
    addReactionToPost,
    getAllReactionByPostId,
    removeReactionFromPost,
}