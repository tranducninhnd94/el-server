var Promise = require("promise"),
	mongoose = require("mongoose"),
	User = require("../_model/user.model"),
	bcrypt = require("bcrypt-nodejs"),
	uuid = require("node-uuid");

module.exports = {
	findByEmailAndPassword: (emailReq, passwordReq) => {
		return new Promise((resolve, reject) => {
			User.findOne({
				email: emailReq
			})
			.exec((err, user) => {
				if (err) return reject(err);
				return resolve(user);
			});
		});
	},

	insertUser: userReq => {
		return new Promise((resovle, reject) => {
			let newUser = {};
			newUser = new User(userReq);
			newUser.hash_password = bcrypt.hashSync(userReq.password, bcrypt.genSaltSync(10));
			newUser.save((err, result) => {
				if (err) {
					return reject(err);
				}
				return resovle(result);
			});
		});
	},

	findByEmail: emailReq => {
		return new Promise((resolve, reject) => {
			User.findOne(
				{
					email: emailReq
				},
				(err, result) => {
					if (err) {
						return reject(err);
					}
					return resolve(result);
				}
			);
		});
	},

	updateUser: (emailReq, userReq) => {
		return new Promise((resolve, reject) => {
			User.findOneAndUpdate({ email: emailReq }, userReq, { new: true }, (err, user) => {
				if (err) {
					return reject(err);
				}
				return resolve(user);
			});
		});
	},

	findById: id => {
		return new Promise((resolve, reject) => {
			User.findOne(
				{
					_id: id
				},
				(err, result) => {
					if (err) {
						return reject(err);
					}
					return resolve(result);
				}
			);
		});
	},

	changePassword: (emailReq, newPassword) => {
		let hash_newPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
		return new Promise((resolve, reject) => {
			User.findOneAndUpdate(
				{ email: emailReq },
				{ hash_password: hash_newPassword },
				{ new: true },
				(err, user) => {
					if (err) {
						return reject(err);
					}
					return resolve(user);
				}
			);
		});
	}
};
