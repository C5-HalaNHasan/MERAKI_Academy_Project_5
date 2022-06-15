const connection = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// a function to add a new user to the data base
const createUser = async (req, res) => {
  //user data is collected then the password is hashed before being saved in the database
  const {
    firstName,
    lastName,
    email,
    password,
    birthday,
    country,
    gender,
    profileImg,
    role_id
  } = req.body;
  const query = `INSERT INTO user(firstName,lastName,email,password,birthday,country,gender,profileImg,role_id) VALUES(?,?,?,?,?,?,?,?,?)`;
  const SALT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT);
  const data = [
    firstName,
    lastName,
    email,
    hashedPassword,
    birthday,
    country,
    gender,
    profileImg,
    role_id
  ];
  //before registration: the entered email is going to be checked if it exists in the dataBase or not:
  const query1 = `SELECT * FROM user WHERE email=?`;
  const data1 = [email];
  connection.query(query1, data1, (error1, result1) => {
    if (error1) {
      return res.status(500).json({
        success: false,
        message: error1.message
      });
    }
    //if the result is an empty array then the email doesn't ecist in the data base
    if (!result1.length) {
      //create new connection to register the user:
      connection.query(query, data, (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: error.message
          });
        }
        res.status(201).json({
          success: true,
          message: `user created successfully`,
          result: result
        });
      });
    } else {
      //the entered email exists in the dataBase:
      res.status(406).json({
        success: false,
        message: `this email exists in the dataBase`
      });
    }
  });
};

// a function that logins the user by email & password
const loginUser = (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM user WHERE email=?`;
  const data = [email, password];
  //first the user email is checked if it's in the dataBase,
  //if it's in the database: the password is checked if it matches with the one saved in the database
  //if the password is correct: token is created and sent as a response to the user
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    //if the email exists then result.length>0:
    if (result.length > 0) {
      //the password is checked:
      bcrypt.compare(password, result[0].password, (error1, result1) => {
        if (error1) {
          return res.status(500).json({
            success: false,
            message: error1.message
          });
        }
        if (result1) {
          const payload = {
            userId: result[0].id,
            role_id: result[0].role_id
          };
          const options = {
            expiresIn: "700m" //! to be updated later
          };
          const secret = process.env.SECRET;
          const token = jwt.sign(payload, secret, options);
          res
            .status(200)
            .json({ token: token, userId: result[0].id, userInfo: result[0] });
        } else {
          res.status(403).json({
            success: false,
            message: "Incorrect password"
          });
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "This email doesn't exist in the dataBase"
      });
    }
  });
};
// a function that gets all users
const getAllUsers = (req, res) => {
  const query = `SELECT * FROM USER WHERE role_id=1 AND isDeleted=0`;
  connection.query(query, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: `No Users Found`
      });
    } else {
      res.status(200).json({
        success: true,
        message: `all users:${result.length} users`,
        result
      });
    }
  });
};

//
const getAllUsersPag = (req, res) => {
  const limit = 6;
  const page = req.query.page;
  const offset = (page - 1) * limit;
  const query =
    "SELECT * FROM USER WHERE role_id=1 AND isDeleted=0 limit " +
    limit +
    " OFFSET " +
    offset;
  const query2 = `SELECT COUNT(*) FROM user WHERE role_id=1 AND isDeleted =0`;
  connection.query(query, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
    connection.query(query2, (error2, result2) => {
      if (error2) {
        return res.status(500).json({
          success: false,
          message: error2.message
        });
      }

      if (!result.length) {
        return res.status(404).json({
          success: false,
          message: `No Users Found`
        });
      } else {
        res.status(200).json({
          success: true,
          message: `all users:${result.length} users`,
          users_count: result2[0]["COUNT(*)"],
          page_number: page,
          result: result
        });
      }
    });
  });
};
// a function that updates User Profile
const updateUserProfile = async (req, res) => {
  const {
    firstName,
    lastName,
    password,
    birthday,
    country,
    profileImg,
    coverImg,
    isPrivate
  } = req.body;
  const id = req.token.userId;
  const SALT = 10;
  // let hashedPassword = await bcrypt.hash(password, SALT);
  let hashedPassword;
  bcrypt.hash(password, SALT, (err, hashed) => {
    hashedPassword = hashed;
  });
  const query = `UPDATE user SET firstName=COALESCE(?,firstName),lastName=COALESCE(?,lastName),password=COALESCE(?,password),birthday=COALESCE(?,birthday),country=COALESCE(?,country),profileImg=COALESCE(?,profileImg),coverImg=COALESCE(?,coverImg),isPrivate=COALESCE(?,isPrivate) WHERE id=?`;
  const data = [
    firstName,
    lastName,
    hashedPassword,
    birthday,
    country,
    profileImg,
    coverImg,
    isPrivate,
    id
  ];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    if (result.affectedRows) {
      //another query to get the user updated info to be set in the bckend
      const quer1 = `SELECT * FROM user WHERE id=?`;
      const data1 = [id];
      connection.query(quer1, data1, (error1, result1) => {
        if (error1) {
        }
        res.status(200).json({
          success: true,
          result: result1
        });
      });
    }
  });
};
//___ a function to add a new friend to the data base________
const addFriendById = (req, res) => {
  const friendshipRequest = req.token.userId;
  const friendshipAccept = req.params.id;
  // first user is going to be checked if friend with the request or not:
  const query = `SELECT * FROM friendship WHERE friendshipRequest=? AND friendshipAccept=? AND isDeleted=0 OR friendshipRequest=? AND friendshipAccept=? AND isDeleted=0 `;
  const data = [
    friendshipRequest,
    friendshipAccept,
    friendshipAccept,
    friendshipRequest
  ];
  connection.query(query, data, (error, result) => {
    console.log(result);
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
    if (result.length == 0) {
      const query1 = `INSERT INTO friendship(friendshipRequest,friendshipAccept) VALUES(?,?)`;
      const data1 = [friendshipRequest, friendshipAccept];
      connection.query(query1, data1, (error1, result1) => {
        if (error1) {
          return res.status(500).json({
            success: false,
            message: error1.message
          });
        }
        if (result1.affectedRows == 1) {
          const query2 = `SELECT * FROM user WHERE id=?`;
          const data2 = [friendshipAccept];
          connection.query(query2, data2, (error2, result2) => {
            if (error2) {
              return res.status(500).json({
                success: false,
                message: error2.message
              });
            }
            res.status(201).json({
              success: true,
              message: `friend added successfully`,
              result: result2
            });
          });
        } else {
          res.status(400).json({
            success: false,
            message: `Request can't be sent`
          });
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: `user ${friendshipAccept} is already in your friendlist`
      });
    }
  });
};

