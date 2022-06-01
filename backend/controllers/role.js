const connection = require("../models/db");

const createNewRole = (req, res) => {
  const { role } = req.body;

  const query = `INSERT INTO role (role) VALUES (?)`;
  const data = [role];
  connection.query(query, data, (error, results) => {
    if (error) {
   return res.status(500).json({
        success: false,
        massage: "server error*",
        error: error,
      });
    }
    res.status(201).json({
      success: true,
      massage: "Success role created",
      results: results,
    });
  });
};

module.exports = {
  createNewRole,
};