var express = require('express'),
    router = express.Router(),
    postController = require('../_controller/post.controller'),
    userController = require('../_controller/user.controller'),
    commentController = require('../_controller/comment.controller'),
    reqValid = require('./validation/req.valid'),
    validate = require('express-validation');

router
    .post('/comment', validate(reqValid.commentInsert), userController.authenticate, commentController.createComment)
    .post('/comment/reply/:commentId', validate(reqValid.commentInsert), userController.authenticate, commentController.replyComment)
    .get('/comment/post/:postId', validate(reqValid.commentFindByPost), commentController.getCommentByPost)
    .put('/comment/:commentId', validate(reqValid.commentUpdate), userController.authenticate, commentController.updateComment)
    .delete('/comment/:parentId', userController.authenticate, commentController.deleteComment)
    .delete('/comment/:parentId/:childId', userController.authenticate, commentController.deleteChildComment)
    .put("/comment/user/like/:commentId", userController.authenticate, commentController.likeComment)
    .put("/comment/user/disklike/:commentId", userController.authenticate, commentController.disklikeComment);
module.exports = router;