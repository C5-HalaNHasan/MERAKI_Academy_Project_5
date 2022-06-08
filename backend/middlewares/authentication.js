const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  try {
    //first the token is going to be checked if it's entered or not;if not then the user can't access the api
    if (!req.headers.authorization)
      return res.status(403).json({
        message: "forbidden",
      });

    //if the user has entered the token: the token is going to be checked if it's valid or not
    const token = req.headers.authorization.split(" ").pop();
    jwt.verify(token, process.env.SECRET, (error, result) => {
      //if the token is invalid;then the user will not be able to access the api:
      if (error) {
        res.status(403).json({
          success: false,
          message: "The token is invalid or expired",
        });
      } else {
        req.token = result;
        next();
      }
    });
  } catch (error1) {
    res.status(403).json({
      message: "forbidden",
    });
  }
};

module.exports = { authentication };
