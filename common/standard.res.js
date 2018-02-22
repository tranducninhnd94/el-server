module.exports = {
    objectSuccess: (rs, msg, value) => {
        return {
            result: rs,
            message: msg,
            value: value
        }
    },

    objectError: (rs, msg, err) => {
        return { result: rs, message: msg, error: err }
    },

    topicResponse: (topic) => {
        return {
            _id: topic._id,
            name: topic.name,
            image_url: topic.image_url,
            create_at: topic.create_at,
            update_at: topic.update_at ? topic.update_at : undefined
        }
    },

    wordResponse: (word) => {
        return {
            image_url: word.image_url,
            audio: word.audio,
            name: word.name,
            pronunciation: word.pronunciation,
            explanation: word.explanation,
            vocabulary: word.vocabulary,
            example: word.example,
            topic: word.topic
        }
    },
    userResponse: (user) => {
        return {
            _id: user._id,

            fullname: user.fullname ? user.fullname : null,

            gender: user.gender ? user.gender : null,

            email: user.email ? user.email : null,

            position: user.position ? user.position : null,

            avatar_url: user.avatar_url ? user.avatar_url : null,

            description: user.description ? user.description : null,

            role: user.role ? user.role : null,

            location: user.location ? user.location : null,

            graduation: user.graduation ? user.graduation : null,

            department: user.department ? user.department : null,

            job: user.job ? user.job : null,

            skill: user.skill ? user.skill : null,

            phone_number: user.phone_number ? user.phone_number : null,

            birthday: user.birthday ? user.birthday : null,

            create_at: user.create_at ? user.create_at : null
        }
    },
    fileResponse: (file) => {
        return {
            path: file.path.substring(7),   //igrone 'public/'
            mimetype: file.mimetype,
            size: file.size,
            originalname: file.originalname,
            encoding: file.encoding,
            filename: file.filename
        }
    },
    arrResponse: (ttl, val) => {
        return {
            total: ttl,
            list: val
        }
    }
}