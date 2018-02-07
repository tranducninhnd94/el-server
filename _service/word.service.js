var Promise = require('promise');
var mongoose = require('mongoose');
var WordSchema = require('../_model/word.model');

module.exports = {
    insert: (word) => {
        return new Promise((resolve, reject) => {
            WordSchema.findOneAndUpdate(
                { name: word.name }, word, { new: true, upsert: true }, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                }
            )
        })
    },

    findByTopicId: (_idTopic) => {
        return new Promise((resolve, reject) => {
            WordSchema.find({ topic: _idTopic })
                .populate('topic')
                .exec((err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                })
        })

    },

    findAll: () => {
        return new Promise((resolve, reject) => {
            WordSchema.find({ topic: { $in: ['5a69fecb29425f9a75b6a126', '5a69fec729425f9a75b6a0fd'] } })
                .populate('topic')
                .exec((err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                })
        })
    },

    findByIdsTopic: arrIds => {
		return new Promise((resolve, reject) => {
			WordSchema.find({ topic: { $in: arrIds } })
				.populate("topic")
				.exec((err, result) => {
					if (err) {
						return reject(err);
					}
					return resolve(result);
				});
		});
	}

}