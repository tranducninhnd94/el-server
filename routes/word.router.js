var express = require('express');
var router = express.Router();
var wordController = require('../_controller/word.controller');

router
    .post('/word', wordController.insertWord)
    .get('/word/:idTopic', wordController.finByTopicId)
    .get('/word/list/all', wordController.findAll)
    .post("/word/list/idtopic", wordController.findByIdsTopic);

module.exports = router;