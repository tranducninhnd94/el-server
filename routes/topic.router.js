var express = require('express');
var router = express.Router();
var topicController = require('../_controller/topic.controller');

router
    .post('/topic', topicController.insertTopics)
    .get('/topic/list', topicController.findAll);

module.exports = router;
