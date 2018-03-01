var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = require('./user.model');
var FileUpload = require('./file-upload.modal');

var PostSchema = new Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    content: {
        type: String,
        required: true,
        trim: true

    },

    file_upload: [
        {
            type: Schema.Types.ObjectId, ref: 'FileUpload'
        }

    ],

    user: {
        type: Schema.Types.ObjectId, ref: 'User', required: true
    },

    status: {
        type: String,
        required: true,
        default: "SHOW"
    },

    total_view:{
        type: Number,
        default: 0
    },
    
    create_at: {
        type: Date,
        default: Date.now()
    },
    update_at: {
        type: Date
    }

});

module.exports = mongoose.model('Post', PostSchema);