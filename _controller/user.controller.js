var userService = require("../_service/user.service"),
	Promise = require("promise"),
	uuid = require("node-uuid"),
	standardRes = require("../common/standard.res"),
	bcrypt = require("bcrypt-nodejs");
var logger = require("../config/logger.config");
var TAG = "USER_CONTROLLER";
module.exports = {
	createUser: (req, res, next) => {
		let userReq = req.body;
		logger.log("info", TAG, "create new user : {} ", userReq);
		userService.findByEmail(userReq.email).then(
			user => {
				if (user) {
					res.status(400);
					let objectError = standardRes.objectError(400, "EMAIL_IS_USED", "this email is already in use");
					return res.json(objectError);
				}
				userReq.create_at = Date.now();
				userService.insertUser(userReq).then(
					user => {
						let userResponse = standardRes.userResponse(user);
						let objecSuccess = standardRes.objectSuccess(200, "SUCCESS", userResponse);
						res.status(200);
						return res.json(objecSuccess);
					},
					error => {
						logger.log("error", TAG, error);
						res.status(500);
						let objecError = standardRes.objectError(500, "INTERNAL_SERVER", error);
						return res.json(objecError);
					}
				);
			},
			error => {
				logger.log("error", TAG, error);
				res.status(500);
				let objecError = standardRes.objectError(500, "INTERNAL_SERVER", error);
				return res.json(objecError);
			}
		);
	},

	login: (req, res, next) => {
		let reqBody = req.body;
		let email = reqBody.email;
		let password = reqBody.password;
		logger.log('error', TAG, 'Login with info { } ', reqBody);
		userService.findByEmail(email).then(result => {
			if (result) {
				if (!bcrypt.compareSync(password, result.hash_password)) {
					res.status(400);
					let objectError = standardRes.objectError(400, 'WRONG_PASSWORD', 'Password is wrong !');
					return res.json(objectError);
				}
				res.status(200);
				let token = uuid.v4();
				let objectResponse = {
					token: token,
					infor: null
				}
				let ObjectSuccess = standardRes.objectSuccess(200, 'SUCCESS', objectResponse);
				return res.json(ObjectSuccess);
			} else {
				logger.log('error', tag, 'Email or passowrd is wrong !');
				res.status(400);
				let objectError = standardRes.objectError(400, "WRONG_EMAIL", 'Email is wrong !')
			}
		}, error => {
			logger.log("error", TAG, error);
			res.status(500);
			let objecError = standardRes.objectError(500, "INTERNAL_SERVER", error);
			return res.json(objecError);
		})

	}

};
