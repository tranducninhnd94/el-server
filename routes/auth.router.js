var express = require('express');
var router = express.Router();
var passportFacebook = require('../auth/auth.facebook');


router.get('/auth/facebook', passportFacebook.authenticate('facebook', { session: false, scope: ['user_friends', 'public_profile'] }));

router.get('/auth/facebook/callback', passportFacebook.authenticate('facebook', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        res.json({ msg: 'Login success' });
    }
);

module.exports = router;