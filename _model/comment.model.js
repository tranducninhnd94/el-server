var mongoose = require('mongoose'),
    Scheame = mongoose.Schema;

var User = require('./user.model'),
    Post = require('./post.model');

var CommentSchema = new Scheame({
    content: {
        type: String,
        required: true,
        trim: true
    },
    image_url: [
        {
            type: String
        }
    ],
    user: {
        type: Scheame.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: Scheame.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    status: {
        type: String,
        required: true,
        trim: true
    },
    replies: [
        {
            content: {
                type: String,
                required: true,
                trim: true
            },
            image_url: [
                {
                    type: String
                }
            ],
            user: {
                type: Scheame.Types.ObjectId,
                ref: 'User',
                required: true
            },
            post: {
                type: Scheame.Types.ObjectId,
                ref: 'Post',
                required: true
            },
            status: {
                type: String,
                required: true,
                trim: true
            },
            create_at: {
                type: Date,
                default: Date.now()
            },
            update_at: {
                type: Date
            }
        }
    ],
    total_replies: {
        type: Number,
        required: true,
        default: 0
    },

    users_like: [
        {
            type: Scheame.Types.ObjectId,
            ref: 'User',
            required: true,
            default: []
        },
    ],

    create_at: {
        type: Date,
        default: Date.now()
    },
    update_at: {
        type: Date
    }
})

// CommentSchema.pre('findOneAndRemove', (next) => {
//     console.log('aaaa', this.commentId);
//     if (this._id) {
//         CommentSchema.remove({
//             replies: this._id
//         }).exec();
//     }
//     next();
// })

module.exports = mongoose.model('Comment', CommentSchema);