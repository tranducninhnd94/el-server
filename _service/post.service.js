var Promise = require('promise'),
    mongoose = require('mongoose'),
    User = require('../_model/user.model'),
    Post = require('../_model/post.model');

module.exports = {
    insertPost: (postReq) => {
        return new Promise((resolve, reject) => {
            let newPost = {};
            newPost = new Post(postReq);
            newPost.save((err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            })
        })
    },
    updatePost: (postId, userId, postReq) => {
        return new Promise((resolve, reject) => {
            Post.findOneAndUpdate(
                {
                    _id: postId, user: userId
                },
                postReq,
                {
                    new: true
                },
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                })
        })
    }
    ,
    findAll: (cond) => {
        return new Promise((resolve, reject) => {
            let query = Post.find();
            if (cond) {
                console.log('cond :', cond);
                let title = cond.title;
                let author = cond.author;
                let createAt = cond.createAt;
                let pageNum = cond.pageNum;
                let pageSize = cond.pageSize;
                let sortBy = cond.sortBy;
                let orderBy = cond.orderBy;

                if (title) {
                    var regex = new RegExp(title, 'i');
                    query.where('title', regex);
                }

                // if (author) {
                //     query.where('user.fullname', 'Ninh Duc Tran');
                // }
                if (pageNum || pageNum == 0) {
                    query.limit(pageSize);
                }

                if (createAt) {
                    query.where('create_at', { $gt: createAt });
                }

                if (pageSize) {
                    query.skip(pageSize * pageNum);
                }

                if (sortBy === 'create_at') {
                    query.sort({ 'create_at': orderBy });
                } else {

                }
            }
            query
                .populate(
                    {
                        path: 'user',
                        select: ["fullname", "email", "avatar_url"]
                    }
                )
                .exec((err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                })
        })
    },

    findOne: (idPost) => {
        return new Promise((resolve, reject) => {

            Post
                .findOne({ _id: idPost })
                .populate(
                    {
                        path: 'user',
                        select: ["fullname", "email", "avatar_url"]
                    }
                )
                .exec((err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                })
        })
    },

    countPost: (cond) => {
        return new Promise((resolve, reject) => {
            let query = Post.find();
            if (cond) {
                console.log('cond :', cond);
                let title = cond.title;
                let author = cond.author;
                let createAt = cond.createAt;
                let sortBy = cond.sortBy;
                let orderBy = cond.orderBy;

                if (title) {
                    var regex = new RegExp(title, 'i');
                    query.where('title', regex);
                }

                if (createAt) {
                    query.where('create_at', { $gt: createAt });
                }

                if (sortBy === 'create_at') {
                    query.sort({ 'create_at': orderBy });
                } else {

                }
            }
            query
                .count()
                .exec((err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                })
        })
    },

    findAllV2: (limitReq, skipReq, statusReq) => {
        return new Promise((resolve, reject) => {
            Post.aggregate(
                [
                    {
                        $match: {
                            status: statusReq
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "creator"
                        }
                    },
                    {
                        $unwind: {
                            path: "$creator",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: "comments",
                            localField: "_id",
                            foreignField: "post",
                            as: "comments"
                        }
                    },
                    {
                        $unwind: {
                            path: "$comments",
                            preserveNullAndEmptyArrays: true
                        }
                    },


                    {
                        $project: {
                            "_id": 1,
                            "file_upload": 1,
                            "status": 1,
                            "create_at": 1,
                            "update_at": 1,
                            "title": 1,
                            "content": 1,
                            "description": 1,
                            "user._id": "$creator._id",
                            "user.fullname": "$creator.fullname",
                            "user.email": "$creator.email",
                            "user.avatar_url": "$creator.avatar_url",
                            "total_replies": { $ifNull: ["$comments.total_replies", 0] },
                            "total_view": 1,
                            "comments": { $cond: [{ $not: ["$comments"] }, 0, 1] }
                        }
                    },

                    {
                        $group: {
                            _id: "$_id",
                            file_upload: { $first: '$file_upload' },
                            status: { $first: '$status' },
                            create_at: { $first: '$create_at' },
                            update_at: { $first: '$update_at' },
                            title: { $first: '$title' },
                            description: { $first: '$description' },
                            content: { $first: '$content' },
                            user: { $first: '$user' },
                            total_view: { $first: "$total_view" },
                            total_comment: { $sum: { $sum: ["$comments", "$total_replies"] } }
                        }
                    },
                    {
                        $sort: { total_view: -1, total_comment: -1, create_at: -1 }
                    },

                    { $skip: skipReq },
                    {
                        $limit: limitReq
                    }

                ], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            )
        })
    },

    updateTotalView: (idPost) => {
        return new Promise((resolve, reject) => {
            Post.findOneAndUpdate(
                { _id: idPost },
                { $inc: { total_view: 1 } },
                { projection: { "_id": 1 } },
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                }
            )
        })
    }

}

