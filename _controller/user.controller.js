var userService = require("../_service/user.service"),
	postService = require("../_service/post.service"),
	Promise = require("promise"),
	uuid = require("node-uuid"),
	standardRes = require("../common/standard.res"),
	bcrypt = require("bcrypt-nodejs"),
	redisService = require("../_redis/redis.service");
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
		logger.log("info", TAG, "Login with info { } ", reqBody);
		userService.findByEmail(email).then(
			result => {
				if (result) {
					if (!bcrypt.compareSync(password, result.hash_password)) {
						res.status(400);
						let objectError = standardRes.objectError(400, "WRONG_PASSWORD", "Password is wrong !");
						return res.json(objectError);
					}
					res.status(200);
					let token = uuid.v4();
					let objectResponse = {
						token: token,
						info: null
					};
					let ObjectSuccess = standardRes.objectSuccess(200, "SUCCESS", objectResponse);
					return res.json(ObjectSuccess);
				} else {
					logger.log("error", TAG, "Email or passowrd is wrong !");
					res.status(400);
					let objectError = standardRes.objectError(400, "WRONG_EMAIL", "Email is wrong !");
				}
			},
			error => {
				logger.log("error", TAG, error);
				res.status(500);
				let objecError = standardRes.objectError(500, "INTERNAL_SERVER", error);
				return res.json(objecError);
			}
		);
	},
	loginV2: (req, res, next) => {
		let reqBody = req.body;
		let email = reqBody.email;
		let password = reqBody.password;
		logger.log("info", TAG, "Login with info { } ", reqBody);
		userService.findByEmail(email).then(
			user => {
				if (user) {
					bcrypt.compare(password, user.hash_password, (error, result) => {
						if (error) {
							logger.log("error", TAG, error);
							res.status(500);
							let objecError = standardRes.objectError(500, "INTERNAL_SERVER", error);
							return res.json(objecError);
						}

						// password is wrong
						if (!result) {
							res.status(400);
							let objectError = standardRes.objectError(400, "WRONG_PASSWORD", "Password is wrong !");
							return res.json(objectError);
						}

						// email & pass correct

						let info = standardRes.infoUserInRedis(user);
						let currentToken = user.current_token;
						// 1. check existed token
						if (currentToken) {
							// case 1 : current_token existed
							redisService.saveObjectUsingHash(currentToken, info).then(
								resultRedis => {
									res.status(200);
									let objectResponse = {
										token: currentToken,
										info: info
									};
									let ObjectSuccess = standardRes.objectSuccess(200, "SUCCESS", objectResponse);
									return res.json(ObjectSuccess);
								},
								error => {
									logger.log("error", TAG, error);
									res.status(500);
									let objecError = standardRes.objectError(500, "INTERNAL_SERVER", error);
									return res.json(objecError);
								}
							);
						} else {
							// case 2 : current_token is null or empty
							let token = uuid.v4();
							// update token-->db
							userService.updateCurrentToken(email, token).then(
								obj => {
									// update redis
									redisService.saveObjectUsingHash(token, info).then(
										resultRedis => {
											res.status(200);
											let objectResponse = {
												token: token,
												info: info
											};
											let ObjectSuccess = standardRes.objectSuccess(
												200,
												"SUCCESS",
												objectResponse
											);
											return res.json(ObjectSuccess);
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
						}
					});
				} else {
					logger.log("error", TAG, "Email or passowrd is wrong !");
					res.status(400);
					let objectError = standardRes.objectError(400, "WRONG_EMAIL", "Email is wrong !");
				}
			},
			error => {
				logger.log("error", TAG, error);
				res.status(500);
				let objecError = standardRes.objectError(500, "INTERNAL_SERVER", error);
				return res.json(objecError);
			}
		);
	},

	logout: (req, res, next) => {
		// check token in redis
		// redisService.deleteKey()
		let user = req.user;
		if (user && user.email) {
			userService.findByEmail(user.email).then(
				result => {
					if (result) {
						if (result.current_token) {
							redisService.deleteKey(result.current_token).then(
								resultRedis => {
									res.status(200);
									let objectError = standardRes.objectError(200, "Success", "Logout success");
									return res.json(objectError);
								},
								error => {
									logger.log("error", TAG, error);
									res.status(500);
									let objecError = standardRes.objectError(500, "INTERNAL_SERVER", error);
									return res.json(objecError);
								}
							);
						} else {
							let objectSuccess = standardRes.objectSuccess(200, "SUCCESS", "Account have been logout");
							res.status(200);
							return res.json(objectSuccess);
						}
					} else {
						logger.log("error", TAG, "email not exist!");
						res.status(400);
						let objectError = standardRes.objectError(400, "EMAIL_NOT_EXISTED", "Email isn't existed !");
					}
				},
				error => {
					logger.log("error", TAG, error);
					res.status(500);
					let objectError = standardRes.objectError(500, "INTERNAL_SERVER", error);
					return res.json(objectError);
				}
			);
		} else {
			logger.log("error", TAG, "User not exist!");
			res.status(400);
			let objectError = standardRes.objectError(400, "USER_NOT_EXISTED", "User isn't existed !");
			return res.json(objectError);
		}
	},

	updateListPostReadOfUser: (req, res, next) => {
		let user = req.user;
		console.log('user : ', user);
		if (user) {
			let idUser = user._id;
			let idPost = req.params.postId;
			userService.updateListPostRead(idUser, idPost).then(result => {
				next();
			}, error => {
				logger.log("error", TAG, "User not exist!");
				res.status(400);
				let objectError = standardRes.objectError(400, "USER_NOT_EXISTED", "User isn't existed !");
				return res.json(objectError);
			})
		} else {
			console.log('next : ');
			next();
		}
	},

	countPostUnread: (req, res, next) => {
		let userInfo = req.user;// get userObject from token
		if (userInfo) {
			let userId = userInfo._id;
			userService.findById(userId).then(userResult => {
				if (userResult) {
					let arrPostRead = userResult.list_posts_read ? userResult.list_posts_read : [];
					postService.countUnread(arrPostRead).then(result => {

						let objectSuccess = standardRes.objectSuccess(200, 'SUCCESS', result);
						res.status(200);
						return res.json(objectSuccess);

					}, error => {
						console.log(error);
						res.status(500);
						let objectError = standardRes.objectError(500, 'INTERNAL_SERVER', error);
						return res.json(objectError);
					})

				} else {
					let objectError = standardRes.objectError(400, 'USER_NOT_EXIST', {});
					res.status(400);
					return res.json(objectError);
				}
			}, error => {
				console.log(error);
				res.status(500);
				let objectError = standardRes.objectError(500, 'INTERNAL_SERVER', error);
				return res.json(objectError);
			})
		} else {
			res.status(403);
			let objectError = standardRes.objectError(403, 'FORBIDDEN_TO_ACCESS', null);
			return res.json(objectError);
		}
	},

	authenticate: (req, res, next) => {
		let user = req.user;
		if (user) {
			next();
		} else {
			res.status(403);
			let objectError = standardRes.objectError(403, "FORBIDDEN_TO_ACCESS", "Token expired or not exist");
			return res.json(objectError);
		}
	}
};
