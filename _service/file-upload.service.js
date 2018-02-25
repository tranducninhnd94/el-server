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
	}
};
