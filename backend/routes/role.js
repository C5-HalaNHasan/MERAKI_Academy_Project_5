
const express = require("express");

//controllers
const { createNewRole } = require("../controllers/role");

const roleRouter = express.Router();

roleRouter.post("/", createNewRole);

module.exports = roleRouter;