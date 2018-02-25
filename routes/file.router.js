var express = require("express"),
	fileController = require("../_controller/file.controller"),
	fileUploadController = require("../_controller/file-upload.controller"),
	router = express.Router();

router
	.post("/file/upload", fileController.uploadFile, fileUploadController.createFileUpload)
	.get("/file/download", fileController.downloadFile);

module.exports = router;
