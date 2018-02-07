var topicService = require('../_service/topic.service');
var standardResponse = require('../common/standard.res');
var logger = require('../config/logger.config');
var TAG = 'TOPIC_CONTROLLER';
module.exports = {
    insertTopics: (req, res, next) => {

        let body = req.body;
        let objFail = [];
        body.forEach((topic, i) => {
            topic.create_at = Date.now();
            topicService.insertTopic(topic).then(result => {
                if (!result) {
                    objFail.push(topic);
                }
            }, error => {
                logger.log('error', TAG, error);
                let objectError = standardResponse.objectError(500, 'INTERNAL_SERVER', error);
                res.status(500);
                return res.json(objectError);
            })
        });

        if (objFail.length == 0) {
            let objectSuccess = standardResponse.objectSuccess(200, 'SUCCESS', undefined);
            res.status(200);
            return res.json(objectSuccess);
        } else {
            let objectSuccess = standardResponse.objectError(400, 'SUCCESS', objFail);
            res.status(400);
            return res.json(objectSuccess);
        }
    },

    findAll: (req, res, next) => {
        topicService.findAll().then(result => {
            let response = {};
            let arrTopic = [];
            if (result) {
                result.forEach(topic => {
                    let tmp = standardResponse.topicResponse(topic);
                    arrTopic.push(tmp);
                })
            }
            res.status(200);
            response.total = arrTopic.length;
            response.list = arrTopic;
            let objRes = standardResponse.objectSuccess(200, 'SUCCESS', response);
            return res.json(objRes);
        }, error => {
            logger.log('error', TAG, error);
            let objectError = standardResponse.objectError(500, 'INTERNAL_SERVER', error);
            res.status(500);
            return res.json(objectError);
        })
    }
}