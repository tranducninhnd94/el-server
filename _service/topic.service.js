var Promise = require('promise');
var mongoose = require('mongoose');
var TopicSchema = require('../_model/topic.model');

module.exports = {
    insertTopic: (topic) => {
        return new Promise((resolve, reject) => {
            TopicSchema.findOneAndUpdate(
                { name: topic.name }, topic, { new: true, upsert: true }, (err, result) => {
                    if (err) return reject(err);
                    return resolve(result);
                }
            )
        })
    },

    findByName: (_name) => {
        return new Promise((resolve, reject) => {
            TopicSchema.findOne({ name: _name }, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            })
        })
    },

    findAll: () => {
        return new Promise((resolve, reject) => {
            TopicSchema.find({}, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            })
        })
    }
}