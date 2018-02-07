var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TopicSchema = new Schema({
    name: {
        type: String,
        require
    },
    image_url: {
        type: String,
        require
    },
    create_at: {
        type: Date
    },
    update_at: {
        type: Date
    }
})

module.exports = mongoose.model('Topic', TopicSchema);