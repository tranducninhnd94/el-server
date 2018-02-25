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
    }
}

