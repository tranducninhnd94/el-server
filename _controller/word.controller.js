var wordService = require('../_service/word.service');
var topicService = require('../_service/topic.service');
var standardResponse = require('../common/standard.res');
var logger = require('../config/logger.config');
var TAG = 'WORD_CONTROLLER';
module.exports = {
    insertWord: (req, res, next) => {

        let body = req.body;
        let nameTopic = body.nameTopic;
        let arrwords = body.words;

        topicService.findByName(nameTopic).then(topic => {
            if (topic) {
                let idTopic = topic._id;

                let objFail = [];

                arrwords.forEach(word => {
                    word.topic = idTopic;
                    wordService.insert(word).then(result => {
                        if (!result) {
                            objFail.push(word);
                        }
                    }, error => {
                        objFail.push(word);
                    })
                });
                if (objFail.length == 0) {
                    let objectSuccess = standardResponse.objectSuccess(200, 'SUCCESS', undefined);
                    res.status(200);
                    return res.json(objectSuccess);
                } else {
                    let objectSuccess = standardResponse.objectError(201, 'SUCCESS', objFail);
                    res.status(200);
                    return res.json(objectSuccess);
                }

            } else {
                let objectError = standardResponse.objectError(400, 'TOPIC_NOT_EXIST', 'topic not exist');
                res.status(400);
                return res.json(objectError);
            }

        }, error => {
            logger.log('error', TAG, error);
            let objectError = standardResponse.objectError(500, 'INTERNAL_SERVER', error);
            res.status(500);
            return res.json(objectError);
        })

    },

    finByTopicId: (req, res, next) => {


        let _idTopic = req.params.idTopic;

        logger.log('info', TAG, { path: req.originalUrl });
        wordService.findByTopicId(_idTopic).then(result => {
            let response = {};

            let arrWords = [];

            if (result) {
                result.forEach(word => {
                    let tmp = standardResponse.wordResponse(word);
                    arrWords.push(tmp);
                })
            }
   
            response.total = arrWords.length;
            response.list = arrWords;

            res.status(200);
            let objRes = standardResponse.objectSuccess(200, 'SUCCESS', response);
            return res.json(objRes);

        }, error => {
            logger.log('error', TAG, error);
            let objectError = standardResponse.objectError(500, 'INTERNAL_SERVER', error);
            res.status(500);
            return res.json(objectError);
        })
    },
    
    findAll: (req, res, next) => {
        wordService.findAll().then(result => {
            let response = {};

            let arrWords = [];

            if (result) {
                result.forEach(word => {
                    let tmp = standardResponse.wordResponse(word);
                    arrWords.push(tmp);
                })
            }

            response.total = arrWords.length;
            response.list = arrWords;

            res.status(200);
            let objRes = standardResponse.objectSuccess(200, 'SUCCESS', response);
            return res.json(objRes);
        }, error => {
            logger.log('error', TAG, error);
            let objectError = standardResponse.objectError(500, 'INTERNAL_SERVER', error);
            res.status(500);
            return res.json(objectError);
        })
    },

    findByIdsTopic: (req, res, next) => {
		let arrIds = req.body;
		console.log(arrIds);
		logger.log("info", TAG, { path: req.originalUrl, arrIds: arrIds });
		wordService.findByIdsTopic(arrIds).then(
			result => {
				let response = {};

				let arrWords = [];

				if (result) {
					result.forEach(word => {
						let tmp = standardResponse.wordResponse(word);
						arrWords.push(tmp);
					});
				}

				response.total = arrWords.length;
				response.list = arrWords;

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