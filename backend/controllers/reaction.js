const connection = require("../models/db");


//a function that creates a reaction  for a specific post by post_id
const addReactionToPost = (req, res) => { //! user can react only one time on a post
  const query = `SELECT * FROM post_reaction WHERE author_id=? AND post_id=? AND isDeleted=0`;
  const query1 = `INSERT INTO post_reaction (author_id,post_id) VALUES (?,?)`;
  const post_id = req.params.id;
  const author_id=req.token.userId;
  const data=[author_id,post_id];

  //first check if the user has previously reacted to the post:
  connection.query(query,data,(error,result)=>{
    if (error) {
      return res.status(500).json({
           success: false,
           massage: "server error",
           error: error,
         });
       };
       if(result.length=0){
         connection.query(query1, data, (error1, result1) => {
           if (error1) {
          return res.status(500).json({
               success: false,
               massage: "server error",
               error: error1,
             });
           }
           res.status(201).json({
             success: true,
             massage: "reaction created successfully",
             result: result1,
           });
         });
       }else{
        res.status(403).json({
          success: false,
          massage: "you have already reacted to this post",
        });
       }
  })
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