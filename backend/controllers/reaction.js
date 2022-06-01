const connection = require("../models/db");

const addReactionToPost = (req, res) => {
  const query = `INSERT INTO post_reaction (author_id,pots_id) VALUES (?,?)`;
  const {post_id} = req.params.id;
  const author_id=req.token.userId;
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


module.exports={
    addReactionToPost,
}