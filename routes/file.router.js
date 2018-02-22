var express = require('express'),
    fileController = require('../_controller/file.controller'),
    router = express.Router();

router
    .post('/file/upload', fileController.uploadFile)
    .get('/file/download', fileController.downloadFile);

module.exports = router;