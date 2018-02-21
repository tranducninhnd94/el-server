var Joi = require('joi');

module.exports = {
    userInsert: {
        body: {
            email: Joi.string().email().max(45).required(),
            password: Joi.string().alphanum().min(4).max(45),
            gender: Joi.string().only('Male', 'Female').required(),
            avatar_url: Joi.string().default('image/default_img.jpg'),
            position: Joi.string().only('User', 'Admin').default('User')
        }
    },

    userLogin: {
        email: Joi.string().email().max(45).required(),
        password: Joi.string().alphanum().required()
    }
}