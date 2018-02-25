var express = require('express'),
    router = express.Router(),
    postController = require('../_controller/post.controller'),
    userController = require('../_controller/user.controller'),
    reqValid = require('./validation/req.valid'),
    validate = require('express-validation');
// validationMdws = require('../middlwares/validation.mdws');

router
    // using a middleware catch error from express-validation
    .post('/post', validate(reqValid.postInsert), userController.authenticate, postController.createPost)
    .put('/post/:postId', validate(reqValid.postUpdate),  userController.authenticate, postController.updatePost)
    .get('/post/detail/:postId', validate(reqValid.postFindOne), postController.getOne)
    .get('/post/list', validate(reqValid.postFind), postController.getAll);
module.exports = router;
