var Joi = require('joi');
// Joi.objectId = require('joi-objectid')(Joi);

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
    },

    postInsert: {
        body: {
            title: Joi.string().max(200).min(1).required(),
            description: Joi.string().max(500).min(30).required(),
            content: Joi.string().max(5000).min(1).required(),
            file_upload: Joi.array().default([]),
            status: Joi.string().only('SHOW', 'HIDDEN').default('SHOW')
        }
    },
    postUpdate: {
        body: {
            title: Joi.string().max(100).min(1).required(),
            content: Joi.string().max(5000).min(1).required(),
            file_upload: Joi.array().default([]),
            status: Joi.string().only('SHOW', 'HIDDEN').default('SHOW')
        }
    },

    postFind: {
        query: {
            title: Joi.string().alphanum(),
            author: Joi.string().alphanum(),
            createAt: Joi.date(),
            pageNum: Joi.number().min(0).default(0),
            pageSize: Joi.number().min(1).max(100).default(5),
            sortBy: Joi.string().only('author', 'create_at').default('create_at'),
            orderBy: Joi.string().only('asc', 'desc').default('desc')
        }
    },
    postFindOne: {
        // postId: Joi.objectId()
    },

    // comment
    commentInsert: {
        body: {
            content: Joi.string().min(1).max(500).required(),
            image_url: Joi.array().default([]),
            post: Joi.string().required(),  // post id
            status: Joi.string().only('SHOW', 'HIDDEN').default('SHOW'),
            replies: Joi.array().default([]),
        }
    },

    commentUpdate: {
        body: {
            content: Joi.string().min(1).max(500).required(),
            image_url: Joi.array().default([]),
            post: Joi.string().required(),
            status: Joi.string().only('SHOW', 'HIDDEN').default('SHOW')
        }
    },

    commentFindByPost: {
        query: {
            pageNum: Joi.number().min(0).default(0),
            pageSize: Joi.number().min(1).max(100).default(5),
        }
    }
}