// ______this function to removeFriendById__________
const removeFriendById = (req, res) => {
  const friendshipAccept = req.params.id;
  const friendshipRequest = req.token.userId;
  const query = `UPDATE friendship SET isDELETED=1 WHERE friendshipAccept=? AND friendshipRequest=? OR friendshipAccept=? AND friendshipRequest=? `;
  const data = [
    friendshipAccept,
    friendshipRequest,
    friendshipRequest,
    friendshipAccept
  ];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    if (result.affectedRows == 1) {
      //to return deleted user to be used in the frontend
      const query1 = `SELECT * FROM user WHERE id=? `;
      const data1 = [friendshipAccept];
      connection.query(query1, data1, (error1, result1) => {
        if (error1) {
          return res
            .status(500)
            .json({ success: false, message: error1.message });
        }
        res.status(200).json({
          success: true,
          message: `friend ${friendshipAccept} has been deleted successfully`,
          result: result1
        });
      });
    } else {
      res.status(404).json({
        success: false,
        message: `friend ${friendshipAccept} is not in your friendlist`
      });
    }
  });
};

// ________ this function to get all friends ____________
const getAllFriendsByUserId = (req, res) => {
  const friendshipRequest = req.params.id;
  const friendshipAccept = friendshipRequest;
  // const query = `SELECT * FROM user u INNER JOIN friendship f ON  f.friendshipAccept=u.id WHERE f.friendshipRequest=?`;
  const query = `SELECT u.id,u.firstName,u.lastName,u.email,u.country,u.gender,u.profileImg,u.coverImg,u.isPrivate,u.isReported,u.isDeleted,u.role_id FROM user u INNER JOIN friendship f ON f.friendshipAccept=u.id WHERE f.friendshipRequest=? AND f.isDeleted=0 UNION SELECT u.id,u.firstName,u.lastName,u.email,u.country,u.gender,u.profileImg,u.coverImg,u.isPrivate,u.isReported,u.isDeleted,u.role_id FROM user u INNER JOIN friendship f ON f.friendshipRequest=u.id WHERE f.friendshipAccept=? AND f.isDeleted=0 `;
  const data = [friendshipRequest, friendshipAccept];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    //to remove duplicates:
    // const result2=result.filter((elem,index)=>{
    //   return elem.id!=friendshipAccept;
    // });
    res.status(200).json({
      success: true,
      message: `All Friends for userId ${friendshipRequest},£of friends is ${result.length}`,
      result: result
    });
  });
};

