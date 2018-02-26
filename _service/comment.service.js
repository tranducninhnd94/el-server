var Promise = require('promise'),
    mongoose = require('mongoose'),
    User = require('../_model/user.model'),
    Post = require('../_model/post.model'),
    Comment = require('../_model/comment.model');

module.exports = {
    insertComment: (commentReq) => {
        console.log(commentReq);
        return new Promise((resolve, reject) => {
            let newComment = new Comment(commentReq);
            newComment.save((err, comment) => {
                if (err) {
                    return reject(err);
                }
                return resolve(comment);
            })
        })
    },

    updateComment: (commentId, userId, commentReq) => {
        return new Promise((resolve, reject) => {
            Comment.findByIdAndUpdate(
                {
                    _id: commentId,
                    user: userId
                },
                commentReq,
                {
                    new: true
                },
                (err, comment) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(comment);
                }
            )
        })
    },

    getComment: (commentId) => {
        return new Promise((resolve, reject) => {

        })
    },

    deleteComment: (commentId, userId) => {
        return new Promise((resolve, reject) => {
            Comment.findOneAndRemove(
                {
                    _id: commentId,
                    user: userId
                }, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                }
            );
        })
    },

    getCommentByPost: (postId, pageSize, pageNum) => {
        return new Promise((resolve, reject) => {
            console.log(pageSize * pageNum);
            Comment
                .find({
                    post: postId
                })
                .sort({ 'create_at': -1 })
                .limit(Number(pageSize))
                .skip(Number(pageSize * pageNum))
                .populate(
                    {
                        path: 'user',
                        select: ["fullname", "email", "avatar_url"]
                    }
                )
                .populate('replies')
                .populate(
                    {
                        path: 'replies.user',
                        select: ["fullname", "email", "avatar_url"]
                    })

                .exec((err, comments) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(comments);
                })
        })
    },

    insertReply: (commentId, replyReq) => {
        console.log(replyReq);
        return new Promise((resolve, reject) => {
            Comment.update(
                { _id: commentId },
                {
                    $inc: { total_replies: 1 },
                    $push: {
                        replies: {
                            $each: [replyReq],
                            $sort: { create_at: -1 }
                        }
                    }
                },
                (err, comment) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(comment);
                }
            )
        })
    },

    deleteChildInParent: (parentId, childId) => {
        return new Promise((resolve, reject) => {
            Comment.findByIdAndUpdate(
                parentId,
                {
                    $inc: { total_replies: -1 },
                    $pull: {
                        replies: { _id: childId }
                    }
                },
                {
                    new: true
                },
                (err, comment) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(comment);
                }
            )
        })
    },

    likeComment: (commentId, userId) => {
        return new Promise((resolve, reject) => {
            Comment.update(
                {
                    _id: commentId
                },
                {
                    $addToSet: {
                        users_like: userId
                    }
                }
            ).exec((error, result) => {
                if (error) return reject(error);
                return resolve(result);
            })
        })
    },

    disklikeComment: (commentId, userId) => {
        return new Promise((resolve, reject) => {
            Comment.update(
                {
                    _id: commentId
                },
                {
                    $pull: {
                        users_like: userId
                    }
                }
            ).exec((error, result) => {
                if (error) return reject(error);
                return resolve(result);
            })
        })
    }
}