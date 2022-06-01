const connection=require("../models/db");
const authorization=(action)=>{
    return function (req, res, next) {
        const userId = req.token.userId;
        //user permissions based on role to be checked: if the passed action is within his permissions then he can access the api
        const query = `SELECT * FROM user  WHERE id=?`;
        const data = [userId];
        connection.query(query, data, (error, result) => {
          const query1 = `SELECT * FROM role_permission INNER JOIN permissions  ON role_permission.permission_id = permissions.id WHERE role_permission.role_id =? AND permissions.permission =?`;
          if(error){
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        };
          const data = [result[0].role_id,action];
          connection.query(query1, data, (error1, result) => {
            if(error1){
                return res.status(500).json({
                    success:false,
                    message:error1.message,
                })
            };
            //if the passed action is found to be within the user permissions(result.length !=0);then he can access the api
            if (result.length) {
              next();
            } else {
                res.status(403).json({
                    success:false,
                    message:"not authorized"
                })
            }
          });
        });
      };
}

module.exports={authorization};