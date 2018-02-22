var express = require("express");
var router = express.Router();
var userController = require("../_controller/user.controller");
var reqvalid = require('./validation/req.valid');
var validation = require('express-validation');

router
    .post("/user", validation(reqvalid.userInsert), userController.createUser)
    .post("/user/login", validation(reqvalid.userLogin), userController.login);

module.exports = router;