//a function that reports a user by id
const reportUserById = (req, res) => {
  // const userId = req.token.userId;
  const id = req.params.id;
  const query = `UPDATE user SET isReported=1 WHERE id=? `;
  const data = [id];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
    res
      .status(200)
      .json({ success: true, message: "User is reported", result });
  });
};

//a function that removes a reported user by id by Admin only
const removeUserByIdAdmin = (req, res) => {
  const id = req.params.id;
  const userId = req.token.userId;
  const query = `UPDATE user set isDeleted=1 WHERE id=? `;
  const data = [id, userId];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({});
    }
    res.status(200).json({
      success: true,
      message: `The reported user is deleted`,
      result
    });
  });
};

//a function that returns all reported users
const getReportedUsers = (req, res) => {
  const limit = 6;
  const page = req.query.page;
  const offset = (page - 1) * limit;
  const query =
    `SELECT * FROM user WHERE isDeleted =0 AND isReported =1  limit ` +
    limit +
    " OFFSET " +
    offset;
  const query2 = `SELECT COUNT(*) FROM user WHERE isReported =1 AND isDeleted =0`;
  connection.query(query, (error, result) => {
    if (error) {
      return res.status(404).json({
        success: false,
        massage: `Server error`,
        error: error
      });
    }
    connection.query(query2, (error2, result2) => {
      if (error2) {
        return res.status(500).json({
          success: false,
          message: error2.message
        });
      }
      res.status(201).json({
        success: true,
        message: `All Reported users`,
        users_count: result2[0]["COUNT(*)"],

        page_number: page,
        result: result
      });
    });
  });
};

// a function that returns user by id
const getUserById = (req, res) => {
  const userId = req.params.id;
  const query = `SELECT * FROM USER WHERE role_id =1 AND isDeleted=0 AND id=?`;
  const data = [userId];
  connection.query(query, data, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: `No Users Found`
      });
    } else {
      res.status(200).json({
        success: true,
        message: `user ${userId} info`,
        result
      });
    }
  });
};
const getSuggestedUser = (req, res) => {
  const userId = req.token.userId;
  console.log(userId);
  const query = ` SELECT * FROM user WHERE id NOT IN(SELECT friendshipAccept FROM friendship) AND id NOT IN(SELECT friendshipRequest FROM friendship)`;

//   SELECT id FROM user WHERE id NOT IN(SELECT friendshipAccept FROM friendship) -> 100%

  const data = [userId, userId, userId];
  connection.query(query, data, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({error});
    }
    res
      .status(200)
      .json({ success: true, message: `suggested friends `, result });
  });
};
const usersBirthday =(req,res)=>{
const query =`SELECT  COUNT(*),YEAR(birthday) FROM user GROUP BY YEAR(birthday)
`
connection.query(query, (error, result) => {
  if (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
  res.status(200).json({
    success: true,
    
    result: result
  });
});

}
const usersGender =(req,res)=>{
  const query = `SELECT gender,

  COUNT(CASE WHEN gender="0" THEN 1  END) As count,
  
  COUNT(CASE WHEN gender="1" THEN 1  END) As count,
  
  COUNT(*) as Total

  FROM user WHERE isDeleted=0 group by gender `
  connection.query(query, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
   
    delete result[0].count 
    delete result[1].count 
    result[0].gender=2
    result[1].gender=1



    res.status(200).json({
      success: true,
      
      result: result
    });
  });
}
module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  updateUserProfile,
  addFriendById,
  getAllFriendsByUserId,
  removeFriendById,
  reportUserById,
  removeUserByIdAdmin,
  getReportedUsers,
  getUserById,
  getSuggestedUser,
  getAllUsersPag,
  usersBirthday,
  usersGender
};
