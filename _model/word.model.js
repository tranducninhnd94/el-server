var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Topic = require('./topic.model');

var WordSchema = new Schema({

    topic: {
        type: Schema.Types.ObjectId, ref: 'Topic', required: true
    },
    image_url: {
        type: String
    },
    audio: {
        audio_url: {
            type: String
        },
        audio_type: {
            type: String
        }
    },
    name: {
        type: String,
        require
    },
    pronunciation: {
        type: String
    },
    explanation: {
        type: String
    },
    vocabulary: {
        type: String
    },
    example: {
        vi: {
            type: String
        },
        en: {
            type: String
        }
    },
    create_at: {
        type: Date
    },
    update_at: {
        type: Date
    }
})


module.exports = mongoose.model('Word', WordSchema);