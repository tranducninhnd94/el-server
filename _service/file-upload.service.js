var mongoose = require("mongoose"),
	fileUploadSchema = require("../_model/file-upload.modal"),
	Promise = require("promise");

module.exports = {
	createFileUpload: filesUploadReq => {
		return new Promise((resovle, reject) => {
			fileUploadSchema.insertMany(filesUploadReq, (error, result) => {
				if (error) return reject(error);
				return resovle(result);
			});
		});
	},

	updateIsUser: fileNameUsed => {
		return new Promise((resolve, reject) => {
			fileUploadSchema.updateMany(
				{ originalname: { $in: fileNameUsed } },
				{ is_used: true },
				{ upsert: false },
				(error, result) => {
					if (error) return reject(error);
					return resolve(result);
				}
			)
		})
	}
};
