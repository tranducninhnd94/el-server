var postService = require('../_service/post.service'),
    userService = require('../_service/user.service'),
    standardRes = require('../common/standard.res'),
    commentService = require('../_service/comment.service');

module.exports = {
    createComment: (req, res, next) => {
        let userInfo = req.user;
        if (userInfo) {
            let commentReq = req.body;
            postService.findOne(commentReq.post).then(post => {
                if (post) {
                    commentReq.user = userInfo._id;
                    commentService.insertComment(commentReq).then(comment => {
                        if (comment) {
                            let commentResponse = standardRes.commentResponse(comment);
                            let objectSuccess = standardRes.objectSuccess(200, 'SUCCESS', commentResponse);
                            res.status(200);
                            return res.json(objectSuccess);
                        } else {
                            let objectSuccess = standardRes.objectSuccess(400, 'NO_OBJECT', 'Comment not create');
                            res.status(400);
                            return res.json(objectSuccess);
                        }
                    }, error => {
                        console.log(error);
                        res.status(500);
                        let objectError = standardRes.objectError(500, 'INTERNAL_SERVER', error);
                        return res.json(objectError);
                    })
                } else {
                    let objectSuccess = standardRes.objectSuccess(400, 'NO_OBJECT', 'post not exist');
                    res.status(400);
                    return res.json(objectSuccess);
                }
            }, error => {
                console.log(error);
                res.status(500);
                let objectError = standardRes.objecError(500, 'INTERNAL_SERVER', error);
                return res.json(objectError);
            })
        } else {
            res.status(403);
            let objecError = standardRes.objecError(403, 'Forbidden to access', null);
            return res.json(objecError);
        }
    },

    replyComment: (req, res, next) => {
        let userInfo = req.user;
        if (userInfo) {
            let replyReq = req.body;
            replyReq.user = userInfo._id;
            let commentId = req.params.commentId;

            commentService.insertReply(commentId, replyReq).then(result => {
                if (result) {
                    let objectSuccess = standardRes.objectSuccess(200, 'SUCCESS', result);
                    res.status(200);
                    return res.json(objectSuccess);
                } else {
                    let objectSuccess = standardRes.objectSuccess(400, 'NO_OBJECT', 'Comment not create');
                    res.status(400);
                    return res.json(objectSuccess);
                }
            }, error => {
                console.log(error);
                res.status(500);
                let objectError = standardRes.objecError(500, 'INTERNAL_SERVER', error);
                return res.json(objectError);
            })

        } else {
            res.status(403);
            let objecError = standardRes.objecError(403, 'Forbidden to access', null);
            return res.json(objecError);
        }
    },

    getCommentByPost: (req, res, next) => {
        let postId = req.params.postId;
        let pageNum = req.query.pageNum == undefined ? 0 : req.query.pageNum;
        let pageSize = req.query.pageSize == undefined ? 10 : req.query.pageSize;

        commentService.getCommentByPost(postId, pageSize, pageNum).then(result => {
            let comments = result || [];

            let commentsResponse = [];

            comments.forEach(function (comment) {
                let commentResponse = standardRes.commentResponse(comment);
                commentsResponse.push(commentResponse);
            }, this);

            let objectSuccess = standardRes.objectSuccess(200, 'SUCCESS', commentsResponse);
            res.status(200);
            return res.json(objectSuccess);
        }, error => {
            console.log(error);
            res.status(500);
            let objectError = standardRes.objecError(500, 'INTERNAL_SERVER', error);
            return res.json(objectError);
        })
    },

    updateComment: (req, res, next) => {
        let userInfo = req.user;

        let commentReq = req.body;
        let commentId = req.params.commentId;
        let userId = userInfo._id;

        commentService.updateComment(commentId, userId, commentReq).then(comment => {
            if (comment) {
                let commentResponse = standardRes.commentResponse(comment);
                let objectSuccess = standardRes.objectSuccess(200, 'SUCCESS', commentResponse);
                res.status(200);
                res.json(objectSuccess);
            } else {
                let objectError = standardRes.objecError(400, 'BAD_REQUEST', 'No document is updated');
                res.status(400);
                return res.json(objectError);
            }
        }, error => {
            console.log(error);
            res.status(500);
            let objectError = standardRes.objecError(500, 'INTERNAL_SERVER', error);
            return res.json(objectError);
        })
    },

    deleteComment: (req, res, next) => {
        let userInfo = req.user;
        let userId = userInfo._id;
        let parentId = req.params.parentId;
        commentService.deleteComment(parentId, userId).then(result => {
            if (result) {
                let objectSuccess = standardRes.objectSuccess(200, 'SUCCESS', result);
                res.status(200);
                res.json(objectSuccess);
            } else {
                let objectError = standardRes.objecError(400, 'BAD_REQUEST', 'No document is deleted');
                res.status(400);
                return res.json(objectError);
            }
        }, error => {
            console.log(error);
            res.status(500);
            let objectError = standardRes.objecError(500, 'INTERNAL_SERVER', error);
            return res.json(objectError);
        })
    },

    deleteChildComment: (req, res, next) => {
        let userInfo = req.user;
        let userId = userInfo._id;
        let parentId = req.params.parentId;
        let childId = req.params.childId;

        commentService.deleteChildInParent(parentId, childId).then(result => {
            if (result) {
                let objectSuccess = standardRes.objectSuccess(200, 'SUCCESS', result);
                res.status(200);
                res.json(objectSuccess);
            } else {
                let objectError = standardRes.objecError(400, 'BAD_REQUEST', 'No document is deleted');
                res.status(400);
                return res.json(objectError);
            }
        }, error => {
            console.log(error);
            res.status(500);
            let objectError = standardRes.objecError(500, 'INTERNAL_SERVER', error);
            return res.json(objectError);
        })
    },

    likeComment: (req, res, next) => {
        let userInfo = req.user;

        let commentReq = req.body;
        let commentId = req.params.commentId;
        let userId = userInfo._id;
        commentService.likeComment(commentId, userId).then(result => {
            if (result) {
                let objectSuccess = standardRes.objectSuccess(200, 'SUCCESS', result);
                res.status(200);
                res.json(objectSuccess);
            } else {
                let objectError = standardRes.objecError(400, 'BAD_REQUEST', 'NO comment is liked');
                res.status(400);
                return res.json(objectError);
            }
        }, error => {
            console.log(error);
            res.status(500);
            let objectError = standardRes.objecError(500, 'INTERNAL_SERVER', error);
            return res.json(objectError);
        })
    },

    disklikeComment: (req, res, next) => {
        let userInfo = req.user;

        let commentReq = req.body;
        let commentId = req.params.commentId;
        let userId = userInfo._id;

        commentService.disklikeComment(commentId, userId).then(result => {
            if (result) {
                let objectSuccess = standardRes.objectSuccess(200, 'SUCCESS', result);
                res.status(200);
                res.json(objectSuccess);
            } else {
                let objectError = standardRes.objecError(400, 'BAD_REQUEST', 'NO comment is diskliked');
                res.status(400);
                return res.json(objectError);
            }
        }, error => {
            console.log(error);
            res.status(500);
            let objectError = standardRes.objecError(500, 'INTERNAL_SERVER', error);
            return res.json(objectError);
        })
    }
}