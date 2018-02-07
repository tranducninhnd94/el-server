var passport = require('passport');
var FacebookStractegy = require('passport-facebook');

var config = require('./auth.config');

passport.use(new FacebookStractegy(
    {
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        // profileFields: ['id', 'displayName', 'photos', 'email']
        profileFields: ['id','address', 'birthday', 'cover', 'currency', 'education', 'email', 'gender', 'locale', 'location', 'name', 'name_format', 'work', 'photos']
    },
    (accessToken, refreshToken, profile, done) => {
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log('profile: ', profile);
        done(null, profile);
    }
))


module.exports = passport;