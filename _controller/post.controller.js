var postService = require('../_service/post.service'),
    userService = require('../_service/user.service'),
    standardRes = require('../common/standard.res'),
    logger = require('../config/logger.config'),
    fileUploadService = require("../_service/file-upload.service");

var TAG = "POST_CONTROLLER";

module.exports = {
    createPost: (req, res, next) => {
        let userInfo = req.user;// get userObject from token
        if (userInfo) {

            let postReq = req.body;
            let emailUser = userInfo.email;
            let fileNameUsed = req.body.fileNameUsed;

            if (fileNameUsed) {

            }

            logger.log("info", TAG, "Create new post {}", userInfo, postReq)

            userService.findByEmail(emailUser).then(user => {
                if (user) {
                    // create post
                    postReq.user = user._id;    // set _id
                    postService.insertPost(postReq).then(post => {
                        let postResponse = standardRes.postResponse(post);
                        let objectSuccess = standardRes.objectSuccess(200, 'SUCCESS', postResponse);
                        res.status(200);
                        res.json(objectSuccess);
                    }, error => {
                        res.status(500);
                        let objectError = standardRes.objectError(500, 'INTERNAL_SERVER', error);
                        res.json(objectError);
                    })
                } else {
                    res.status(400);
                    let objectError = standardRes.objectError(400, 'USER_NOT_EXIST', null);
                    return res.json(objectError);
                }
            }, error => {
                logger.log('error', TAG, error);
                let objectError = standardRes.objectError(400, 'INTERNAL_SERVER', error);
                return res.json(objectError);
            })
        } else {
            res.status(403);
            let objectError = standardRes.objectError(403, 'FORBIDDEN_TO_ACCESS', null);
            return res.json(objectError);
        }
    },

    updatePost: (req, res, next) => {
        // console.log(req);
        let userInfo = req.user;// get userObject from token
        if (userInfo) {
            let postId = req.params.postId;
            let postReq = req.body;

            logger.log("info", TAG, "Update post {}", userInfo, postReq)

            postReq.update_at = Date.now(); // time update
            console.log(postId, ' ', userInfo._id, ' ', postReq);
            postService.updatePost(postId, userInfo._id, postReq).then(post => {
                if (post) {
                    let postResponse = standardRes.postResponse(post);
                    let objectSuccess = standardRes.objectSuccess(200, 'SUCCESS', postResponse);
                    res.status(200);
                    res.json(objectSuccess);
                } else {
                    let objectError = standardRes.objectError(400, 'BAD_REQUEST', 'No document is updated');
                    res.status(400);
                    return res.json(objectError);
                }
            }, error => {
                logger.log('error', TAG, error);
                let objectError = standardRes.objectError(500, 'INTERNAL_SERVER', error);
                return res.json(objectError);
            })
        } else {
            res.status(403);
            let objectError = standardRes.objectError(403, 'FORBIDDEN_TO_ACCESS', null);
            return res.json(objectError);
        }
    },

    getAll: (req, res, next) => {

        postService.countPost(req.query).then(total => {
            if (total) {
                postService.findAll(req.query).then(posts => {
                    if (posts) {

                        let objRes = {};
                        objRes.total = total;
                        let postsRes = [];

                        posts.forEach(function (post) {
                            let postResponse = standardRes.postResponse(post);
                            postsRes.push(postResponse);
                        }, this);

                        objRes.list = postsRes;
                        let objectSuccess = standardRes.objectSuccess(200, 'SUCCESS', objRes);
                        res.status(200);
                        return res.json(objectSuccess);
                    } else {
                        let objectSuccess = standardRes.objectSuccess(200, 'NO_OBJECT', {});
                        res.status(200);
                        return res.json(objectSuccess);
                    }
                }, error => {
                    console.log(error);
                    res.status(500);
                    let objectError = standardRes.objectError(500, 'INTERNAL_SERVER', error);
                    return res.json(objectError);
                })
            } else {
                let objectSuccess = standardRes.objectSuccess(200, 'NO_OBJECT', {});
                res.status(200);
                return res.json(objectSuccess);
            }
        }, error => {
            console.log(error);
            res.status(500);
            let objectError = standardRes.objectError(500, 'INTERNAL_SERVER', error);
            return res.json(objectError);
        })


    },

    getOne: (req, res, next) => {
        let postId = req.params.postId;
        if (postId) {
            postService.updateTotalView(postId).then(result => {
                console.log('update _ total_ view ', result);
                postService.findOne(postId).then(post => {
                    if (post) {
                        let postResponse = standardRes.postResponse(post);
                        let objectSuccess = standardRes.objectSuccess(200, 'SUCCESS', postResponse);
                        res.status(200);
                        return res.json(objectSuccess);
                    } else {
                        let objectSuccess = standardRes.objectSuccess(200, 'NO_OBJECT', {});
                        res.status(200);
                        return res.json(objectSuccess);
                    }
                }, error => {
                    console.log(error);
                    res.status(500);
                    let objectError = standardRes.objectError(400, 'INTERNAL_SERVER', error);
                    return res.json(objectError);
                })
            }, error => {
                console.log(error);
                res.status(500);
                let objectError = standardRes.objectError(500, 'INTERNAL_SERVER', error);
                return res.json(objectError);
            })
        }
    },

    getAllV2: (req, res, next) => {
        let pageNum = req.query.pageNum;
        let pageSize = req.query.pageSize;

        let limitReq = pageSize;
        let skipReq = pageNum * pageSize;
        let statusReq = req.query.status;
        postService.findAllV2(limitReq, skipReq, statusReq).then(result => {
            if (result) {
                let total = result.length ? result.length : 0;

                arrPostBasic = [];

                if (result.length) {
                    result.forEach(post => {
                        arrPostBasic.push(standardRes.postBasicRequest(post));
                    })
                }

                let arrResponse = standardRes.arrResponse(total, arrPostBasic);
                let objectSuccess = standardRes.objectSuccess(200, 'SUCCESS', arrResponse);
                res.status(200);
                return res.json(objectSuccess);
            } else {
                let objectSuccess = standardRes.objectSuccess(400, 'NO_OBJECT', {});
                res.status(400);
                return res.json(objectSuccess);
            }
        }, error => {
            console.log(error);
            res.status(500);
            let objectError = standardRes.objectError(500, 'INTERNAL_SERVER', error);
            return res.json(objectError);
        })
    },

    getAllPostUnread: (req, res, next) => {
        let userInfo = req.user;// get userObject from token
        let pageNum = req.query.pageNum;
        let pageSize = req.query.pageSize;

        let limitReq = pageSize;
        let skipReq = pageNum * pageSize;
        let statusReq = req.query.status;
        if (userInfo) {
            let userId = userInfo._id;
            userService.findById(userId).then(userResult => {
                if (userResult) {
                    let arrPostRead = userResult.list_posts_read ? userResult.list_posts_read : [];
                    postService.findUnread(limitReq, skipReq, statusReq, arrPostRead).then(result => {
                        if (result) {
                            let total = result.length ? result.length : 0;

                            arrPostBasic = [];

                            if (result.length) {
                                result.forEach(post => {
                                    arrPostBasic.push(standardRes.postBasicRequest(post));
                                })
                            }

                            let arrResponse = standardRes.arrResponse(total, arrPostBasic);
                            let objectSuccess = standardRes.objectSuccess(200, 'SUCCESS', arrResponse);
                            res.status(200);
                            return res.json(objectSuccess);
                        } else {
                            let objectError = standardRes.objectError(400, 'NO_OBJECT', {});
                            res.status(400);
                            return res.json(objectError);
                        }
                    }, error => {
                        console.log(error);
                        res.status(500);
                        let objectError = standardRes.objectError(500, 'INTERNAL_SERVER', error);
                        return res.json(objectError);
                    })

                } else {
                    let objectError = standardRes.objectError(400, 'USER_NOT_EXIST', {});
                    res.status(400);
                    return res.json(objectError);
                }
            }, error => {
                console.log(error);
                res.status(500);
                let objectError = standardRes.objectError(500, 'INTERNAL_SERVER', error);
                return res.json(objectError);
            })
        } else {
            res.status(403);
            let objectError = standardRes.objectError(403, 'FORBIDDEN_TO_ACCESS', null);
            return res.json(objectError);
        }
    },

    
}