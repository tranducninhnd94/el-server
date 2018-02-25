var fileUploadService = require("../_service/file-upload.service");
var standardResponse = require("../common/standard.res");
var logger = require("../config/logger.config");
var TAG = "File_UPLOAD_CONTROLLER";

module.exports = {
	createFileUpload: (req, res, next) => {
		let arrFileUpload = req.body;
		logger.log("info", TAG, "create FileUpload with info {}", arrFileUpload);
		if (arrFileUpload) {
			console.log(arrFileUpload);
			fileUploadService.createFileUpload(arrFileUpload).then(
				result => {
					console.log("result : ", result);
					let response = {};
					response.total = result.length;
					response.list = result;
					res.status(200);
					let objRes = standardResponse.objectSuccess(200, "SUCCESS", response);
					return res.json(objRes);
				},
				error => {
					logger.log("error", TAG, error);
					let objectError = standardResponse.objectError(500, "INTERNAL_SERVER", error);
					res.status(500);
					return res.json(objectError);
				}
			);
		}
	}
};
